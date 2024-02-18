const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')


// const viewDepartments = async () => {
//     const [result, meta] = await sequelize.query("SELECT * FROM department")
//     const resultNames = result.map((dep) => dep.name)
//     return resultNames
// }

const viewDepartments = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM department")
    const resultNames = result.map((dep) => dep.name)
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
}

module.exports = {
    viewDepartments,
    addDepartment
}