require("dotenv").config()

module.exports = {
    port: process.env.PORT,
    appKey: process.env.APP_KEY,
    appUrl: process.env.APP_URL,
}