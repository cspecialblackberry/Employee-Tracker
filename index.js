const sequelize = require('./config/connection.js')
const inquirer = require('inquirer')

const viewEmployees = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM employee")
    console.log(result)
    runApp()
}

const viewRoles = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM role")
    console.log(result)
    runApp()
}

const viewDepartments = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM department")
    return result
   
}

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
    const departments = await sequelize.query("SELECT * FROM department")
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
            viewEmployees()
            break   
        case "VIEW ROLES":
            viewRoles()
            break
        case "VIEW DEPT":
            viewDepartments()
            break
        case "ADD DEPT":
            addDepartment()
            break
        case "ADD ROLL":
            addRoll()
            break
        case "ADD EMP":
            break
        case "UPDT EMP":
            break
    }
}

sequelize.sync({force: false}).then(runApp)

