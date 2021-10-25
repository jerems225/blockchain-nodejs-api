require('dotenv').config();
const fetch = require('node-fetch');
const { ETH_NODE_URL } = require('../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');
const crypto_name = "simbcoin";
const abi = require('../abis/abis');
const tokenaddress = require('../abis/tokenaddress');

const SIMBCOIN_CONTRACT_ADDRESS = tokenaddress.simbAddress;

async function createTokenAccount(req,res)
{
    const owner_uuid = req.query.uuid;
    //verification if uuid is exist and valid before run code
    const user = await models.user.findOne({ where : 
      {
        uuid : owner_uuid,
      }})
    const result = await models.Wallet.findOne({ where : 
    {
      user_uuid : owner_uuid,
      crypto_name : crypto_name
    }})

    if(user)
    {
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
          var account = await models.Wallet.findOne({ where : 
            {
              user_uuid : owner_uuid,
              crypto_name : "ethereum"
            }})

          const walletObject = {
              crypto_name : crypto_name,
              pubkey : account.dataValues.pubkey,
              privkey : account.dataValues.privateKey,
              mnemonic : "N/A",
              user_uuid : owner_uuid
          }
        
          //save in the database
          models.Wallet.create(walletObject).then(result => {
            res.status(200).json({
                status: 200,
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
    }
    else
    {
        res.status(401).json({
          status : 401,
          message: `Unknown User`
      });
    }
  

    //save account in the database
}

async function get_simbcoin_Address(req,res)
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

async function get_simbcoin_balance(req,res)
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
        var myContract = new web3.eth.Contract(abi.simbAbi, SIMBCOIN_CONTRACT_ADDRESS);
    
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


//get user simbcoin account address from database

module.exports = {
    createTokenAccount : createTokenAccount,
    get_simbcoin_balance : get_simbcoin_balance,
    get_simbcoin_Address : get_simbcoin_Address
}