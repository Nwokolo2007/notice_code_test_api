const User = require("../core/models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretkey = "abcdefgh12359800";

async function createNewUser(req) {
  let createdUser;
  try {
    hashedPw = await bcrypt.hash(req.password, 12);
    let user = new User({
      email: req.email,
      password: hashedPw,
    });

    createdUser = await user.save();
  } catch (err) {
    throw err;
  }

  return createdUser;
}

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    let user = await User.findOne({ email: email });

    if (!user) {
      let newUser = new User({
        email: email,
        password: password,
      });
      user = await createNewUser(newUser);
      console.log(user);
    }
    if (!user) {
      return res.status(400).json({ message: "could not create user" });
    }
    loadedUser = user;
    isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ email: loadedUser.email }, secretkey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token: token, Email: loadedUser.email });
  } catch (err) {
    next(err);
  }
};
