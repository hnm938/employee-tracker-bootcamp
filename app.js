const inquirer = require("inquirer");
const connectionPool = require("./db");

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Exit",
        ],
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
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
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

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
        validate: (input) => input.trim() !== "", // Validate that the input is not empty
      },
    ])
    .then((answer) => {
      connectionPool
        .query("INSERT INTO department (name) VALUES (?)", [
          answer.departmentName,
        ])
        .then(() => {
          console.log(`Added department: ${answer.departmentName}`);
          mainMenu();
        })
        .catch((error) => {
          console.error("Error adding department:", error);
          mainMenu();
        });
    });
}

function addRole() {
  // TODO: Implement the function to add a role
}

function addEmployee() {
  // TODO: Implement the function to add an employee
}

// ... (same as before)

mainMenu();
