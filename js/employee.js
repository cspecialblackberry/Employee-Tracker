const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const role = require('./role.js')
const department = require('./department.js')

//fill the employee objects with missing information from related tables and returning the new objects to be printed in the console
const fillEmpTable = async (obj) => {
    const { role_id, manager_id, id, first_name, last_name } = obj
    const roleObj = (await role.viewRole(role_id)).flat()
    const { title, salary } = roleObj[0]
    const managerObj = (await viewEmployee(manager_id)).flat()
    let manager = 'NULL'
    if (managerObj[0]) {
        manager = `${managerObj[0].first_name} ${managerObj[0].last_name}`
    }
    return {
        id,
        first_name,
        last_name,
        title,
        salary,
        manager
    }

}

//returns all employees
const viewEmployees = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM employee")
    const employees = await Promise.all(result.map(fillEmpTable))
    return employees
}

//returns one specified employee
const viewEmployee = async (emp) => {
    const [result, meta] = await sequelize.query(`SELECT * FROM employee WHERE id=${emp}`)
    return result
}

//prompt to select a manager and returns all of that manager's employees
const viewManagerEmployees = async () => {
    const response = await inquirer.prompt(
        {
            type: 'list',
            message: 'Whose employees would you like to see?',
            name: 'employee_id',
            choices: (await viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        }
    )
    const result = await sequelize.query(`SELECT * FROM employee WHERE manager_id=${response.employee_id}`)
    if (result[0] == '') {
        return [{employees: 'This employee does not manage anyone.'}]
    } else {
        result.pop()
        const employees = await Promise.all((result.flat()).map(fillEmpTable))
        return employees
    }
}

//returns all employees of a specified role
const viewEmployeesByRole = async (role) => {
    const response = await sequelize.query(`SELECT * FROM employee WHERE role_id=${role}`)
    response.pop()
    return response
}

//select a department from a choice prompt and returns all of the employees in that department
const viewDepartmentEmployees = async () => {
    const response = await inquirer.prompt(
        {
            type: 'list',
            message: "Which department's employees would you like to see?",
            name: 'department_id',
            choices: (await department.viewDepartments()).map((dep) => {
                return { name: dep.name, value: dep.id }
            })
        }
    )
    const roleIDs = await role.viewRolesByDep(response)
    const employees = await Promise.all(roleIDs.map(viewEmployeesByRole))
    const newEmployees = await Promise.all((employees.flat(2)).map(fillEmpTable))
    return newEmployees

}

module.exports = {
    viewEmployees,
    viewManagerEmployees,
    viewDepartmentEmployees,
    viewEmployeesByRole,
    viewEmployee
}