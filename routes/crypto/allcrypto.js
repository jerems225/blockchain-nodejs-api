const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
const { getallcrypto, getallcrypto_token, getallcrypto_coin } = require('../../controllers/crypto/allcryptoController');
const { addCrypto } = require('../../controllers/crypto/addController');
const { UpdateCrypto } = require('../../controllers/crypto/updateController');

router.get("/crypto/allcrypto",getallcrypto);
router.get("/crypto/allcrypto/tokens",getallcrypto_token, );
router.get("/crypto/allcrypto/coins",getallcrypto_coin );
router.post("/crypto/add/crypto",jsonParser,addCrypto);
router.put("/crypto/update/crypto", jsonParser,UpdateCrypto );



module.exports =  router;