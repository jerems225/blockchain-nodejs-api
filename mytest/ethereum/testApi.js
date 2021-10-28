const fetch = require('node-fetch');


require('dotenv').config();
// var API_URL_ETH = "wss://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths";
const { API_URL_ETH } = process.env;
var Web3 = require("web3");

var web3 = new Web3('https://eth-rinkeby.alchemyapi.io/v2/DtisPs5RMmTFGdGJAD2ExehMc_amW-8R');

const user_uuid = "0xc697486fjhgb96e4f13ba4754b9d5cba5c9";
const urlAccount = "http://127.0.0.1:5500/ETH/createAccount?uuid="+user_uuid;


const from= "0xB70cF43CBe4c06B5c6B89660172F4B77081147b9";
const to = "0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B";
const value = '0.0001';

// console.log(value)

const urlSendtransaction = "http://127.0.0.1:5500/ETH/sendTransaction?from=" + from + "&to=" + to + "&value="+ value;


async function createAccount()
{
    var response = await fetch(urlAccount)

    var res = await response.json();

    console.log(res);
    
}

async function getBalance(user_uuid)
{
    const urlBalance = `http://127.0.0.1:5500/ETH/accountBalance/${user_uuid}`;
    var response = await fetch(urlBalance,{
        method:"GET",
        
    })

    var res = await response.json()

    console.log(res);
    
}


async function sendTransaction()
{

    var response = await fetch(urlSendtransaction,{
        method: "GET",
    
    });

    var res = await response.json();
    console.log(res);
}



async function get_eth_tx_new()
{
    var user_address = '0x1438585E94c24A417974F50793220082e168DfB9'; // user eth address 
    let block = await web3.eth.getBlock('latest');
    // console.log(`[*] Searching block ${ block.number}...`);
    if(block && block.transactions)
    {
        for(let txHash of block.transactions)
        {
            let tx = await web3.eth.getTransaction(txHash);
            
            if(user_address == tx.to){
                console.log(tx)
                console.log(`[+] transaction found on block ${ tx.blockNumber }`);
                console.log({
                    transaction_type: "received",
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    fees: tx.gas,
                    confirmation: true,
                    amount: web3.utils.fromWei(tx.value, 'ether'),
                    timestamp: new Date()
                });

                //find user_uuid for this address

                //save the receive transaction in the database
            }
        }
    }
}

async function network()
{
    var network = await web3.eth.net;
    console.log(network)
}

async function getcoin(){ var url="https://api.coingecko.com/api/v3/simple/price?ids=simbcoin-swap&vs_currencies=eth"; var response = await fetch(url,{method: "GET"}); var result = await response.json();

    var val_usdt = 4;    

    var eth_price = result.tether.eth;
    var usdt_eth = val_usdt * eth_price;

    console.log(usdt_eth)

    //simbcoin-swap id_coingecko
}

getcoin()

// network()
// get_eth_tx_new()


// createAccount();
// getBalance(user_uuid);
// sendTransaction();