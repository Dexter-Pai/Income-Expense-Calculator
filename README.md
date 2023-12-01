# Income and Expense Calculator
#### Video Demo:  https://youtu.be/5XyprbC3mUo
## Description

## Idea Conception
As someone who is just starting up and managing in the food business industry, keeping a record of all the income and expenses is no easy feat without any accountant on my payroll. Most of the tools I found online are inadequate to keep track of all the different categories such as inventory expenses, sales, paychecks for employees, etc. A personalized program to take care of all the record keeping at the touch of a button instead of filling out lengthy forms and manually creating spreadsheets, would be very useful.

My passion with computer programming pushes me to learn it on my free time, so I stumbled upon CS50 course. It has been a treasure trove of knowledge for me. I wanted the final project to be something that would help me keep track of my spendings for me at the touch of a button.

What I developed is far from perfect but right now it is a working demo of a basic income expense calculator which can be improved to my personal needs in the future.

### Development and Features
This project took me close to two months to complete. Some of the notable features are as follows:
* 1700 lines of code across 24 different files, more to be added in the future
* 12 .html files
* 3  .css files
* 4  .js files
* 1   SQL database featuring 3 seperate tables
* chart.js
* sqlite database featuring
* hosting json data
* fetching json that is being hosted
* async functions in Javascript
* animation in CSS

and many more...

## Idea Execution

### Overview

* When request by ```'GET METHOD'```, login is required for every route except ```'/login'```
* Login page features a nav pill that will dynamically change to login and sign up menus.

### Signup
* Signup will check the following
  * throw error if username and/or password is blank
  * if password is not equal to confirm password
  * check if username already exist in the database
  * actual password will not be stored in the database, the hashed password is stored instead
* After the user is registered, they will be redirected back to login

### Login
* Login will check the following
  * directly accessing ```'/login'``` via ```'GET REQUEST'``` will clear the session cache if exists
  * login attempts will generate hash from username and password entered and check the generated hash against database
  * on successful login
    * newly created accounts will be asked to add starting balance
    * redirect to ```'/'``` route homepage

### Starting Balance
* Upon entering the starting balance, program will accept the balance floating numbers format, up to two decimal points and update the database.
* Remaining balance can be updated in the setting menu

### Home Page
* The homepage features two charts with different sized canvases, featuring a smaller chart with total income and expense on the bottom left and a larger chart on the right, featuring detailed income and expense according to different categories.
* The top left shows two buttons which will change to show either the remaining balance or how much you spend/save more than what you earn. If you are overspending, it will show in red `#FF0000`. If you earn more, the number will show up in green instead `#00FF00`.
* If the user has a negative remaining balance, it will say they are in debt and broke!

### Data Entry
* Data entry can be done through the ```'Data Entry'``` menu in the nav bar.
* This page features the following
  * Subcategory menu will change depending if the amount entered is an income or an expense.
  * You can add the details to each transaction.
  * The update database button will save the data into the database.
  * Database will automatically update the date and time of the transaction.

### History
* History page allows user to see the entered data in the form of a table from newest data all the way down to older entries.
* It will show the date and time of the transaction that is entered.

### About
* About page will show a brief info about the developer.
* Click the ```'About'``` title to go back to home page.

### Setting
* Setting icon will rotate 180 degree upon mouse hover.
* It features the following
  * show the username and balance
  * allow user to change the password
  * allow user to update the starting balance

### Logout
* Logging out will clear the session of the user.

## Notable features
* In ```'Data Entry'``` page, ```'Category'``` dropdown select menu will populate depending on the ```'income'``` or ```'expense'```.
* All the data from the database, related to the current ```'session'``` will be hosted to the route ```'/json'``` by the following code in ```'app.py'```
```
data = db.execute("SELECT * FROM ie WHERE id = ?", session["id"])
return jsonify(data)
```
 The hosted data can be fetched by the program at all times.
* asynchronize data fetching is utilized to populate the charts in home page by defining global variables in ```'/static/js/index.js'```

## What's next?
* Plans to implement users to manipulate data by adding data filtering feature by ```'month'```.
* Ability to delete users from database
* Night mode
* Personalizing the working demo, so I can finally use in my business.

## Special Thanks
Special thanks to ```'Prof. David J. Malan'``` and the ```'CS50 team'``` for putting together this amazing course. It has been a phenomenal experience. Special thanks to my dad ```'U Pandavamsa'``` and my girlfriend ```'May Thin Khine'``` for their continuous support throughout life and struggles.

I am now at a point where I can confidently say, I have created a web-app from scratch!
With a little bit of effort and dedication on my part, I hope I can one day become a full-time software developer and achieve my dreams. Coding makes me feel exhilarated.

# This was CS50!