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
          "Update an employee role",
          "View employees by manager",
          "View employees by department",
          "Calculate department budget",
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
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View employees by manager":
          viewEmployeesByManager();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
          break;
        case "Calculate department budget":
          calculateDepartmentBudget();
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
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the role:",
        validate: (input) => input.trim() !== "",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the role:",
        validate: (input) => !isNaN(input),
      },
      // You can add more prompts for role-related data here
    ])
    .then((answers) => {
      // Use the answers to insert the role into the database
      // Then return to the main menu
      mainMenu();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
        validate: (input) => input.trim() !== "",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
        validate: (input) => input.trim() !== "",
      },
      // You can add prompts for role and manager here
    ])
    .then((answers) => {
      // Use the answers to insert the employee into the database
      // Then return to the main menu
      mainMenu();
    });
}

function updateEmployeeRole() {
  connectionPool
    .query("SELECT * FROM employee")
    .then(([employeeRows]) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select an employee to update:",
            choices: employeeRows.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          // You can add a prompt for selecting a new role here
        ])
        .then((answers) => {
          // Use the answers to update the employee's role in the database
          // Then return to the main menu
          mainMenu();
        });
    })
    .catch((error) => {
      console.error("Error fetching employees:", error);
      mainMenu();
    });
}

function viewEmployeesByManager() {
  connectionPool
    .query("SELECT * FROM employee WHERE manager_id IS NOT NULL")
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error fetching employees by manager:", error);
      mainMenu();
    });
}

function viewEmployeesByDepartment() {
  connectionPool
    .query(
      "SELECT e.id, e.first_name, e.last_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN employee m ON e.manager_id = m.id"
    )
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error fetching employees by department:", error);
      mainMenu();
    });
}

function calculateDepartmentBudget() {
  connectionPool
    .query(
      "SELECT department.id, department.name, SUM(role.salary) AS total_budget FROM department LEFT JOIN role ON department.id = role.department_id GROUP BY department.id"
    )
    .then(([rows]) => {
      console.table(rows);
      mainMenu();
    })
    .catch((error) => {
      console.error("Error calculating department budget:", error);
      mainMenu();
    });
}

mainMenu();