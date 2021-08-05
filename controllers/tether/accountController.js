require('dotenv').config();
const fetch = require('node-fetch');
const { API_URL_ETH} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);

const abi = require('../abis/abis');

const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

async function createTokenAccount(req,res)
{
    var user_usdt_account = await web3.eth.accounts.create();
    
    res.send({
        "tether_account": user_usdt_account
    });

    //save account in the database
}

async function get_usdt_balance(req,res)
{
    const user_address = req.params.address;
    
    var myContract = new web3.eth.Contract(abi.usdtAbi, USDT_CONTRACT_ADDRESS);
    
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

//get user tether account address from database

module.exports = {
    createTokenAccount : createTokenAccount,
    get_usdt_balance : get_usdt_balance
}