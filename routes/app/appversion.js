const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
const AppController = require('../../controllers/app/appController');
const { user_createNotification, all_createNotification, get_user_Notification, get_all_notification, readNotif, createPolicy, updatePolicy, createFaq, updateFaq, createSupport, getPolicy, getFaq, getSupport } = require('../../controllers/app/appController');
const { getAllAnnonce, getAnnonce, createAnnonce, updateAnnonce, deleteAnnonce } = require('../../controllers/app/annonceController');

router.get("/app/get/version", AppController.getVersion);
router.put("/app/update/version",jsonParser, AppController.updateVersion);
router.post("/notification/user/create",jsonParser,user_createNotification);
router.post("/notification/all/create",jsonParser,all_createNotification);
router.get("/notification/user/getnotifs",get_user_Notification);
router.get("/notification/all/getallnotifs",get_all_notification);
router.put("/notification/read",readNotif);

//app setting
router.get("/app/settings",getPolicy)
router.post("/app/settings/create",jsonParser,createPolicy);
router.put("app/settings/update",jsonParser,updatePolicy);

//app FAQ
router.get("/app/faq",getFaq)
router.post("/app/faq/create",jsonParser,createFaq);
router.put("/app/faq/update/:id_question",jsonParser,updateFaq);

//app support/help
router.get("/app/support",getSupport)
router.post("/app/support/create",jsonParser,createSupport);

//app announce 
router.get("/app/annonce",getAllAnnonce);
router.get("/app/annonce/:id_annonce",getAnnonce);
router.post("/app/annonce/create",jsonParser,createAnnonce);
router.put("/app/annonce/update",jsonParser,updateAnnonce);
router.delete("/app/annonce/delete/:id_annonce",deleteAnnonce)

module.exports =  router;