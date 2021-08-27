require('dotenv').config();
const { WS_URL_ETH } = process.env;
const models = require('../../models');
var Web3 = require('web3');
const crypto_name = "ethereum" ;

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


async function get_eth_tx_confirmation(uuid,res)
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
      res.status(401).json({
        status : 401,
        message: `No transaction for this user`
    });
  }
  else
  {

      var web3 = new Web3(new Web3.providers.WebsocketProvider(WS_URL_ETH, options));
      
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
                                where: { user_uuid: item.user_uuid }
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
    get_eth_tx_confirmation : get_eth_tx_confirmation
}