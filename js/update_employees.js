const inquirer = require('inquirer')
const sequelize = require('../config/connection')

const employee = require('./employee')
const role = require('./role')

//prompt asking who is the manager and returns the response
const managerPrompt = async () => {
    const response = await inquirer.prompt(
        {
            type: 'list',
            message: 'Who is their manager?',
            name: 'manager_id',
            choices: (await employee.viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        }
    )
    return response
}

//sequelize query to insert a new employee
const insertEmployee = async (emp) => {
    return await sequelize.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${emp.first_name}', '${emp.last_name}', ${emp.role}, ${emp.manager_id})`)
}

//add a new employee
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

//change a current employee's role
const updateEmployeeRole = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee_id',
            choices: (await employee.viewEmployees()).map((emp) => {
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

//change a current employee's manager
const updateEmployeeManager = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee_id',
            choices: (await employee.viewEmployees()).map((emp) => {
                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
            })
        },
        {
            type: 'confirm',
            message: 'Will they have a manager?',
            name: 'manager_bool'
        }
    ])
    let manager = null
    if(response.manager_bool===true){
        const newManager = await inquirer.prompt([
            {
                type: 'list',
                message: 'Who is their new manager?',
                name: 'manager_id',
                choices: (await employee.viewEmployees()).map((emp) => {
                    return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
                })
            }
        ])
        manager = newManager.manager_id
    }
    const update = await sequelize.query(`UPDATE employee SET manager_id=${manager} WHERE id=${response.employee_id}`)
    console.log(`Successfully updated employee!`)
}

module.exports = {
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager
}