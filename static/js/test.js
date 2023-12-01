let div_main = document.getElementById("setting_main_menu");

let result = document.getElementById("result")

let change_name_btn = document.getElementById("change_name");
let change_balance_btn = document.getElementById("change_balance");

change_name_btn.addEventListener("click", sendData);
    // div_main.style.display = "none";

function sendData() {
    change_name_btn.innerHTML = "Clicked!";
    let value = "hello";
    $.ajax({
        url: '/data_listener',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'greet_word' : value}),
        success: function(response) {
            console.log(response)
            let data = response.value_returned
            // .map(each => ({
            //     key : Object.keys(each),
            //     value : Object.value(each),
            // }))
            console.log(data)
            result.innerHTML = data['greet_word']
            // result.innerHTML = Object.values(data)[0]
            // result.innerHTML = Object.values(response.value_returned);
        },
        error: function(error) {
            console.log(error)
        }
    })
}