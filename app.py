import os
import datetime
import re

from cs50 import SQL
from flask import Flask, jsonify, redirect, render_template, request, session, abort
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import login_required, error
from werkzeug.exceptions import HTTPException


app = Flask(__name__,
            static_folder='static',
            template_folder='templates')
app.config["DEBUG"] = True


app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


db = SQL("sqlite:///ie.db")


# Global
TYPES = {
    "income" : ["salary", "side_hustle", "bonus", "other_income"],
    "expense" : ["rent", "food", "gas", "travel", "healthcare", "tax", "other_expense"]
    }



@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    data = db.execute("SELECT * FROM ie WHERE id = ?", session["id"])
    data = jsonify(data)
    print(data)
    return render_template("index.html")



#json hosting
@app.route("/json", methods=["GET"])
@login_required
def json():
    data = db.execute("SELECT * FROM ie WHERE id = ?", session["id"])
    print(data)
    return jsonify(data)



@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    return render_template("login.html")



@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")



@app.route("/auth", methods=["GET", "POST"])
def authenticate():
    if request.method == "POST":

        name = request.form.get("username")
        pw = request.form.get("password")

        data = db.execute("SELECT * FROM users WHERE name = ?", name)
        print(data)

        if data == []:
            return error("username does not exist")

        if not check_password_hash(data[0]["key"], pw):
            return error("password does not match the username")

        session["id"] = data[0]["id"]

        newUserCheck = db.execute("SELECT * FROM balance WHERE id = ?", session["id"])

        if newUserCheck == []:
            return redirect("/balance")
        else:
            return redirect("/")

    else:
        return render_template("login.html")



@app.route("/reg", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        id = db.execute("SELECT COUNT(*) AS n FROM users")
        id = id[0]["n"]
        id += 1

        name = request.form.get("username")
        pw = request.form.get("password1")
        pwcheck = request.form.get("password2")

        # check username
        if name == "":
            return error("username cannot be blank")

        # check password
        if pw == "" or pwcheck == "":
            return error("password cannot be blank")
        if pw != pwcheck:
            return error("password do not match")

        # check if user already exists
        data = db.execute("SELECT * FROM users WHERE name = ?", name)
        if len(data) != 0:
            return error("user already exists")

        # generate key hash
        key = generate_password_hash(pw)

        # insert data into database
        db.execute("INSERT INTO users VALUES (?, ?, ?)", id, name, key)

        return redirect("/")

    else:
        return redirect("/login")



@app.route("/balance", methods=["GET", "POST"])
@login_required
def balance():
    return render_template("balance.html")



@app.route("/updateBalance", methods=["GET", "POST"])
@login_required
def updateBalance():
    if request.method == "POST":
        balance = request.form.get("balance")

        if not balance.replace(".", "").isnumeric():
            return error("please type in number with two decimals")

        decimalPlaceCheck = balance.split(".")

        if len(decimalPlaceCheck) > 2:
            return error("not a valid number, please type in number with two decimals")

        balance = round(float(balance), 2)
        print(balance)

        db.execute("INSERT INTO balance ('id', 'start', 'end') VALUES (?, ?, ?)", session["id"], balance, balance)

        return redirect("/")

    else:
        redirect("/")



@app.route("/data_entry", methods=["GET", "POST"])
@login_required
def data_entry():
    if request.method == "POST":
        print(request.form)
        type_name = request.form.get("type_name")
        subtype_name = request.form.get("subtype_name")
        detail = request.form.get("detail")
        amount = request.form.get("amount")
        amount = float(amount)

        if type_name not in list(TYPES.keys()):
            return error("not a valid type, do not change the html elements")

        #using advanced list comprehension, validate subtype
        if not any(subtype_name in item for item in TYPES.values()):
            return error("not a valid subtype, do not change the html elements")

        if detail == "":
            db.execute("INSERT INTO ie ('id', 'type', 'subtype', 'amount') VALUES (?, ?, ?, ?)", session["id"], type_name, subtype_name, amount)
        else:
            db.execute("INSERT INTO ie ('id', 'type', 'subtype', 'amount', detail) VALUES (?, ?, ?, ?, ?)", session["id"], type_name, subtype_name, amount, detail)

        remaining = db.execute ("SELECT end FROM balance WHERE id = ?", session["id"])
        remaining = remaining[0]["end"]

        #calculate remaining balance
        if type_name == 'income':
            remaining = remaining + amount
        elif type_name == 'expense':
            remaining = remaining - amount
        else:
            return error("calculation error")

        db.execute("UPDATE balance SET end = ? WHERE id = ?", remaining, session["id"])

        return redirect("/")

    else:
        return render_template("data_entry.html")



@app.route("/history")
@login_required
def history():
    data = db.execute("SELECT * FROM ie WHERE id = ?", session["id"])
    print(data)
    return render_template("history.html", table=data)



# TODO: clean up the amount entered 174
# TODO: add max length on description value
# TODO: add unique id values to ie.db



@app.route("/about")
@login_required
def about():
    return render_template("about.html")



# TODO
@app.route("/setting")
@login_required
def setting():
    return render_template("setting.html")



# Testing
@app.route("/data_host", methods=["GET"])
def data_host():
    data = db.execute("SELECT users.name, balance.start, balance.end FROM users INNER JOIN balance ON users.id = balance.id WHERE users.id = ?", session["id"])
    print(data)
    return jsonify(data)


# Testing
@app.route("/test")
def testing():
    return render_template("test.html")



@app.route("/setting/listener", methods=["POST"])
def listener():
    data = request.get_json()
    print(data)
    if data['id'] == "password_change":
        old_password = data['old_password']
        new_password = data['new_password']
        username = db.execute("SELECT name, key FROM users WHERE id = ?", session["id"])

        if not (check_password_hash(username[0]['key'], old_password)):
            abort(401, description="Your old password do not match, try again")
        else:
            db.execute("UPDATE users SET key = ? WHERE id = ?", generate_password_hash(new_password), session["id"])
            return "Successfully updated Database"
    elif data['id'] == "balance_change":
        dbData = db.execute("SELECT start, end FROM balance WHERE id =?", session["id"])
        change = float(data['balance'])

        if dbData[0]['start'] > change :
            db.execute("UPDATE balance SET start = ?, end = ? WHERE id = ?", data['balance'], dbData[0]['end'] - (dbData[0]['start'] - change), session["id"])
        elif dbData[0]['start'] < change :
            db.execute("UPDATE balance SET start = ?, end = ? WHERE id = ?", data['balance'], dbData[0]['end'] - dbData[0]['start'] + change, session["id"])
        return "Successfully updated Database"

    else:
        abort(500, description="Bad Request")



if __name__ == '__main__':
    app.run(host="localhost", port=8000, debug=True)