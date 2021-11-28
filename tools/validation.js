
 const validate = require ("validate.js")

module.exports = {

   loginValdate: (must=true) =>( {
        email: {
            presence: must,
            email: must,
                type: "string",
    },
    password: {
            presence: must,
            type: "string",
    }
    }),
    registerValdate: (must=true) =>( {
        fisrtName: {
            presence: must,
            type: "string",
        },
      lastName: {
            presence: must,
            type: "string",
    },
        email: {
            presence: must,
            email: true,
                type: "string",
    },
    password: {
            presence: must,
            type: "string",
    }
    })
}