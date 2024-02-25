// Delete departments, roles, and employees.

const sequelize = require('./config/connection.js')
const inquirer = require('inquirer')

const employee = require('./js/employee')
const role = require('./js/role')
const department = require('./js/department')
const budgetSum = require('./js/budget_sum')
const updtEmployee = require('./js/update_employees')

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
                },
                {
                    name: 'View the full budget of a department',
                    value: 'DEP SUM'
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
            await updtEmployee.addEmployee()
            runApp()
            break
        case "UPDT EMP":
            await updtEmployee.updateEmployeeRole()
            runApp()
            break
        case "UPDT EMPM":
            await updtEmployee.updateEmployeeManager()
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
        case "DEP SUM":
            console.log(await budgetSum.budgetSum())
            runApp()
            break
    }
}

sequelize.sync({ force: false }).then(runApp)

