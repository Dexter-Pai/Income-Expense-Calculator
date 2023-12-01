let parsedData;
let data = {};


let setting_menu = document.getElementById("setting_menu");
let password_menu = document.getElementById("password_menu");
let balance_menu = document.getElementById("balance_menu");
let result_div = document.getElementById("result_div");
let result = document.getElementById("result");
let back_btn = document.getElementById("back");
let user_info_username = document.getElementById("user_info_username");
let user_info_balance = document.getElementById("user_info_balance");


let change_password_btn = document.getElementById("change_password");
let change_balance_btn = document.getElementById("change_balance");


change_password_btn.addEventListener("click", changePassword);
change_balance_btn.addEventListener("click", changeBalance);


function back() {
    balance_menu.style.display = "none";
    password_menu.style.display = "none";
    setting_menu.style.display = "block";
    back_btn.style.display = "none";
    result_div.style.display = 'none';
}


async function ajax_request() {
    $.ajax({
        url: '/setting/listener',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response)
            success(response)
        },
        error: function(error) {
            console.log(error)
            success(error.responseText.replace('<!doctype html>\n<html lang=en>\n<title>401 Unauthorized</title>\n<h1>Unauthorized</h1>\n<p>','').replace('</p>\n',''));
        }
    });
}


function changePassword() {
    setting_menu.style.display = 'none';
    password_menu.style.display = 'block';
    back_btn.style.display = "block";
}


function changeBalance() {
    setting_menu.style.display = 'none';
    balance_menu.style.display = 'block';
    back_btn.style.display = "block";
}


function success(e) {
    result_div.style.display = 'block';
    result.innerHTML = e;
}


function sendData_password() {
    data["id"] = "password_change";
    data["old_password"] = document.getElementById("old_password").value;
    data["new_password"] = document.getElementById("new_password").value;
    confirm_password = document.getElementById("confirm_password").value;

    if (data["new_password"] != confirm_password) {
        return success("new password do not match confirm password! Please try again.")
    }
    console.log(data);
    ajax_request();
}


function sendData_balance() {
    data["id"] = "balance_change";
    data["balance"] = document.getElementById("balance").value;
    ajax_request();
    if (result.innerHTML = 'Successfully updated Database') {
        user_info_balance.innerHTML = 'balance : ' + document.getElementById("balance").value;
    }
}


fetch("/data_host")
    .then(response => response.json())
    .then(data => {
        parsedData = data.map(each =>({
            name: each.name,
            balance: each.start
        }))
        user_info_username.innerHTML = 'username : ' + parsedData[0]['name'];
        user_info_balance.innerHTML = 'balance : ' + parsedData[0]['balance'];
        console.log(parsedData);
        }
)


function initialize() {
    password_menu.style.display = 'none';
    balance_menu.style.display = 'none';
    result_div.style.display = 'none';
    back_btn.style.display = "none";
    console.log(parsedData);
}


initialize();