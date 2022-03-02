const ulTransaction = document.getElementById("transactions");
const balanceDisplay = document.querySelector("#balance");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");


const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = id => {
    transactions = transactions.filter(value => value.id !== id);
    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = (transaction) => {
    const operator = transaction.amount < 0 ? "-" : "+";
    const CSSclass = transaction.amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(transaction.amount)

    const li = document.createElement("li");
    li.classList.add(CSSclass);

    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `
    ulTransaction.append(li);
}

const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(value => value.amount);

    const total = transactionsAmount.reduce((acc, valorAtual) => acc + valorAtual, 0).toFixed(2);

    const income = transactionsAmount.filter(value => value > 0).reduce((acc, valorAtual) => {
        return acc + valorAtual;
    }, 0).toFixed(2)

    const expense = Math.abs(transactionsAmount.filter(value => value < 0).reduce((acc, valorAtual) => {
        return acc + valorAtual;
    }, 0)).toFixed(2);

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
    ulTransaction.innerHTML = "";
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

init();

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

const generateId = () => Math.round(Math.random() * 1000);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();

    if (transactionName === "" || transactionAmount === "") {
        alert("Por favor, preencha o nome e o valor da transação");
        return;
    }

    const transaction = {
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    }

    transactions.push(transaction);
    init();
    updateLocalStorage();

    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
})
