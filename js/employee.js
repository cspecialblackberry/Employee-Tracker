const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const role = require('./role.js')

const viewEmployees = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM employee")
    return result
}

const managerPrompt = async () => {
    const response = await inquirer.prompt(
        {
            type: 'list',
            message: 'Who is their manager?',
            name: 'manager_id',
            choices:(await viewEmployees()).map((emp) => {
                    return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
                })    
        }
    )
    return response
}

const addEmployee = async () => {
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
            choices: (await role.viewRoles()).map((role) => {
                return { name: role.title, value: role.id }
            })
        },
        {
            type: 'confirm',
            message: 'Do they have a manager?',
            name: 'managerBool'
        }
    ])

    const { managerBool } = response
    console.log(managerBool)

    switch(managerBool){
        case true:
            const manager = await managerPrompt()
            const newEmpT = {
                ...response,
                ...manager
            }
            console.log(newEmpT)
            break
        case false:
            const newEmpF = {
                ...response,
                manager_id: null
            }
            console.log(newEmpF)
            break
    }
}

module.exports = {
    viewEmployees,
    addEmployee
}