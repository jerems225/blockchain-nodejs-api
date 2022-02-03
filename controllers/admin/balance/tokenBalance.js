require('dotenv').config();
const { NODE_ENV} = process.env;
const { ETH_NODE_URL } = require('../../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../../models');

async function getBalance(crypto_name,req,res)
{
    let address;
    var crypto_name;
    var contract_address;
    var abi;

    const cryptoRequest = await models.Crypto.findOne({where:{
      crypto_name: crypto_name
    }})

    //crypto info
    const crypto = cryptoRequest.dataValues;

    if(NODE_ENV == 'test' || NODE_ENV == 'development')
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address_test;
      abi = crypto.contract_abi_test;
    }
    else if(NODE_ENV == 'devprod' || NODE_ENV == 'production' )
    {
      crypto_name = crypto.crypto_name;
      contract_address = crypto.contract_address;
      abi = crypto.contract_abi;
    }

      const result = await models.ownerwallets.findOne({ where : 
      {
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
        var myContract = new web3.eth.Contract(abi, contract_address);
    
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
    getBalance
}