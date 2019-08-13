// Require npm packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// Establish the connection with mysql
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "storefront_db"
});

// On program startup (when the connection is established)
connection.connect(function (err) {
	if (err) throw err;
	start();
});

// Start/Reset function called after an action is terminated
function start() {
	console.log();
	inquirer.prompt({ // Prompt to chose a view
		name: "view",
		type: "list",
		message: "Which view would you like to see?",
		choices: [
			"{EXIT}",
			"Customer View",
			"Manager View",
			"Supervisor View"
		]
	}).then(function (choice) {
		switch (choice.view) {
			case "{EXIT}":
				connection.end();
				break;
			case "Customer View":
				customerView();
				break;
			case "Manager View":
				managerView();
				break;
			case "Supervisor View":
				supervisorView();
				break;
		}
	});
}

// CUSTOMER OPTIONS //

// List of options for the customer
function customerView() {
	console.log();
	inquirer.prompt({ // Prompt to chose an action
		name: "action",
		type: "list",
		message: "Hello customer! What would you like to do?",
		choices: [
			"{BACK}",
			"View or purchase from the list of products"
		]
	}).then(function (choice) {
		switch (choice.action) {
			case "{BACK}":
				start();
				break;
			case "View or purchase from the list of products":
				customerSelection();
				break;
		}
	});
}
// Product selection for the customer view
function customerSelection() {
	console.log();
	connection.query(`SELECT id, product, department, price, stock FROM products`, function (err, res) {
		if (err) throw err;
		let listProducts = [`{BACK}`];
		for (var i = 0; i < res.length; i++) {
			listProducts.push(`$${res[i].price} - ${res[i].product} - ${res[i].stock} in stock`);
		}
		inquirer.prompt({ // Prompt to chose an action
			name: "selection",
			type: "list",
			message: "Which item would you like to purchase?",
			choices: listProducts
		}).then(function (choice) {
			let getItem = choice.selection.split(` - `);
			getItem = getItem[1];
			// console.log(getItem);
			switch (choice.selection) {
				case "{BACK}":
					start();
					break;
				default:
					customerAmount(getItem);
					break;
			}
		});
	});
}
// Selecting the amount of product the customer wants
function customerAmount(item) {
	console.log();
	inquirer.prompt({ // Prompt to input an amount
		name: "amount",
		type: "input",
		message: "How many would you like to purchase?"
	}).then(function (choice) {
		connection.query(`SELECT id, product, department, price, stock FROM products WHERE ?`, { product: item }, function (err, res) {
			if (err) throw err;
			if (isNaN(choice.amount) || choice.amount < 0) {
				console.log(`\nPlease enter a valid amount!`);
				customerAmount(item);
			}
			else if (choice.amount == 0 || choice.amount == "") {
				console.log(`\nNo amount purchased! Returning to start...`);
				start();
			}
			else if (choice.amount > res[0].stock) {
				console.log(`\nAmount is too high! Please consider other people who might want to buy this item!`);
				customerAmount(item);
			}
			else {
				let cost = Math.round(res[0].price * choice.amount * 100) / 100
				connection.query("UPDATE products SET ? WHERE ?", [{ stock: res[0].stock - choice.amount }, { product: item }], function (err, res2) { // Update the query table
					if (err) throw err;
					console.log(`\nYou have purchased ${choice.amount} ${item}(s) for the amount of $${cost.toFixed(2)}!`);
					start();
				});
			}
		});
	});
}

// MANAGER OPTIONS //

// List of options for the manager
function managerView() {
	console.log();
	inquirer.prompt({ // Prompt to chose an action
		name: "action",
		type: "list",
		message: "Hello Mr. Manager! What would you like to do?",
		choices: [
			"{BACK}",
			"View products",
			"View low inventory",
			"Add to inventory",
			"Add new product"
		]
	}).then(function (choice) {
		switch (choice.action) {
			case "{BACK}":
				start();
				break;
			case "View products":
				managerViewProduct();
				break;
			case "View low inventory":
				managerViewLow();
				break;
			case "Add to inventory":
				managerAddInventory();
				break;
			case "Add new product":
				managerAddProduct();
				break;
		}
	});
}

// View current products as the manager
function managerViewProduct() {
	console.log();
	connection.query(`SELECT id, product, department, price, stock FROM products`, function (err, res) {
		if (err) throw err;
		let table = new Table({ head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'STOCK'], colWidths: [6, 50, 35, 12, 12] });
		for (let i = 0; i < res.length; i++) {
			table.push([res[i].id, res[i].product, res[i].department, res[i].price, res[i].stock]);
			// console.log(`${res[i].id} | ${res[i].product} | ${res[i].department} | ${res[i].price} | ${res[i].stock}`);
		}
		console.log(table.toString());
		managerView();
	});
}

// View low inventory as the manager
function managerViewLow() {
	console.log();
	connection.query(`SELECT id, product, department, price, stock FROM products WHERE stock < 50`, function (err, res) {
		if (err) throw err;
		let table = new Table({ head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'STOCK'], colWidths: [6, 50, 35, 12, 12] });
		for (let i = 0; i < res.length; i++) {
			table.push([res[i].id, res[i].product, res[i].department, res[i].price, res[i].stock]);
			// console.log(`${res[i].id} | ${res[i].product} | ${res[i].department} | ${res[i].price} | ${res[i].stock}`);
		}
		console.log(table.toString());
		managerView();
	});
}

// Add to the inventory as a manager (Product selection for adding to the inventory)
function managerAddInventory() {
	console.log();
	connection.query(`SELECT id, product, department, price, stock FROM products`, function (err, res) {
		if (err) throw err;
		let listProducts = [`{BACK}`];
		for (let i = 0; i < res.length; i++) {
			listProducts.push(`${res[i].id} | ${res[i].product} | ${res[i].department} | ${res[i].price} | ${res[i].stock}`);
		}
		inquirer.prompt({ // Prompt to chose an action
			name: "selection",
			type: "list",
			message: "Which item would you like to add more of?",
			choices: listProducts
		}).then(function (choice) {
			let getItem = choice.selection.split(` | `);
			getItem = getItem[1];
			// console.log(getItem);
			switch (choice.selection) {
				case "{BACK}":
					managerView();
					break;
				default:
					managerAddAmount(getItem);
					break;
			}
		});
	});
}
// Selecting the amount of product the manager wants to add to the inventory
function managerAddAmount(item) {
	console.log();
	inquirer.prompt({ // Prompt to input an amount
		name: "amount",
		type: "input",
		message: "How many would you like to add to this stock?"
	}).then(function (choice) {
		connection.query(`SELECT id, product, department, price, stock FROM products WHERE ?`, { product: item }, function (err, res) {
			if (err) throw err;
			if (isNaN(choice.amount) || choice.amount < 0) {
				console.log(`\nPlease enter a valid amount!`);
				customerAmount(item);
			}
			else if (choice.amount == 0 || choice.amount == "") {
				console.log(`\nNo amount added! Returning to manager view...`);
				managerView();
			}
			else {
				let cost = Math.round(res[0].price * choice.amount * 100) / 100
				connection.query("UPDATE products SET ? WHERE ?", [{ stock: parseInt(res[0].stock) + parseInt(choice.amount) }, { product: item }], function (err, res2) { // Update the query table
					if (err) throw err;
					console.log(`\nYou have added ${choice.amount} ${item}(s) for the amount of $${cost.toFixed(2)}! Current stock: ${parseInt(res[0].stock) + parseInt(choice.amount)}`);
					managerView();
				});
			}
		});
	});
}

// Add a brand new product as the manager (Select a department to add the product to)
function managerAddProduct() {
	console.log();
	connection.query(`SELECT department FROM departments`, function (err, res) {
		if (err) throw err;
		let listDepartments = [`{BACK}`];
		for (let i = 0; i < res.length; i++) {
			listDepartments.push(`${res[i].department}`);
		}
		inquirer.prompt({ // Prompt to chose an action
			name: "selection",
			type: "list",
			message: "Which department does this item belong in?",
			choices: listDepartments
		}).then(function (choice) {
			switch (choice.selection) {
				case "{BACK}":
					start();
					break;
				default:
					inquirer.prompt([ // Prompt to input product properties
						{
							name: "name",
							type: "input",
							message: "What is the name of this product?"
						},
						{
							name: "cost",
							type: "input",
							message: "What is the cost of this product?"
						},
						{
							name: "inventory",
							type: "input",
							message: "How much of this product would you like to add?"
						}
					]).then(function (inputs) {
						if (isNaN(inputs.cost) || inputs.cost <= 0 || isNaN(inputs.inventory) || inputs.inventory <= 0) {
							console.log(`\nPlease enter a valid amount for either the cost or inventory!`);
							managerView();
						}
						else {
							let cost = Math.round(inputs.cost * 100) / 100
							connection.query(`INSERT INTO products SET ?`, { product: inputs.name, department: choice.selection, price: cost.toFixed(2), stock: inputs.inventory }, function (err, res2) {
								if (err) throw err;
								console.log(`\nYou have added ${inputs.inventory} ${inputs.name}(s) for the amount of $${(inputs.inventory * cost).toFixed(2)}!`);
								managerView();
							});
						}
					});
					break;
			}
		});
	});
}

// SUPERVISOR OPTIONS //

// List of options for the supervisor (COMING AT A LATER TIME)
function supervisorView() {
	console.log();
	start();
}