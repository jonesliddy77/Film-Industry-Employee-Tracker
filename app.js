var mysql = require('mysql2');
const inquirer = require('inquirer');
const term = require('terminal-kit').terminal;
var figlet = require('figlet');
let deptArray = [];
let employeeArray = ['none'];
let roleArray = [];
// Connecting to MySql
var connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'jonesliddy77',
    database: 'employee_trackerDB',
});
term.red(
    '///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n'
);
console.log(
    figlet.textSync('Film Industry Employee Tracker!!\n', {
        font: 'Small Caps',
    })
);
term.red(
    '///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n'
);

// Starting Prompts
connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    startingQuetions();
});

// Starting prompt Questions Function
async function startingQuetions() {
    try {
        firstAnswer = await inquirer
            .prompt({
                type: 'list',
                message: 'Where would you like to go?',
                name: 'name',
                choices: [
                    'View All',
                    'View All Departments',
                    'Add New Department',
                    'View All Employees',
                    'Add New Employees',
                    'View All Roles',
                    'Add Roles',
                    'EXIT',
                ],
            })
            .then(function (res) {
                // Directing the user to what they click
                switch (res.name) {
                    case 'View All':
                        viewAll();
                        break;
                    case 'View All Departments':
                        viewDepartment();
                        break;
                    case 'Add New Department':
                        addDepartments();
                        break;
                    case 'View All Employees':
                        viewEmployee();
                        break;
                    case 'View All Roles':
                        viewRole();
                        break;
                    case 'Add Roles':
                        addRole();
                        break;
                    case 'Add New Employees':
                        addEmployee();
                        break;
                    default:
                        return connection.end();
                }
            });
    } catch (error) {
        console.log(error);
    }
    // Joining all the tables to show all the data
}
function viewAll() {
    connection.query(
        `
    SELECT employee.id as id, employee.first_name, employee.last_name,title, name as department, salary, CONCAT(manager.first_name, " ",manager.last_name) as manager 
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee as manager
    ON employee.manager_id = manager.id`,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            startingQuetions();
        }
    );
}

function getDepartments() {
    connection.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        results.forEach((item, index) => {
            deptArray.push(results[index].name);
        });
    });
}

// Showing the data in the Department table
async function viewDepartment() {
    const SQL_STATEMENT = 'SELECT * FROM department';

    const [res, fields] = await connection.promise().query(SQL_STATEMENT);
    console.table(res);
    startingQuetions();
}
// Prompting the user to creat a new department
async function addDepartments() {
    try {
        NewDepart = await inquirer
            .prompt({
                type: 'input',
                message: 'Whats the name of the department?',
                name: 'name',
            })
            .then(function (newD) {
                console.log(newD);
                connection.promise().query(`INSERT INTO department SET ?`, {
                    name: newD.name,
                });
                viewDepartment();
            });
    } catch (error) {
        console.log(error);
    }
}
// Showing the data in the Employee table
function viewEmployee() {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        startingQuetions();
    });
}
function getEmployee() {
    connection.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        results.forEach((item, index) => {
            employeeArray.push(results[index].first_name);
        });
    });
}
// Prompting the user to creat a new Enployeee
async function addEmployee() {
    try {
        await getRole();
        await getEmployee();
        NewEmpl = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'first name?',
                    name: 'first',
                },
                {
                    type: 'input',
                    message: 'last name?',
                    name: 'last',
                },
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the employee's role?",
                    choices: roleArray,
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who is the employee's manager?",
                    choices: employeeArray,
                },
            ])
            .then(function (newE) {
                connection.query(
                    `SELECT id FROM employee WHERE first_name = "${newE.manager}"`,
                    function (err, results) {
                        if (err) throw err;
                        let manager = results[0].id;
                        connection.query(
                            `SELECT id FROM role WHERE title = "${newE.role}"`,
                            function (err, results) {
                                if (err) throw err;
                                let role = results[0].id;
                                connection
                                    .promise()
                                    .query(`INSERT INTO employee SET ?`, {
                                        first_name: newE.first,
                                        last_name: newE.last,
                                        role_id: role,
                                        manager_id: manager,
                                    });
                                viewEmployee();
                            }
                        );
                    }
                );
            });
    } catch (error) {
        console.log(error);
    }
}
// Showing the data in the Role table
function viewRole() {
    connection.query('SELECT * FROM role',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startingQuetions();
        });
}
async function getRole() {
    connection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        results.forEach((item, index) => {
            roleArray.push(results[index].title);
        });
    });
}
// Prompting the user to creat a new Role
async function addRole() {
    try {
        await getDepartments();
        NewRoll = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'whats the title of the role?',
                    name: 'title',
                },
                {
                    type: 'input',
                    message: 'what the salary?',
                    name: 'salary',
                },
                {
                    name: 'roleLocation',
                    type: 'list',
                    message: 'where will the role be located',
                    choices: deptArray,
                },
            ])
            .then(function (newR) {
                console.log(newR);
                connection.query(
                    `SELECT id FROM department WHERE name = "${newR.roleLocation}"`,
                    function (err, results) {
                        if (err) throw err;
                        let department = results[0].id;
                        connection.promise().query(`INSERT INTO role SET ?`, {
                            title: newR.title,
                            salary: newR.salary,
                            department_id: department,
                        });
                        viewRole();
                    }
                );
            });
    } catch (error) {
        console.log(error);
    }
}
