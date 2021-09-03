require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const models = require('../../models');
const { Address, PublicKey } = require('bitcore-lib');
const nodeConfig = require('../nodeConfig');
const crypto_name = "bitcoin";

// Network
if(NODE_ENV == 'test' ||'development')
{
  var network =  bitcoin.networks.testnet
}
else if(NODE_ENV == 'devprod')
{
  var network =  bitcoin.networks.bitcoin
}
else if(NODE_ENV == 'production')
{
  var network =  bitcoin.networks.bitcoin
}

// Derivation path
const path = nodeConfig.BTC_NODE_PATH

async function create_Btc_Account(){

    //create btc account
    let mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    let root = bip32.fromSeed(seed, network)

    let account = root.derivePath(path)
    let node = account.derive(0).derive(0)

    var publicKey = node.publicKey.toString('hex');
    const walletObject = {
          crypto_name : crypto_name,
          pubkey : publicKey,
          privkey : node.toWIF(),
          mnemonic : mnemonic
      }
      //save in the database
      models.ownerwallets.create(walletObject).then(result => {
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

create_Btc_Account()