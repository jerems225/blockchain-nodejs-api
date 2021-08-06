require('dotenv').config();
const fetch = require('node-fetch');
const { API_URL_ETH} = process.env;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(API_URL_ETH);
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(API_URL_ETH));
const user_uuid = "0xc697486fjhgb96e4f13ba4754b9d5cba5c9";

// ETHERSCAN_APIKEY = "WNYG4RMJYXC3WNC3ZX75B388SEGWPZIK9B"
// SIMBCOIN_CONTRACT_ADDRESS = "0x53Bd789F2cDb846b227d8ffc7B46eD4263231FDf"
// SIMBCOIN_OWNER_ADDRESS = "0x3f0fD44F1115F37f470214824Ab268Eed0aE0a3B"
// SIMBCOIN_OWNER_PRIVATE_KEY = "069023752cbb0d01ddd1a0caadbaab4375c79bb37ce09dbb20a28a5ba464ac20"

// account: {
//     address: '0xc22Efd5a58E1E1f6ED0f6C345D1CC43375436e6E',
//     privateKey: '0x37ba72990057f161af1226d7ecafbb8bd330638e46e72f33a9108df60b5254a2'
//   }

//0x2df87B9d31C811358B7e7f0735fa391398038BBc  spender

async function createTokenAccount(user_uuid)
{
   const url = "http://127.0.0.1:5500/SMB/createAccount?uuid="+user_uuid;

   var response = await fetch(url,{
       method : "GET"
   });
   var account = await response.json();

   console.log(account)
}

async function getBalance(user_uuid)
{
    const url = "http://127.0.0.1:5500/SMB/accountBalance/"+user_uuid;

    var response = await fetch(url,{
        method : "GET"
    });
    var res = await response.json();

    console.log(res)
}

async function sendTransaction(from,to,value)
{
    const urlSendtransaction = "http://127.0.0.1:5500/SMB/sendTransaction?from=" + from + "&to=" + to + "&value="+ value;
    var response = await fetch(urlSendtransaction,{
        method: "GET",
    
    });

    var res = await response.json();
    console.log(res);
}


// createTokenAccount(user_uuid)
getBalance(user_uuid)
// sendTransaction("0xfcd68c0381de08ed897b50ac8d3da8e921604b59","0xf5d94a146639d376802adfedaef5dfe993f0f6e9","6")