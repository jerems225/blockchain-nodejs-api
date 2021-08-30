 require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL } = require('../nodeConfig');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ETH_NODE_URL);
const models = require('../../models');
const crypto_name = "tether";
const abi = require('../abis/abis');
const tokenaddress = require('../abis/tokenaddress');

// const USDT_CONTRACT_ADDRESS = tokenaddress.usdtAbi;  // get env address


const USDT_CONTRACT_ADDRESS = "0xFab46E002BbF0b4509813474841E0716E6730136" //dev testnet rinkeby faucet'






async function createTokenAccount(req,res)
{
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
            //create eth account
            var user_eth_account = await web3.eth.accounts.create();

            const walletObject = {
                crypto_name : crypto_name,
                pubkey : user_eth_account.address,
                privkey : user_eth_account.privateKey,
                mnemonic : "N/A",
                user_uuid : owner_uuid
            }
        
            //save in the database
            models.Wallet.create(walletObject).then(result => {
            res.status(201).json({
                status: 201,
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
  

    //save account in the database
}

async function get_usdt_Address(req,res)
{
    const owner_uuid = req.query.uuid;
    //verification if uuid is exist and valid before run code
  const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})

    if(!result)
    {
      res.status(401).json({
        status : 401,
        message: `Unknown User`
    });
    }
    else
    {
    
      //save in the database
     
        res.status(200).json({
            status: 200,
            address : result.dataValues.pubkey
        });
      }
}

async function get_usdt_balance(req,res)
{
    const owner_uuid = req.params.uuid;
    let address;

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
        address = result.dataValues.pubkey;
        var myContract = new web3.eth.Contract(abi.fauAbi, USDT_CONTRACT_ADDRESS);
    
        // Call balanceOf function
        var balance = await myContract.methods.balanceOf(address).call();
        // Get decimals
        var decimals = await myContract.methods.decimals().call();

        //get symbol
        var symbol = await myContract.methods.symbol().call()

        if(balance != 0)
        {
            balance = balance/(10**decimals);
        }
        else
        {
          balance = 0;
        }

        res.status(200).json({
          status : 200,
          message: `${crypto_name} account balance for this user`,
          balance : Number.parseFloat(balance).toPrecision(),
          symbol: symbol
        });

      }
}


module.exports = {
    createTokenAccount : createTokenAccount,
    get_usdt_balance : get_usdt_balance,
    get_usdt_Address : get_usdt_Address
}