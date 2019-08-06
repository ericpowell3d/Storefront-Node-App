var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');
var fs = require('fs');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "storefront_db"
});

connection.connect(function (err) { // Establish the connection
    if (err) throw err;
    start();
});

function start() {
    console.log();
    inquirer.prompt({
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

function customerView() {
    console.log();
    start();
}

function managerView() {
    console.log();
    start();
}

function supervisorView() {
    console.log();
    start();
}