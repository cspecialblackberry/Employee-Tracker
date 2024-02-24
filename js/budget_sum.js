const inquirer = require('inquirer')

const department = require('./department')
const role = require('./role')
const employee = require('./employee')

const budgetSum = async () => {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: "Which department's budget would you like to see?",
            choices: (await department.viewDepartments()).map((dep) => {
                return {name: dep.name, value: dep.id}
            })
        }
    ])

    const depRoles = await role.viewRolesByDep(response)
    const allEmps = await Promise.all(depRoles.map(employee.viewEmployeesByRole))
    const allRoleIDs = (allEmps.flat(2)).map((emp) => emp.role_id)
    const allRoles = await Promise.all(allRoleIDs.map(role.viewRole))
    const allSalaries = (allRoles.flat(2)).map((role) => role.salary)
    return `
    The total budget of the ${((await department.viewDepartment(response.department_id)).flat(2)).map((dep) => dep.name)} department is $${allSalaries.reduce((total, num) => total + num)}.
    `
}

module.exports = {
    budgetSum
}