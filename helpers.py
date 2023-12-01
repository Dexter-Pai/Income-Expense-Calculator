from cs50 import SQL
from functools import wraps
from flask import g, request, redirect, url_for, session, render_template


db = SQL("sqlite:///ie.db")


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def error(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s

    try:
        if session["id"] == []:
            return render_template("apology.html", top=code, bottom=escape(message)), code, {"Refresh": "1; url=/"}
        elif db.execute("SELECT * FROM balance WHERE id = ?", session["id"]) == []:
            return render_template("apology.html", top=code, bottom=escape(message)), code, {"Refresh": "1; url=/balance"}
        else:
            return render_template("apology.html", top=code, bottom=escape(message)), code, {"Refresh": "1; url=/"}

    except KeyError:
        return render_template("apology.html", top=code, bottom=escape(message)), code, {"Refresh": "1; url=/"}