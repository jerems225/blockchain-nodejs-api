require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bip32 = require('bip32')
const bip39 = require('bip39')
const models = require('../../models');
const bitcoin = require('bitcoinjs-lib')
const { Address, PublicKey } = require('bitcore-lib');
const {BTC_NODE_NETWORK, BTC_NODE_NETWORK_CORE, BTC_NODE_PATH }= require('../nodeConfig');
const crypto_name = "bitcoin";

// Derivation path
const path = BTC_NODE_PATH

async function create_Btc_Account(uuid){


//verification if uuid is exist and valid before run code 
 const result = await models.ownerstakewallet.findOne({ where : 
    {
      crypto_name : crypto_name
    }})

        if(result)
        {
          console.log({
            status : 401,
            message: `This user already have a ${crypto_name} account`
        });
        }
        else
        {
            //create btc account
            let mnemonic = bip39.generateMnemonic()
            const seed = bip39.mnemonicToSeedSync(mnemonic)

            let root;
            if(NODE_ENV == 'test' || NODE_ENV == 'development')
            {
              root = bip32.fromSeed(seed,bitcoin.networks.testnet)
            }
            else if(NODE_ENV == NODE_ENV == 'devprod' || 'production')
            {
              root = bip32.fromSeed(seed,bitcoin.networks.bitcoin)
            }
          

            let account = root.derivePath(path)
            let node = account.derive(0).derive(0)

            var publicKey = node.publicKey.toString('hex');
            const walletObject = {
                  crypto_name : crypto_name,
                  pubkey : publicKey,
                  privkey : node.toWIF(),
                  mnemonic : mnemonic,
              }
          //save in the database
          models.ownerstakewallet.create(walletObject).then(result => {
            console.log({
                status: 200,
                message: "Wallet created successfully",
                wallet : result
            });
          }).catch(error => {
            console.log({
                status : 500,
                message: "Something went wrong",
                error : error
            });
          });
        }
    
    
}

module.exports = {
  create_Btc_Account
}