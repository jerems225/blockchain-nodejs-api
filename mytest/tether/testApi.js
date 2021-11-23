require('dotenv').config();
const fetch = require('node-fetch');
const { API_URL_ETH} = process.env;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(API_URL_ETH);
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(API_URL_ETH));

// ETHERSCAN_APIKEY = "WNYG4RMJYXC3WNC3ZX75B388SEGWPZIK9B"
// SIMBCOIN_CONTRACT_ADDRESS = "0x53Bd789F2cDb846b227d8ffc7B46eD4263231FDf"
// SIMBCOIN_OWNER_ADDRESS = "0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B"
// SIMBCOIN_OWNER_PRIVATE_KEY = "069023752cbb0d01ddd1a0caadbaab4375c79bb37ce09dbb20a28a5ba464ac20"

// account: {
//     address: '0xc22Efd5a58E1E1f6ED0f6C345D1CC43375436e6E',
//     privateKey: '0x37ba72990057f161af1226d7ecafbb8bd330638e46e72f33a9108df60b5254a2'
//   }

//0x2df87B9d31C811358B7e7f0735fa391398038BBc  spender

async function createTokenAccount()
{
   const url = "http://127.0.0.1:5500/USDT/createAccount";

   var response = await fetch(url,{
       method : "GET"
   });
   var account = await response.json();

   console.log(account)
}

async function getBalance(user_address)
{
    //convert to usd ;
    var crypto_name = "simbcoin-swap";
    var urlusd="https://api.coingecko.com/api/v3/simple/price?ids=simbcoin-swap&vs_currencies=usd"; 
    var response_usd = await fetch(urlusd,{method: "GET"});
    var result_usd = await response_usd.json(); 
    var smb_price = result_usd[crypto_name].usd;
    var amount_usd = smb_price;

    console.log(smb_price)
}

async function sendTransaction(from,to,value)
{
    const urlSendtransaction = "http://127.0.0.1:5500/USDT/sendTransaction?from=" + from + "&to=" + to + "&value="+ value;
    var response = await fetch(urlSendtransaction,{
        method: "GET",
    
    });

    var res = await response.json();
    console.log(res);
}





// createTokenAccount()
getBalance()
// sendTransaction("0xB70cF43CBe4c06B5c6B89660172F4B77081147b9","0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B","22")