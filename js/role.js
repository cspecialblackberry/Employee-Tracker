const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const department = require('./department.js')

const viewRoles = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM role")
    return result
}

const addRole = async () => {
    const response = await inquirer.prompt([
        {
            type: 'text',
            message: 'What is the name of the roll?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'What is the salary?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'What is the department?',
            name: 'department_id',
            choices: (await department.viewDepartments()).map((dep) => {
                return {name: dep.name, value: dep.id}
            })
        }

    ])
    const post = await sequelize.query(`INSERT INTO role (title, salary, department_id) values ('${response.title}', ${response.salary}, ${response.department_id})`)
    console.log('Successfully added new role!')
}

module.exports = {
    viewRoles,
    addRole
}