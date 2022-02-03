const express = require('express');
var bodyParser = require('body-parser');
const { getPageRestrict, getPage, addPage, updatePage, deletePage } = require('../../controllers/user/accessController');
const { getUserType, getType, addType, updateType, deleteType } = require('../../controllers/user/typeController');
const { getUsers, countUser } = require('../../controllers/user/userController');
// create application/json parser
var jsonParser = bodyParser.json();
const router = express.Router();

//access
router.get("/user/access",getPageRestrict);
router.get("/user/access/:id_page",getPage);
router.post("/user/access/create",addPage);
router.put("/user/access/update/:id_page",updatePage);
router.delete("/user/access/delete/:id_page",deletePage);

//type
router.get("/user/type",getUserType);
router.get("/user/type/:id_type",getType);
router.post("/user/type/create",jsonParser,addType);
router.put("/user/type/update/:id_type",jsonParser,updateType);
router.delete("/user/type/delete/:id_type",deleteType);

//user
router.get("/user/all",getUsers);
router.get("/user/count",countUser);


module.exports =  router;