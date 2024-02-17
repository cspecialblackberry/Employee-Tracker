const sequelize = require('../config/connection.js')


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

module.exports = {
    viewDepartments
}