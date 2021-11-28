const User = require('../models').User
const jwt = require('jsonwebtoken')
const config = require('../config')
const { okRes, errRes } = require('../tools/util.services')
exports.auth =async (req, res, next) => {

    const token = req.headers.token
  
     try {
    let payload;
    payload = jwt.verify(token,config.appKey);
    // get user
    let user = await User.findOne({ where: { id: payload.id } });
    console.log({ user, payload });
    req.user = user;
    // next
    return next();
  } catch (error) {
    return errRes(res, {err:"invalid token"});
  }

}