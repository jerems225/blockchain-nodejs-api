const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { createStake } = require('../../controllers/staking/createStakeController');
const { enable_auto_renew, disable_auto_renew, getstakeholders, userStake, date_now } = require('../../controllers/staking/stakeHolderController');
// create application/json parser

router.post('/staking/create/stake',jsonParser,createStake);
router.post('/staking/enable/autorenew',jsonParser,enable_auto_renew);
router.post('/staking/disable/autorenew',jsonParser,disable_auto_renew);
router.get('/staking/admin/get/stakeholders/:uuid',getstakeholders);
router.get('/staking/get/userstakes/:uuid',userStake);
router.get('/current/date',date_now);

module.exports =  router;