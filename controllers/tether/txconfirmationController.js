require('dotenv').config();
const { ETH_NODE_WS } = require('../nodeConfig');
const models = require('../../models');
var Web3 = require('web3');
const crypto_name = "tether" ;

var options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
};


async function get_usdt_tx_confirmation(uuid,res)
{
    const owner_uuid = uuid;


  //verification if uuid is exist and valid before run code
 const result = await models.Transaction.findAll({ where :
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }});

  if(result.length == 0)
  {
      console.log({
        status : 401,
        message: `No transaction for this user`
    });
  }
  else
  {

      var web3 = new Web3(new Web3.providers.WebsocketProvider(ETH_NODE_WS, options));
      
    const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
      if (err) console.error(err);
    });
    
   let tx;
   let receipt;
    subscription.on("data", () => {
      setTimeout(async () => {
          result.map((item) => {
            web3.eth.getTransaction(item.hash,function(error, data)
            {
              tx = data;
              if (tx != null)
                {
                    if(tx.hash == item.hash)
                    {
                        web3.eth.getTransactionReceipt(item.hash,function(error, data) {
                          receipt = data;
                          if(receipt != null)
                        {
                              models.Transaction.update({fees: receipt.gasUsed, confirmation: receipt.status}, {
                                where: { user_uuid: item.user_uuid, hash : tx.hash, crypto_name: crypto_name }
                              }).then(element => {
                                console.log(`Transaction ${result.length} confirmed`)
                                
                              }).catch(error => {
                                console.log({
                                    status : 500,
                                    message: "Something went wrong",
                                });
                               
                              });
                        }
                        })
                    }
                }
            }) 
            });
            
      });
      
    });
  }
    
}

module.exports = {
    get_usdt_tx_confirmation : get_usdt_tx_confirmation
}