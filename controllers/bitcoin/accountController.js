require('dotenv').config();
const fetch = require('node-fetch');
// const { URL_UTOX_BTC,API_KEY, PRIVATE_KEY_BTC} = process.env;
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const models = require('../../models');
const crypto_name = "bitcoin";


async function create_Btc_Account(req,res){

 const owner_uuid = req.query.uuid;

//verification if uuid is exist and valid before run code
 const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})
  
    if(result)
    {
      res.status(401).json({
        status : 401,
        message: `This user already have a ${crypto_name} account`
    });
    }
    else
    {
  
     //Define the network
    // const network = bitcoin.networks.bitcoin 
    const network = bitcoin.networks.testnet //for testnet

    // Derivation path
    // const path = `m/49'/0'/0'/0` 
    const path = `m/49'/1'/0'/0`   //for testnet

    //create eth account
    let mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    let root = bip32.fromSeed(seed, network)

    let account = root.derivePath(path)
    let node = account.derive(0).derive(0)

    let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
    }).address
  
      const walletObject = {
          crypto_name : crypto_name,
          pubkey : btcAddress,
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


async function get_Btc_Balance(req,res)
{
    const owner_uuid = req.params.uuid;
    const sochain_network = "BTCTEST";

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
            let address = result.dataValues.pubkey;
            const url = "https://sochain.com/api/v2/get_tx_unspent/"+sochain_network+"/"+ address
            const response = await fetch(url,{
                    method : "GET"
                }
            );
            const utxos = await response.json()
            let totalAmountAvailable = 0;
            let balance = 0;
            utxos.data.txs.forEach(async (element) => {
                let utxo = {};
                utxo.satoshis = Number(element.value);
                totalAmountAvailable += utxo.satoshis;
                if(totalAmountAvailable != 0)
                {
                    balance = totalAmountAvailable
                }
            });
            res.send({
                "balance" :  balance
            })
        }
}

//get user bitcoin account address from database


module.exports = {
    create_Btc_Account : create_Btc_Account,
    get_Btc_Balance : get_Btc_Balance
}