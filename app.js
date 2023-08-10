const inquirer = require("inquirer");
const connectionPool = require("./db");

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "Exit"],
      },
    ])
    .then((answer) => {
      switch (answer.choice) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        // Add cases for other menu options
        case "Exit":
          console.log("Goodbye!");
          connectionPool.end();
          break;
      }
    });
}

function viewDepartments() {
  connectionPool
    .query("SELECT * FROM department")
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      mainMenu();
    });
}

function viewRoles() {
  connectionPool
    .query(
      "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id"
    )
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      mainMenu();
    });
}

// Define functions for other menu options (addDepartment, addRole, etc.)

mainMenu();
