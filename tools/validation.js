

const { okRes, errRes } = require('./util.services')
 const validate = require ("validate.js")

module.exports = {

   loginValdate: () =>( {
        email: {
            presence: true,
            email: true,
                type: "string",
    },
    password: {
            presence: true,
            type: "string",
    }
    }),
    registerValdate: () =>( {
        fisrtName: {
            presence: true,
            type: "string",
        },
      lastName: {
            presence: true,
            type: "string",
    },
        email: {
            presence: true,
            email: true,
                type: "string",
    },
    password: {
            presence: true,
            type: "string",
    }
    })
}