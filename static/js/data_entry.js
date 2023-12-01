const typeSelect = document.getElementById('type');
const subtypeSelect = document.getElementById('subtype');

const options = {
  income: [
    { text: "Salary", value: "salary" },
    { text: "Side Hustle",  value: "side_hustle" },
    { text: "Bonus",  value: "bonus" },
    { text: "Other",  value: "other_income" }
  ],
  expense: [
    { text: "Rent", value: "rent" },
    { text: "Food", value: "food" },
    { text: "Gas", value: "gas" },
    { text: "Travel", value: "travel" },
    { text: "Healthcare", value: "healthcare" },
    { text: "Tax", value: "tax" },
    { text: "Other", value: "other_expense" }
  ]
}

function createSubtype() {
  const selectedType = typeSelect.value;
  subtypeSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.textContent = "--Select an option--";
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  subtypeSelect.appendChild(placeholder);

  options[selectedType].forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.textContent = option.text;
    optionElement.value = option.value;
    subtypeSelect.appendChild(optionElement);
  })
}

typeSelect.addEventListener('change', createSubtype)

createSubtype();