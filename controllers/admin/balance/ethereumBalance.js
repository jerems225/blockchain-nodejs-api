require('dotenv').config();
const { ETH_NODE_URL } = require('../../nodeConfig');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../../models');

async function getBalance(crypto_name,req, res)
{
    //get user eth account address from database
    let address;

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
        var response = await web3.eth.getBalance(address);
      var bal = await web3.utils.fromWei(response,'ether');
      var balance = "0.0";

        if(bal != 0)
        {
          balance = bal
        }

      res.status(200).json({
        status : 200,
        message: `${crypto_name} account balance for this user`,
        balance : Number.parseFloat(balance).toPrecision()
      });
      }
}

module.exports = {
    getBalance
}