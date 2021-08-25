const fetch = require('node-fetch');


require('dotenv').config();
var API_URL_ETH = "wss://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths";
var Web3 = require("web3");

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






get_eth_tx_confirmation()

// createAccount();
// getBalance(user_uuid);
// sendTransaction();