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
  // TODO: Implement this function to view roles
  // You'll need to replace the SQL query and formatting logic
  // similar to the viewDepartments function
}

mainMenu();
