const express = require('express');
const router = express.Router();
const FeesController = require('../../controllers/companyFees/feesController');

router.post("/createfees/sendtransaction", FeesController.createsendFees);
router.get("/allfees/sendtransaction/:uuid", FeesController.getsendFees);
router.put("/updatefees/sendtransaction",FeesController.updatesendFees)

module.exports =  router;