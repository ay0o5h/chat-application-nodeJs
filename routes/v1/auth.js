const router = require('express').Router()
const { login, register } = require('../../controllers/authController')
// const { Validator } = require('../../tools/validation')
// const {loginValdate } = require('../../tools/validation')
// const { rules: loginRules } = require('../validators/auth/login')

// router.post('/login', Validator, login)

// router.post('/register', [registrationRules, validate], register)

router.post('/login',  login)

router.post('/register', register)



module.exports = router