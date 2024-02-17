const sequelize = require('./config/connection.js')
const inquirer = require('inquirer')

const employee = require('./js/employee.js')
const role = require('./js/role.js')
const department = require('./js/department.js')

// const viewEmployees = async () => {
//     const [result, meta] = await sequelize.query("SELECT * FROM employee")
//     const resultNames = result.map((emp) => `${emp.first_name} ${emp.last_name}`)
//     return resultNames
// }

// const viewRoles = async () => {
//     const [result, meta] = await sequelize.query("SELECT * FROM role")
//     const resultTitles = result.map((role) => role.title)
//     return resultTitles
// }

// const viewDepartments = async () => {
//     const [result, meta] = await sequelize.query("SELECT * FROM department")
//     const resultNames = result.map((dep) => dep.name)
//     return resultNames
// }

const addDepartment = async () => {
    const response = await inquirer.prompt([
        {
            type: 'text',
            message: 'what is the department name?',
            name: 'name'
        }
    ])
    const post = await sequelize.query(`INSERT INTO department (name) values ('${response.name}')`)
}

const addRoll = async () => {
    const response = await inquirer.prompt([
        {
            type: 'text',
            message: 'What is the name of the roll?',
            name: 'roll'
        },
        {
            type: 'input',
            message: 'What is the salary?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'what is the department?',
            name: 'department',
            choices: (await viewDepartments()).map((dep) => {
                return {name: dep.name, value: dep.id}
            })
        }

    ])
    console.log(response)
}

const addEmployee = async () => {
    const departments = await sequelize.query("SELECT * FROM department")
    const response = await inquirer.prompt([
        {
            type: 'text',
            message: 'What is their first name?',
            name: 'first_name'
        },
        {
            type: 'text',
            message: 'What is their last name?',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'what is their role?',
            name: 'role',
            choices: (await viewDepartments()).map((dep) => {
                return {name: dep.name, value: dep.id}
            })
        }

    ])
    console.log(response)
}

const runApp = async() => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: [
                {
                    name: 'view all employees',
                    value: 'VIEW EMP'
                },
                {
                    name: 'view all roles',
                    value: 'VIEW ROLES'
                },
                {
                    name: 'view all departments',
                    value: 'VIEW DEPT'
                },
                {
                    name: 'add a new department',
                    value: 'ADD DEPT'
                },
                {
                    name: 'add a new role',
                    value: 'ADD ROLL'
                },
                {
                    name: 'add a new employee',
                    value: 'ADD EMP'
                },
                {
                    name: "update an employee's role",
                    value: 'UPDT EMP'
                }
            ]
        }
    ])

    const { selection } = response

    switch(selection){
        case "VIEW EMP":
            console.log( await viewEmployees())
            break   
        case "VIEW ROLES":
            console.log( await viewRoles())
            break
        case "VIEW DEPT":
            console.log( await department.viewDepartments())
            break
        case "ADD DEPT":
            addDepartment()
            break
        case "ADD ROLL":
            addRoll()
            break
        case "ADD EMP":
            addEmployee()
            break
        case "UPDT EMP":
            break
    }
}

sequelize.sync({force: false}).then(runApp)

