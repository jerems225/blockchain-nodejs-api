const express = require('express');
const router = express.Router();
const CryptoController = require('../../controllers/crypto/allcryptoController');

router.get("/crypto/allcrypto",CryptoController.getallcrypto );

module.exports =  router;