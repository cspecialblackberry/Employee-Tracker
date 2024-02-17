const sequelize = require('../config/connection.js')

const viewRoles = async () => {
    const [result, meta] = await sequelize.query("SELECT * FROM role")
    const resultTitles = result.map((role) => role.title)
    return resultTitles
}