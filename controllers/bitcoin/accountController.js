require('dotenv').config();
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bip32 = require('bip32');
const bip39 = require('bip39');
const models = require('../../models');
const bitcoin = require('bitcoinjs-lib');
const {BTC_NODE_NETWORK, BTC_NODE_NETWORK_CORE, BTC_NODE_PATH }= require('../nodeConfig');
const crypto_name = "bitcoin";

async function create_Btc_Account(req,res){

 const owner_uuid = req.query.uuid;

//verification if uuid is exist and valid before run code
  const user = await models.user.findOne({ where : 
  {
    uuid : owner_uuid,
  }})
 const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})


    if(user)
    {
        if(result)
        {
          res.status(401).json({
            status : 401,
            message: `This user already have a ${crypto_name} account`
        });
        }
        else
        {
            //create btc account
            let mnemonic = bip39.generateMnemonic()
            const seed = bip39.mnemonicToSeedSync(mnemonic)
            let root = bip32.fromSeed(seed,BTC_NODE_NETWORK_CORE)
            let account = root.derivePath(BTC_NODE_PATH)
            let node = account.derive(0).derive(0)

            var publicKey = node.publicKey.toString('hex');
            const walletObject = {
                  crypto_name : crypto_name,
                  pubkey : publicKey,
                  privkey : node.toWIF(),
                  mnemonic : mnemonic,
                  user_uuid : owner_uuid
              }
          //save in the database
          models.Wallet.create(walletObject).then(result => {
            res.status(200).json({
                status: 200,
                message: "Wallet created successfully",
                wallet : result
            });
          }).catch(error => {
            res.status(500).json({
                status : 500,
                message: "Something went wrong",
                error : error
            });
          });
        }
    }
    else
    {
      res.status(401).json(
      {
        status : 401,
        message: "Unknown User",
      });
    }
}

async function create_owner_Btc_Account(uuid){

  const owner_uuid = uuid;
 
 //verification if uuid is exist and valid before run code 
   const user = await models.user.findOne({ where : 
   {
     uuid : owner_uuid,
   }})
   
   if(user)
   {
    const result = await models.ownerstakewallet.findOne({ where : 
      {
        crypto_name : crypto_name
      }});

        if(result)
        {
          console.log({
            status : 401,
            message: `This asset already have as ${crypto_name} stake owner account`
        });
        }
        else
        {
            //create btc account
            let mnemonic = bip39.generateMnemonic()
            const seed = bip39.mnemonicToSeedSync(mnemonic)
            let root = bip32.fromSeed(seed,BTC_NODE_NETWORK_CORE)
            let account = root.derivePath(BTC_NODE_PATH)
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
   else
      {
        console.log({
          status : 401,
          message: "Unknown User",
      });
    }
 }

async function get_Btc_Address(req,res)
{
  const owner_uuid = req.query.uuid;

//verification if uuid is exist and valid before run code
 const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})
  
    if(!result)
    {
      res.status(401).json({
        status : 401,
        message: `Unknown User`
    });
    }
    else
    { 
      var buffer = Buffer.from(result.dataValues.pubkey,'hex');
      var u_address;
      if(NODE_ENV == 'test' || NODE_ENV == 'development')
      {
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.testnet });
        u_address = address;
      }
      else if(NODE_ENV == 'devprod' || NODE_ENV ==  'production')
      {
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.bitcoin });
        u_address = address;
      }
     
      
      res.status(200).json({
        status : 200,
        address: u_address
    });
    }
}


async function get_Btc_Owner_Address(req,res)
{
  const type = req.params.type;
    if(type == "tx")
    {
      //verification if uuid is exist and valid before run code
      const result = await models.ownerwallets.findOne({ where : 
        {
          crypto_name : crypto_name
        }})
      
        if(!result)
        {
          res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
        }
        else
        { 
          var buffer = Buffer.from(result.dataValues.pubkey,'hex');
          var u_address;
          if(NODE_ENV == 'test' || NODE_ENV == 'development')
          {
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.testnet });
            u_address = address;
          }
          else if(NODE_ENV == 'devprod' || NODE_ENV ==  'production')
          {
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.bitcoin });
            u_address = address;
          }
        
          
          res.status(200).json({
            status : 200,
            address: u_address
        });
      }
    }else
    {
      //verification if uuid is exist and valid before run code
      const result = await models.ownerstakewallet.findOne({ where : 
        {
          crypto_name : crypto_name
        }})
      
        if(!result)
        {
          res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
        }
        else
        { 
          var buffer = Buffer.from(result.dataValues.pubkey,'hex');
          var u_address;
          if(NODE_ENV == 'test' || NODE_ENV == 'development')
          {
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.testnet });
            u_address = address;
          }
          else if(NODE_ENV == 'devprod' || NODE_ENV ==  'production')
          {
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: bitcoin.networks.bitcoin });
            u_address = address;
          }
        
          
          res.status(200).json({
            status : 200,
            address: u_address
        });
      }
    }
          
}


async function get_Btc_Balance(req,res)
{
    const owner_uuid = req.params.uuid;

    const result = await models.Wallet.findOne({ where : 
        {
          user_uuid : owner_uuid,
          crypto_name : crypto_name
        }});
  
        if(!result)
        {
          res.status(401).json({
            status : 401,
            message: `Unknown ${crypto_name} account for this user`
          });
        }
        else
        {
            let pubkey = result.dataValues.pubkey;
            var buffer = Buffer.from(pubkey,'hex');
            const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE});
            const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+address
            const response = await fetch(url,{
                    method : "GET"
                }
            );
            const utxos = await response.json()

            console.log(utxos)
            let totalAmountAvailable = 0;
            let balance = 0.0;
            utxos.data.txs.forEach(async (element) => {
                let utxo = {};
                utxo.satoshis = Number(element.value);
                totalAmountAvailable += utxo.satoshis;
                if(totalAmountAvailable != 0)
                {
                    balance = totalAmountAvailable
                }
            });
            res.status(200).json({
              status : 200,
              message: `${crypto_name} account balance for this user`,
              balance : Number.parseFloat(balance).toPrecision()
            });
        }
}

module.exports = {
    create_Btc_Account : create_Btc_Account,
    get_Btc_Balance : get_Btc_Balance,
    get_Btc_Address : get_Btc_Address,
    get_Btc_Owner_Address: get_Btc_Owner_Address,
    create_owner_Btc_Account : create_owner_Btc_Account
}