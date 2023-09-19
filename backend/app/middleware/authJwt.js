const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  const token = req.headers.accesstoken;
  if (!token) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }
  User.findOne({ where: { encryptedKey: token } })
    .then(data => {
      if (data) {
        res.locals.user_exist = true;
        res.locals.user_id = data.id;
        next();
      }
    })
    .catch(err => {
      res.locals.user_exist = false;
      next();
    });
};
const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;
