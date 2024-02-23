const sequelize = require('../config/connection.js')
const inquirer = require('inquirer')

const role = require('./role.js')
const department = require('./department.js')

const fillEmpTable = async (obj) => {
    const { role_id, manager_id } = obj
    const roleObj = (await role.viewRole(role_id)).flat()
    const { title, salary } = roleObj[0]
    const managerObj = (await viewEmployee(manager_id)).flat()
    let manager = 'NULL'
    if (managerObj[0]) {
        manager = `${managerObj[0].first_name} ${managerObj[0].last_name}`
    }
    const { id, first_name, last_name } = obj
    return {
        id,
        first_name,
        last_name,
        title,
        salary,
        manager
    }

}

const viewEmployees = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM employee")
    const employees = await Promise.all(result.map(fillEmpTable))
    return employees
}

const viewEmployee = async (emp) => {
    const [result, meta] = await sequelize.query(`SELECT * FROM employee WHERE id=${emp}`)
    return result
}

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

const viewEmployeesByRole = async (role) => {
    const response = await sequelize.query(`SELECT * FROM employee WHERE role_id=${role}`)
    response.pop()
    return response
}

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

const managerPrompt = async () => {
    const response = await inquirer.prompt(
        {
            type: 'list',
            message: 'Who is their manager?',
            name: 'manager_id',
            choices: (await viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        }
    )
    return response
}

const insertEmployee = async (emp) => {
    return await sequelize.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${emp.first_name}', '${emp.last_name}', ${emp.role}, ${emp.manager_id})`)
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
            message: 'What is their role?',
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

    switch (managerBool) {
        case true:
            const manager = await managerPrompt()
            const newEmpT = {
                ...response,
                ...manager
            }
            await insertEmployee(newEmpT)
            console.log('Successfully added new employee!')
            break
        case false:
            const newEmpF = {
                ...response,
                manager_id: null
            }
            await insertEmployee(newEmpF)
            console.log('Successfully added new employee!')
            break
    }
}

const updateEmployeeRole = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee_id',
            choices: (await viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        },
        {
            type: 'list',
            message: 'What is their new role?',
            name: 'role_id',
            choices: (await role.viewRoles()).map((role) => {
                return { name: role.title, value: role.id }
            })
        }
    ])
    const update = await sequelize.query(`UPDATE employee SET role_id=${response.role_id} WHERE id=${response.employee_id}`)
    console.log('Successfully updated employee!')
}

const updateEmployeeManager = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee_id',
            choices: (await viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        },
        {
            type: 'list',
            message: 'Who is their new manager?',
            name: 'manager_id',
            choices: (await viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        }
    ])
    const update = await sequelize.query(`UPDATE employee SET manager_id=${response.manager_id} WHERE id=${response.employee_id}`)
    console.log('Successfully updated employee!')
}

module.exports = {
    viewEmployees,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    viewManagerEmployees,
    viewDepartmentEmployees
}