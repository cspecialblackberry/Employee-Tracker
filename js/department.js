const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

//view all departments
const viewDepartments = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM department")
    return result
}

//view one specified department
const viewDepartment = async (dep) => {
    const response = await sequelize.query(`SELECT * FROM department WHERE id=${dep}`)
    response.pop()
    return response
}

//add a new department
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
    addDepartment,
    viewDepartment
}