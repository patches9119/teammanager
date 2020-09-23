var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3310,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "company_db"
});

start();

function start() {

    inquirer
        .prompt([{
                type: "list",
                message: "What would you like to do today?",
                name: "answer",
                choices: ["View Departments", "View Roles", "View Employees", "Add a Department", "Add a Role", "Add an Employee"]
            },

        ])
        .then(answers => {
            if (answers.answer === 'Add a Department') {
                addDepartment();
            } else if (answers.answer === 'Add a Role') {
                addRole();
            } else if (answers.answer === 'Add an Employee') {
                addEmployee();
            } else if (answers.answer === 'View Employees') {
                viewEmployees();
            } else if (answers.answer === 'View Departments') {
                viewDepartments();
            } else if (answers.answer === 'View Roles') {
                viewRoles();
            }
        });
}


function addDepartment() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is the name of the department you would like to add?",
                name: "name"
            },

        ])
        .then(answers => {
            connection.query("INSERT INTO department (name) values (?)", [answers.name], function (err, res) {
                if (err) throw err;
                console.log("New Department Successfully Added!")
                connection.end();
                start();
            });
        });
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        var depname = [];
        var depob = {
            id: "",
            name: ""
        };
        var dep = [];
        for (let x = 0; x < res.length; x++) {
            depob.id = res[x].id;
            depob.name = res[x].name;
            dep.push(depob);
            depname.push(res[x].name);
            depob = {
                id: "",
                name: ""
            };
        }
        var questions = [{
                type: "input",
                message: "What is the name of the role?",
                name: "name"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "salary"
            },
            {
                type: "list",
                message: "What Department is the Role in?",
                name: "department",
                choices: depname
            }
        ];

        inquirer
        .prompt(questions)
        .then(answers => {
            var depnum;
            console.log(dep);
            for(let y = 0; y < dep.length; y++) {
                if(answers.department === dep[y].name) {
                    depnum = dep[y].id;
                }
            }
            connection.query("INSERT INTO role SET ?", {title: answers.name, salary: answers.salary, department_id: depnum}, function (err, res) {
                if (err) throw err;
                console.log("New Role Successfully Added!")
                connection.end();
                start();
            });
            
        });




    });

}

function addEmployee() {

}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log("Current Departments:\n");
        for (let i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " Name: " + res[i].name + "\n");
        }
        connection.end();
        start();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log("Current Employees:\n");
        for (let i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " Name: " + res[i].name + "\n");
        }
        connection.end();
        start();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.log("Current Roles:\n");
        for (let i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " \nTitle: " + res[i].title + " \nSalary: " + res[i].salary + "\n\n");
        }
        connection.end();
        start();
    });
}