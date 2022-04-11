const express =  require('express');
const{body,validationResult } =  require('express-validator');
const router =  express.Router();
var bodyParser = require('body-parser')
 
 
// create application/json parser
var jsonParser = bodyParser.json()
const authController  = require('../controllers/authController');

router.post('/login',jsonParser,[
    body('email').isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password')
      .trim().escape()
      .isLength({ min: 5 })
   
  ], authController.login); // take this out later

module.exports = router;