require('dotenv').config();
const fetch = require('node-fetch');
// const { URL_UTOX_BTC,API_KEY, PRIVATE_KEY_BTC} = process.env;
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')


async function create_Btc_Account(req,res){

        //Define the network
    const network = bitcoin.networks.bitcoin //use networks.testnet for testnet

    // Derivation path
    const path = `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet

    let mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    let root = bip32.fromSeed(seed, network)

    let account = root.derivePath(path)
    let node = account.derive(0).derive(0)

    let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
    }).address

    res.send(
    {
        'bitcoin_account':{
            'address' : btcAddress,
            'privateKey' : node.toWIF(), 
            'Mnemonic' : mnemonic
        }    
    });

    //save user bitcoin wallet in the database 
}


async function get_Btc_Balance(req,res)
{
    const user_address = req.params.address;

    const sochain_network = "BTCTEST";
    const url = "https://sochain.com/api/v2/get_tx_unspent/"+sochain_network+"/"+user_address

    const response = await fetch(url,{
        method : "GET"
    }
  );
  
  const utxos = await response.json()
  let totalAmountAvailable = 0;

  console.log(utxos);

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

//get user bitcoin account address from database


module.exports = {
    create_Btc_Account : create_Btc_Account,
    get_Btc_Balance : get_Btc_Balance
}