const express = require('express');
const router = express.Router();
const FeesController = require('../../controllers/companyFees/feesController');

router.get("/company/getallfees", FeesController.getallfees);

module.exports =  router;