const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const viewDepartments = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM department")
    return result
}

const addDepartment = async () => {
    const response = await inquirer.prompt([
        {
            type: 'text',
            message: 'What is the department name?',
            name: 'name'
        }
    ])
    const post = await sequelize.query(`INSERT INTO department (name) values ('${response.name}')`)
    console.log('Successfully added new department!')
}

module.exports = {
    viewDepartments,
    addDepartment
}