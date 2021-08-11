require('dotenv').config();
const fetch = require('node-fetch');
const { API_URL_ETH,SIMBCOIN_OWNER_PRIVATE_KEY} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_ETH);
const models = require('../../models');
const crypto_name = "simbcoin";
const abi = require('../abis/abis');

const SIMBCOIN_CONTRACT_ADDRESS = "0x53Bd789F2cDb846b227d8ffc7B46eD4263231FDf";

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

        res.send({
            'balance' : balance,
            'symbol' : symbol
        })
      }



    
}


//get user simbcoin account address from database

module.exports = {
    createTokenAccount : createTokenAccount,
    get_simbcoin_balance : get_simbcoin_balance,
    get_simbcoin_Address : get_simbcoin_Address
}