const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const department = require('./department')

//fill the role objects with missing information from related tables and returning the new objects to be printed in the console
const fillRoleTable = async (obj) => {
    const { id, title, salary, department_id } = obj
    const departmentObj = (await department.viewDepartment(department_id)).flat()
    const dept = departmentObj[0].name
    return {
        id,
        title,
        salary,
        dept
    }
}

//returns all roles
const viewRoles = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM role")
    const newRoles = await Promise.all(result.map(fillRoleTable))
    return newRoles
}

//returns all the roles in a specified department
const viewRolesByDep = async (obj) => {
    const response = await sequelize.query(`SELECT * FROM role WHERE department_id=${obj.department_id}`)
    response.pop()
    return (response.flat()).map((role) => role.id)
}

//return a specified role
const viewRole = async (role) => {
    const response = await sequelize.query(`SELECT * FROM role WHERE id=${role}`)
    response.pop()
    return response
}

//add a new role
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
    viewRole,
    viewRoles,
    addRole,
    viewRolesByDep
}