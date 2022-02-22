require('dotenv').config();
const {BASE_IP} = process.env;
const fetch = require('node-fetch');
const { BTC_NODE_NETWORK_CORE,BTC_NODE_NETWORK, GETBLOCK_NETWORK, GETBLOCK_APIKEY,ETH_NODE_URL,BSC_NODE_URL, CHAIN_ID } = require('../nodeConfig');
const models = require('../../models');
const owneruuid = "f2886b7b-80ea-453e-9a28-bc71ecac166c";
//bitcoin
const bitcore = require('bitcore-lib');

//ethereum
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);

//binance
const bWeb3 = require('web3');
const bprovider = new bWeb3.providers.HttpProvider(BSC_NODE_URL);
const bweb3 = new bWeb3(bprovider);



//bitcoin fees transaction blockchain additionnal
async function bitcoin(uuid)
{
    const sender_uuid = uuid;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : sender_uuid,
      crypto_name : 'bitcoin'
    }})

    if(result)
    {
          //generate address
          let pubkey = result.dataValues.pubkey;
          const sender_privkey = result.dataValues.privkey;
          var btcwalleturl = `https://${BASE_IP}/btc/wallet/getaddress?uuid=${owneruuid}`;
          var requestbtc = await fetch(btcwalleturl,{
              method: "GET"
          });
          var responsebtc = await requestbtc.json();
          var spender_address = responsebtc.address;

          const urlbtcprice = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
          var pricerequest = await fetch(urlbtcprice,{
              method: "GET"
          });
          var result_btc = await pricerequest.json();
          var btcprice = Number(result_btc.bitcoin.usd);

          const value = Number.parseFloat(1/btcprice).toFixed(2); //need to be multiply by 100,000,000 of satoshi
          const fee = value/4;

        //address  bitcoin
        var buffer = Buffer.from(pubkey,'hex');
        const { address } = bitcoin.payments.p2pkh({ pubkey: buffer, network: BTC_NODE_NETWORK_CORE });
        const sender_address = address;

      //call function for company fees : getFee()
        const satoshiToSend = value * 100000000;

      const cryptoRequest = await models.Crypto.findOne({where:{
          crypto_name: crypto_name
      }})

      //crypto info
      const crypto = cryptoRequest.dataValues;

        let inputCount = 0;
        let outputCount = 2;


        //get utox, unspent tx on node
        const url = "https://sochain.com/api/v2/get_tx_unspent/"+BTC_NODE_NETWORK+"/"+sender_address
        const resp = await fetch(url,{ method : "GET" });
        const utxos = await resp.json()
        // getUtxo.getUtxo(sender_address);
        const transaction = new bitcore.Transaction();
        let totalAmountAvailable = 0;
        let inputs = [];
        utxos.data.txs.forEach(async (element) => {
            let utxo = {};
            utxo.satoshis = Math.floor(Number(element.value) * 100000000);
            utxo.script = element.script_hex;
            utxo.address = utxos.data.address;
            utxo.txId = element.txid;
            utxo.outputIndex = element.output_no;
            totalAmountAvailable += utxo.satoshis;
            inputCount += 1;
            inputs.push(utxo);
        });
        
                //Set transaction input
                transaction.from(inputs);
                // set the recieving address and the amount to send
                transaction.to(spender_address, satoshiToSend);
                // Set change address - Address to receive the left over funds after transfer
                transaction.change(sender_address);
                //manually set transaction fees
                transaction.fee(fee* 100000000);
                
                // Sign transaction with your private key
                transaction.sign(sender_privkey);
                // serialize Transactions
                const serializedTX = transaction.serialize();
                let options = {
                method: "post",
                headers:
                { 
                    "x-api-key" : GETBLOCK_APIKEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "sendrawtransaction",
                    "params": [
                        serializedTX,
                        null
                    ],
                    "id": "getblock.io"
                })
            };
            const respTx = await fetch(`https://btc.getblock.io/${GETBLOCK_NETWORK}/`, options);
            const sendTx = await respTx.json();

            process.exit();

        }
        else{
        res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
        }

}

//ethereum fees transaction blockchain additionnal 
async function ethereum(uuid)
{
    const sender_uuid = uuid;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where :
    {
      user_uuid : sender_uuid,
      crypto_name : 'ethereum'
    }})

    if(result)
    {
        //get from database
        const  sender_address = result.dataValues.pubkey;
        const  sender_privkey = result.dataValues.privkey;
        var spender_address;
        var gasLimit = 21000;
        var ethwalleturl = `https://${BASE_IP}/eth/wallet/getaddress?uuid=${owneruuid}`;
        var requesteth = await fetch(ethwalleturl,{
            method: "GET"
        });
        var responseeth = await requesteth.json();
        var spender_address = "0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B";
        //convert value ether to usd
        var urleth="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"; 
        var response_eth = await fetch(urleth,{method: "GET"});
        var result_eth = await response_eth.json();
        var ethprice = Number(result_eth.ethereum.usd);
        const value = 1/ethprice;
        const nonce = await web3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
        const newnonce = nonce + 2;
        const transaction = { 
            'to': spender_address, // user ethereum address
            'value': web3.utils.toWei(value,'ether'), // value in eth
            'gas': gwei_fee, 
            'nonce': newnonce,
            'gasLimit': web3.utils.toHex(gasLimit),
            // optional data field to send message or execute smart contract

        };
        const signedTx = await web3.eth.accounts.signTransaction(transaction, sender_privkey);
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
            console.log("ok")
        }});
        process.exit();
    }
    else
    {
        res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
    }
}

//binance fees transaction blockchain additionnal
async function binance(uuid)
{
    const sender_uuid = uuid;

    //get pubkey and privkey by uuid from database
    const result = await models.Wallet.findOne({ where :
    {
      user_uuid : sender_uuid,
      crypto_name : 'binance'
    }})

    if(result)
    {
        //get from database
        const  sender_address = result.dataValues.pubkey;
        const  sender_privkey = result.dataValues.privkey;
        var spender_address;
        var gasLimit = 21000;
        var bnbwalleturl = `https://${BASE_IP}/bsc/bnb/wallet/getaddress?uuid=${owneruuid}`;
        var requestbnb = await fetch(bnbwalleturl,{
            method: "GET"
        });
        var responsebnb = await requestbnb.json();
        var spender_address = responsebnb.address;
        //convert value ether to usd
        var urlbnb="https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"; 
        var response_bnb = await fetch(urlbnb,{method: "GET"});
        var result_bnb = await response_bnb.json();
        var bnbprice = Number(result_bnb.binancecoin.usd);
        const value = 1/bnbprice;
        const nonce = await bweb3.eth.getTransactionCount(sender_address, 'latest'); // nonce starts counting from 0
        const newnonce = nonce + 1;
        const transaction = { 
            'to': spender_address, // user ethereum address
            'value': bweb3.utils.toWei(value,'ether'), // value in eth
            'gas': gwei_fee, 
            'nonce': newnonce,
            'gasLimit': bweb3.utils.toHex(gasLimit),
            'chaainId': CHAIN_ID
            // optional data field to send message or execute smart contract

        };
        const signedTx = await bweb3.eth.accounts.signTransaction(transaction, sender_privkey);
        bweb3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error) {
            console.log("ok")
            process.exit();
        }});
    }
    else
    {
        res.status(401).json({
            status : 401,
            message: `Unknown User`
        });
    }
}

//main function
async function sendblockchainfees(uuid,blockchain)
{
    //csll all blockchain exist in this platform (bitcoin, ethereum, binance)
    setTimeout(async function txF()
    {

        if(blockchain == "bitcoin")
        {
            bitcoin(uuid);
        }
        else if(blockchain == "ethereum")
        {
            ethereum(uuid);
        }
        else if(blockchain == "binance")
        {
            binance(uuid);
        }
    },500);
}

module.exports = {
    sendblockchainfees
}
