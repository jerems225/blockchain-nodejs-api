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


async function get_eth_tx_confirmation(req,res)
{
    const owner_uuid = req.query.uuid;


  //verification if uuid is exist and valid before run code
 const result = await models.Transaction.findAll({ where :
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }});

  console.log(result.length)

  if(result.length == 0)
  {
      res.status(401).json({
        status : 401,
        message: `No transaction for this user`
    });
  }
  else
  {
    let arrayRes;

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
                            //update record save in the database
                            models.Transaction.update({fees: receipt.gasUsed, confirmation: receipt.status}, {
                              where: { user_uuid: item.user_uuid }
                            }).then(result => {
                              // console.log(receipt)
                            }).catch(error => {
                              res.status(500).json({
                                  status : 500,
                                  message: "Something went wrong",
                                  error : error
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
    datas = await models.Transaction.findAll({ where :
      {
        user_uuid : owner_uuid,
        crypto_name : crypto_name
      }});

    res.status(200).json({
      status: 200,
      message: "Transaction status updated successfully",
      data : datas
  });
  }
    
}

module.exports = {
    get_eth_tx_confirmation : get_eth_tx_confirmation
}