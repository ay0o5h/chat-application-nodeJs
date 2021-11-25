const User = require('../models/').User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { okRes, errRes } = require('../tools/util.services')
const validate = require ("validate.js")
const {loginValdate,registerValdate} =require('../tools/validation')

exports.login = async (req, res) => {
    // const { email, password } = req.body
    const body = req.body
      let notValid = validate(body, loginValdate());
      if (notValid) return errRes(res, notValid);
    try {
       

        // find the user
        const user = await User.findOne({
            where: {
                email:body.email
            }
        })

        if (!user) return errRes(res,{ message: 'User not found!' })

        if (!bcrypt.compareSync(password, user.password)) errRes(res,{ message: 'Incorrect password!' })

        const userWithToken = generateToken(user.get({ raw: true }))
        // userWithToken.user.avatar = user.avatar

        return okRes(res,userWithToken)

    } catch (e) {
        return errRes(res,{ message: e.message })
    }
}

exports.register = async (req, res) => {
        const body = req.body
      let notValid = validate(body, registerValdate());
      if (notValid) return errRes(res, notValid);

    try {
        const user = await User.create(req.body)

        const userWithToken = generateToken(user.get({ raw: true }))
        return okRes(res,userWithToken)
    } catch (e) {
       return errRes(res,{ message: e.message })
    }
}

const generateToken = (user) => {

    delete user.password

    const token = jwt.sign(user, config.appKey, { expiresIn: 86400 })

    return { ...{ user }, ...{ token } }
}