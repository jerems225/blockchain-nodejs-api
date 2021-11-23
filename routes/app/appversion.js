const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
const AppController = require('../../controllers/app/appController');

router.get("/app/get/version", AppController.getVersion);
router.put("/app/update/version",jsonParser, AppController.updateVersion);

module.exports =  router;