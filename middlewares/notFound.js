const {errRes } = require('../tools/util.services')

exports.notFound= (req, res, next) => {
  return errRes(res, {err:`Not Found`}, 404);
};