const express = require('express');
const router = express.Router();
const FeesController = require('../../controllers/companyFees/feesController');

router.post("/createfees/withdraw", FeesController.createwithdrawFees);
router.get("/allfees/withdraw/:uuid", FeesController.getwithdrawFees);
router.put("/updatefees/withdraw",FeesController.updatewithdrawFees)

module.exports =  router;