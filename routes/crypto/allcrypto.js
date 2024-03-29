const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
const { getallcrypto, getallcrypto_token, getallcrypto_coin, getCrypto, getcryptostakable } = require('../../controllers/crypto/allcryptoController');
const { addCrypto } = require('../../controllers/crypto/addController');
const { UpdateCrypto } = require('../../controllers/crypto/updateController');

router.get("/crypto/allcrypto",getallcrypto);
router.get("/crypto/getcrypto/:id_crypto",getCrypto);
router.get("/crypto/allcrypto/tokens",getallcrypto_token, );
router.get("/crypto/allcrypto/coins",getallcrypto_coin );
router.post("/crypto/add/crypto",jsonParser,addCrypto);
router.put("/crypto/update/crypto", jsonParser,UpdateCrypto );
router.get("/crypto/stakable",getcryptostakable);



module.exports =  router;