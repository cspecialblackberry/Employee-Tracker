const sequelize = require('../config/connection.js')

const viewEmployees = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM employee")
    const resultNames = result.map((emp) => `${emp.first_name} ${emp.last_name}`)
    return resultNames
}