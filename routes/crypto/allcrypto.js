const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const CryptoController = require('../../controllers/crypto/allcryptoController');
const AddCryptoController = require('../../controllers/crypto/addController');
const UpdateCryptoController = require('../../controllers/crypto/UpdateController');

router.get("/crypto/allcrypto",CryptoController.getallcrypto );
router.get("/crypto/allcrypto/tokens",CryptoController.getallcrypto_token );
router.get("/crypto/allcrypto/coins",CryptoController.getallcrypto_token );
router.post("/crypto/add/crypto",jsonParser,AddCryptoController.addCrypto );
router.put("/crypto/update/crypto", jsonParser,UpdateCryptoController.UpdateCrypto );

module.exports =  router;