const User = require("../core/models/user");
const {body, validationResult } = require("express-validator");
const getDb = require("../core/database/database").getDb;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../core/models/user");
const secretkey = "abcdefgh12359800";

function createNewUser(req) {
  try {
    let user;
    bcrypt
      .hash(req.password, 12)
      .then((hashedPw) => {
        user = new User({
          email: req.email,
          password: hashedPw,
        });
        return user.save();
      })
      return user;
  } catch (error) {
    throw error;
  }
}

exports.login = (req, res, next) => {
    console.log(req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password =  req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {

      if (!user) {
        let  newUser = new User({
          email: email,
          password: password,
        });
        user = createNewUser(newUser); 
      } 
      if(!user)
      {
          return res.status(400).json({"message":"could not create user"});
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
      
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign({ email: loadedUser.email }, secretkey, {
        expiresIn: "1h",
      });
      console.log(token);

      res.status(200).json({ token: token, Email: loadedUser.email });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
