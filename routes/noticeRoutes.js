const express =  require('express');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

router.get('/time', noticeController.getCurrentTime);

module.exports = router;