const User = require('../models').User
const sequelize = require('sequelize')
const { okRes, errRes } = require('../tools/util.services')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const validate = require ("validate.js")
const {loginValdate,registerValdate} =require('../tools/validation')

exports.getProfile = async (req, res) => {
      const user = await User.findOne({
            where: {
                id:req.user.id,
            }
      })
    return okRes(res,{user})
}
exports.login = async (req, res) => {

    const body = req.body
      let notValid = validate(body, loginValdate());
      if (notValid) return errRes(res, notValid);
    try {

        const user = await User.findOne({
            where: {
                email:body.email
            }
        })

        if (!user) return errRes(res,{ message: 'User not found!' })

        if (!bcrypt.compareSync(body.password, user.password)) errRes(res,{ message: 'Incorrect password!' })

             let token = jwt.sign({ id: user.id }, config.appKey);
     
        return okRes(res,{user,token})

    } catch (e) {
        return errRes(res,{ message: e.message })
    }
}

exports.register = async (req, res) => {
        const body = req.body
      let notValid = validate(body, registerValdate());
    if (notValid) return errRes(res, notValid);
    const user = await User.findOne({
            where: {
                email:body.email
            }
    })
    if(user)return errRes(res,{err:"this account is already registered"})

    try {
        const user = await User.create(body)
       let token = jwt.sign({ id: user.id }, config.appKey);
     
        return okRes(res,{user,token})
    } catch (e) {
       return errRes(res,{ message: e.message })
    }
}



exports.update = async (req, res) => {
    const body = req.body;
    if (req.file) {
       body.avatar = req.file.filename
    }
    if (typeof body.avatar !== 'undefined' && body.avatar.length === 0) delete body.avatar

      let notValid = validate(body, registerValdate(false));
    if (notValid) return errRes(res, notValid);
    try {
   
        const user = await User.update(body,{
            where: {
                id:req.user.id
            }
        })
        delete user.password

        return okRes(res,{user})

    } catch (e) {
        return errRes(res,{ error: e.message })
    }
}
exports.search = async (req, res) => {

    try {

        const users = await User.findAll({
            where: {
                [sequelize.Op.or]: {
                    namesConcated: sequelize.where(
                        sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')),
                        {
                            [sequelize.Op.iLike]: `%${req.query.term}%`
                        }
                    ),
                    email: {
                        [sequelize.Op.iLike]: `%${req.query.term}%`
                    }
                },
                [sequelize.Op.not]: {
                    id: req.user.id
                }
            },
            limit: 10
        })

        return okRes(res,{data:users})

    } catch (e) {
        return errRes(res,{ error: e.message })
    }
}

