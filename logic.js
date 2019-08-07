// Require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');
var fs = require('fs');

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

// From the customer's perspective
function customerView() {
	console.log();
	inquirer.prompt({ // Prompt to chose an action
		name: "action",
		type: "list",
		message: "What would you like to do?",
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
	start();
}

// From the manager's perspective
function managerView() {
	console.log();
	start();
}

// From the supervisor's perspective
function supervisorView() {
	console.log();
	start();
}