const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
const AppController = require('../../controllers/app/appController');
const { user_createNotification, all_createNotification, get_user_Notification, get_all_notification } = require('../../controllers/app/appController');

router.get("/app/get/version", AppController.getVersion);
router.put("/app/update/version",jsonParser, AppController.updateVersion);
router.post("/notification/user/create",jsonParser,user_createNotification);
router.post("/notification/all/create",jsonParser,all_createNotification);
router.get("/notification/user/getnotifs",get_user_Notification);
router.get("/notification/all/getallnotifs",get_all_notification);

module.exports =  router;