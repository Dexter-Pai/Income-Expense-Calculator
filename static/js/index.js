const valid_keys = ["salary", "side_hustle", "bonus", "other_income", "rent", "food", "gas", "travel", "healthcare", "tax", "other_expense"]
let text_1 = document.getElementById("text_1");
let text_2 = document.getElementById("text_2");
let spending = document.getElementById("spending");
let balance_btn = document.getElementById("balance_button");
let spending_btn = document.getElementById("spending_button");

let balance_data;
let parsedData;
let totalIncome = 0;
let totalExpense = 0;

fetch("/data_host")
    .then(response => response.json())
    .then(data => {
        balance_data = data.map(each =>({
            balance: each.end
        }))
        console.log(balance_data)
        }
)



fetch('/json')
    .then(response => response.json())
    .then(data => {
        // Use the data in your JavaScript code
        // console.log(data);

            // Parse the datetime strings into Date objects
    const parsedData = data.map(entry => ({
        amount: entry.amount,
        datetime: new Date(entry.datetime),
        year: new Date(entry.datetime).getFullYear(),
        month: new Date(entry.datetime).getMonth() + 1,
        day: new Date(entry.datetime).getDate(),
        week: new Date(entry.datetime).getDay(),
        detail: entry.detail,
        subtype: entry.subtype,
        type: entry.type,
    }));

    // console.log(parsedData);
    const mappedData = [];

    for (let i = 0; i < valid_keys.length; i++) {
        // mappedData[i]["key"] = valid_keys[i];
        // mappedData[i]["amount"] = 0;
        if (valid_keys[i] == "salary" || valid_keys[i] == "side_hustle" || valid_keys[i] == "bonus" || valid_keys[i] == "other_income") {
          mappedData.push({"key": valid_keys[i], "amount": 0, "type": "income", color: 'rgba(75, 192, 192, 0.5)'});
        } else {
          mappedData.push({"key": valid_keys[i], "amount": 0, "type": "expense", color: 'rgba(231, 109, 137, 1)'});
        }
    }
    // for (let i = 0; i < valid_keys.length; i++) {
    //     if (!Object.keys(mappedData).includes(valid_keys[i])) {
    //         mappedData[valid_keys[i]] = 0;
    //     }
    // }

    // // console.log(valid_keys);
    for (let i = 0; i < parsedData.length; i++) {
        // mappedData[parsedData[i]["subtype"]] += parsedData[i]["amount"]
        for (let j = 0; j < mappedData.length; j++) {
            if (mappedData[j]["key"] == parsedData[i]["subtype"]) {
                mappedData[j]["amount"] += parsedData[i]["amount"];
            }
        }
    }

    console.log(mappedData)

    // for (let j = 0; j < parsedData.length; j++) {
    //     for (let k = 0; k < mappedData.length; k++) {
    //         if (mappedData[k]parsedData[j]["subtype"])
    //     }
    // }

    // Separate income and expense data
    let incomeData = mappedData.filter(entry => entry.type === 'income');
    let expenseData = mappedData.filter(entry => entry.type === 'expense');


    for (let i = 0; i < incomeData.length; i++) {
      totalIncome += incomeData[i].amount;
  }

    for (let i = 0; i < expenseData.length; i++) {
      totalExpense += expenseData[i].amount;
  }

  change_text(totalIncome, totalExpense);

    console.log(totalIncome);
    console.log(totalExpense);

    // mappedData.push(
    //   {"key": "Total Income", "amount": totalIncome, "type": "income", color: 'rgba(75, 192, 192, 0.5)'},
    //   {"key": "Total Expense", "amount": totalExpense, "type": "expense", color: 'rgba(231, 109, 137, 1)'}
    //   )



    // console.log(mappedData.map(column => column.key), mappedData.map(column => column.key));
    console.log(incomeData);
    console.log(expenseData);

    new Chart(
      document.getElementById('income_chart'),
      {
        type: 'bar',
        data: {
          // labels: mappedData.filter(data => data.type == "income").map(column => column.key),
          labels: mappedData.map(column => column.key),
          datasets: [
            {
              label: 'Income by Category',
              data: mappedData.map(column => column.amount),
              backgroundColor: mappedData.map(each => each.color),
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              text: "Your Income Expense Chart",
              display: true,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              min: 0,
              ticks: {
                stepSize: 500,
              }
            }
          }
        }
      }
    );

    new Chart(
      document.getElementById('total_chart'),
      {
        type: 'bar',
        data: {
          // labels: mappedData.filter(data => data.type == "income").map(column => column.key),
          labels: ["Total Income", "Total Expense"],
          datasets: [
            {
              label: 'Total Income',
              data: [totalIncome, totalExpense],
              backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(231, 109, 137, 1)'],
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              text: "Total Income Vs Expense",
              display: true,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              min: 0,
              ticks: {
                stepSize: 500,
              }
            }
          }
        }
      }
    );
    // new Chart(
    //     document.getElementById('income_chart'),
    //     {
    //       type: 'bar',
    //       data: {
    //         labels: mappedData.filter(data => data.type == "income").map(column => column.key),
    //         datasets: [
    //           {
    //             label: 'Income by Category',
    //             data: incomeData.map(column => column.amount),
    //             backgroundColor: 'rgba(75, 192, 192, 0.5)',
    //             borderWidth: 1,
    //           }
    //         ]
    //       },
    //       options: {
    //         scales: {
    //           y: {
    //             min: 0,
    //             max: 10000,
    //             ticks: {
    //               stepSize: 10,
    //             }
    //           }
    //         }
    //       }
    //       // ,
    //       //     {

    //       //     }
    //     }
    //   );

    //   new Chart(
    //     document.getElementById('expense_chart'),
    //     {
    //       type: 'bar',
    //       data: {
    //           labels: mappedData.filter(data => data.type == "expense").map(column => column.key),
    //           datasets: [
    //             {
    //             label: 'Expense by Category',
    //             data: expenseData.map(column => column.amount),
    //             backgroundColor: 'rgba(231, 109, 137, 1)',
    //             borderWidth: 1,
    //             }
    //           ]

    //       },
    //       options: {
    //         scales: {
    //           y: {
    //             beginAtZero: true,
    //             suggestedMin: 0,
    //             suggestedMax: 10000,
    //           }
    //         }
    //       }
    //       // ,
    //       //     {

    //       //     }
    //     }
    //   );
    // console.log(expenseData);

    // for (let i = 0; i < incomeData.length; i++) {
    //     if (! valid_keys.includes(Object.values(incomeData[i]["subtype"]))) {
    //         delete incomeData[i][]);
    //     }
        // if (!valid_keys.includes(Object.values(incomeData[i]['subtype']))) {
        //
        // }
    // }

    // console.log(incomeData);

    // Group data by subtype and calculate total amounts
    // const incomeBySubtype = {};
    // const expenseBySubtype = {};

    // incomeData.forEach(entry => {
    //     if (!incomeBySubtype[entry.subtype]) {
    //         incomeBySubtype[entry.subtype] = 0;
    //     }
    //     incomeBySubtype[entry.subtype] += entry.amount;
    // });
    // ,


    // expenseData.forEach(entry => {
    //     if (!expenseBySubtype[entry.subtype]) {
    //         expenseBySubtype[entry.subtype] = 0;
    //     }
    //     expenseBySubtype[entry.subtype] += entry.amount;
    // });

    // console.log(incomeBySubtype)
    // console.log(expenseBySubtype)


    // let key_collection = []
    // for (let i = 0; i < incomeData.length; i++) {
    //     if (!key_collection.includes(incomeData[i]['subtype'])) {
    //         key_collection.push(incomeData[i]['subtype'])
    //     }
    // };

    // for (let i = 0; i < expenseData.length; i++) {
    //     if (!key_collection.includes(expenseData[i]['subtype'])) {
    //         key_collection.push(expenseData[i]['subtype'])
    //     }
    // };

    // const incomeSubtypes = Array.from(new Set(incomeData.map(entry => entry.subtype)));
    // const expenseSubtypes = Array.from(new Set(expenseData.map(entry => entry.subtype)));

    // const key_collection = [...incomeSubtypes, ...expenseSubtypes].sort();
    // let key_collection = []
    // for (let i = 0; i < Object.keys(incomeBySubtype).length; i++) {
    //     key_collection.push(Object.keys(incomeBySubtype)[i])
    // };

    // for (let i = 0; i < Object.keys(expenseBySubtype).length; i++) {
    //     key_collection.push(Object.keys(expenseBySubtype)[i])
    // }
    // key_collection.push(Object.keys(incomeBySubtype))
    // key_collection.push(Object.keys(expenseBySubtype))
    // console.log(key_collection)

    // Prepare data for the chart
    // const chartData = {
    //     labels: key_collection, // Subtypes as labels
    //     datasets: [
    //         {
    //             label: 'Income',
    //             data: Object.values(incomeBySubtype), // Total income amounts
    //             backgroundColor: 'rgba(75, 192, 192, 0.5)', // Green color for income
    //             borderWidth: 1,
    //         },
    //         {
    //             label: 'Expense',
    //             data: Object.values(expenseBySubtype), // Total expense amounts
    //             backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red color for expense
    //             borderWidth: 1,
    //         },
    //     ],
    // };

    // // Create the chart
    // const ctx = document.getElementById('myChart').getContext('2d');
    // new Chart(ctx, {
    //     type: 'bar',
    //     data: chartData,
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //             },
    //         },
    //     },
    // });
    // const incomeDataset = {
    //     label: 'Income',
    //     data: key_collection.map(subtype => incomeData.filter(entry => entry.subtype === subtype).map(entry => entry.amount) || 0),
    //     backgroundColor: 'rgba(75, 192, 192, 0.5)', // Green color for income
    //     borderWidth: 1,
    // };

    // const expenseDataset = {
    //     label: 'Expense',
    //     data: key_collection.map(subtype => expenseData.filter(entry => entry.subtype === subtype).map(entry => entry.amount) || 0),
    //     backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red color for expense
    //     borderWidth: 1,
    // };

    // // Prepare data for the chart
    // const chartData = {
    //     labels: key_collection, // Combined list of subtypes
    //     datasets: [incomeDataset, expenseDataset],
    // };

    // // Create the chart
    // const ctx = document.getElementById('myChart').getContext('2d');
    // new Chart(ctx, {
    //     type: 'bar',
    //     data: chartData,
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //             },
    //         },
    //     },
    // });




    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function change_text(totalIncome, totalExpense) {
  if (totalIncome < totalExpense) {
    text_1.innerHTML = 'You spend ';
    spending.innerHTML = Math.abs(Math.round((totalIncome - totalExpense) * 100) / 100);
    spending.style.color = 'red';
    spending.style.display = 'inline';
    text_2.innerHTML = 'more than you earn!';
    text_2.style.display = 'inline';
  } else if (totalIncome > totalExpense) {
    text_1.innerHTML = 'You earn ';
    spending.innerHTML = Math.round((totalIncome - totalExpense) * 100) / 100;
    spending.style.color = 'green';
    spending.style.display = 'inline';
    text_2.innerHTML = 'more than you spend!';
    text_2.style.display = 'inline';
  } else {
    text_1.innerHTML = 'You spend as much as you earn!';
    spending.style.color = 'red';
    spending.style.display = 'none';
    text_2.style.display = 'none';
  }
}

spending_btn.addEventListener('click', () => {
  change_text(totalIncome, totalExpense);
});

balance_btn.addEventListener('click', () => {
  text_1.innerHTML = 'Your remaining balance is ';
  spending.innerHTML = balance_data[0]['balance'] + '. ';
  text_2.style.display = 'none';
  if (balance_data[0]['balance'] <= 0) {
    spending.style.color = 'red';
    text_2.innerHTML = "You're broke!";
    text_2.style.display = 'inline';
  } else {
    spending.style.color = 'green';
  }
});