require('dotenv').config();
const fetch = require('node-fetch');
const { API_URL_ETH,SIMBCOIN_OWNER_PRIVATE_KEY} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);

const abi = require('../abis/abis');

const SIMBCOIN_CONTRACT_ADDRESS = "0x53Bd789F2cDb846b227d8ffc7B46eD4263231FDf"

async function createTokenAccount(req,res)
{
    var user_simbcoin_account = await web3.eth.accounts.create();
    res.send({
        "simbcoin_account": user_simbcoin_account
    });

    //save account in the database
}

async function get_simbcoin_balance(req,res)
{
    const user_address = req.params.address;
    
    var myContract = new web3.eth.Contract(abi.simbAbi, SIMBCOIN_CONTRACT_ADDRESS);
    
    // Call balanceOf function
    var balance = await myContract.methods.balanceOf(user_address).call();
    // Get decimals
    var decimals = await myContract.methods.decimals().call();

    //get symbol
    var symbol = await myContract.methods.symbol().call()

    if(balance != 0)
    {
        balance = balance/(10**decimals);
    }

    res.send({
        'balance' : balance,
        'symbol' : symbol
    })
}


//get user simbcoin account address from database

module.exports = {
    createTokenAccount : createTokenAccount,
    get_simbcoin_balance : get_simbcoin_balance
}