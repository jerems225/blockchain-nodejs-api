const fetch = require('node-fetch');

const urlAccount = "http://127.0.0.1:5500/ETH/createAccount";


const from= "0xB70cF43CBe4c06B5c6B89660172F4B77081147b9";
const to = "0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B";
const value = '0.0001';

// console.log(value)

const urlSendtransaction = "http://127.0.0.1:5500/ETH/sendTransaction?from=" + from + "&to=" + to + "&value="+ value;


async function createAccount()
{
    var response = await fetch(urlAccount)

    var res = await response.json();

    console.log(res.result);
    
}

async function getBalance(user_address)
{
    const urlBalance = `http://127.0.0.1:5500/ETH/accountBalance/${user_address}`;
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

// createAccount();
getBalance('0xfcd68c0381de08ed897b50ac8d3da8e921604b59');
// sendTransaction();