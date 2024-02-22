// Update employee managers.
//Done

// View employees by manager.
//Done

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

const sequelize = require('./config/connection.js')
const inquirer = require('inquirer')

const employee = require('./js/employee.js')
const role = require('./js/role.js')
const department = require('./js/department.js')


const runApp = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW EMP'
                },
                {
                    name: 'View all roles',
                    value: 'VIEW ROLES'
                },
                {
                    name: 'View all departments',
                    value: 'VIEW DEPT'
                },
                {
                    name: 'Add a new department',
                    value: 'ADD DEPT'
                },
                {
                    name: 'Add a new role',
                    value: 'ADD ROLL'
                },
                {
                    name: 'Add a new employee',
                    value: 'ADD EMP'
                },
                {
                    name: "Update an employee's role",
                    value: 'UPDT EMP'
                },
                {
                    name: "Update an employee's manager",
                    value: 'UPDT EMPM'
                },
                {
                    name: "View employees by manager",
                    value: 'VIEW EMPM'
                },
                {
                    name: 'View employees by department',
                    value: 'VIEW EMPD'
                }
            ]
        }
    ])

    const { selection } = response

    switch (selection) {
        case "VIEW EMP":
            console.table(await employee.viewEmployees())
            runApp()
            break
        case "VIEW ROLES":
            console.table(await role.viewRoles())
            runApp()
            break
        case "VIEW DEPT":
            console.table(await department.viewDepartments())
            runApp()
            break
        case "ADD DEPT":
            await department.addDepartment()
            runApp()
            break
        case "ADD ROLL":
            await role.addRole()
            runApp()
            break
        case "ADD EMP":
            await employee.addEmployee()
            runApp()
            break
        case "UPDT EMP":
            await employee.updateEmployeeRole()
            runApp()
            break
        case "UPDT EMPM":
            await employee.updateEmployeeManager()
            runApp()
            break
        case "VIEW EMPM":
            console.table((await employee.viewManagerEmployees()).flat())
            runApp()
            break
        case "VIEW EMPD":
            console.table(await employee.viewDepartmentEmployees())
            runApp()
            break
    }
}

sequelize.sync({ force: false }).then(runApp)

