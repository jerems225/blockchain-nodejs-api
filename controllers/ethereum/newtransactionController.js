require('dotenv').config();
const { ETH_NODE_WS } = require('../nodeConfig');
const models = require('../../models');
var Web3 = require('web3');
const crypto_name = "ethereum" ;

var options = {
  timeout: 50000,
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


async function get_eth_tx_new()
{
  

  const result = await models.Wallet.findAll({ where :
      {
        crypto_name : 'ethereum'
      }});


  if(result.length != 0)
  {
    var web3 = new Web3(new Web3.providers.WebsocketProvider(ETH_NODE_WS, options));
      
    const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
      if (err) console.error(err);
    });

    subscription.on("data", () => {
        
      result.map((currentValue) => {
        var user_address = currentValue.dataValues.pubkey; // user eth address 
        web3.eth.getBlock('latest',function(error, block)
        {
          if(block && block.transactions)
            {
                for(let txHash of block.transactions)
                {
                    web3.eth.getTransaction(txHash,function(error, tx)
                    {
                      //save in the database
                      
                        var exist= 0;
                        if(tx)
                        {
                          models.Transaction.findAll({ where :
                            {
                              user_uuid : currentValue.dataValues.user_uuid,
                              hash : tx.hash,
                              crypto_name : 'ethereum',
                              transaction_type: 'received'
    
                            }}).then(rs => {
                            rs.map((item) => {
                                  if(item.length != 0)
                                  {
                                    exist = 1;
                                  }
                              });
    
                             
                              if(exist == 0 && user_address == tx.to)
                                {
                                  txObj = {
                                      transaction_type: "received",
                                      crypto_name: crypto_name,
                                      hash: tx.hash,
                                      from: tx.from,
                                      to: tx.to,
                                      fees: tx.gas,
                                      confirmation: true,
                                      amount: web3.utils.fromWei(tx.value, 'ether'),
                                      user_uuid : currentValue.dataValues.user_uuid
                                  };
          
                                  // save the receive transaction in the database
                                  models.Transaction.create(txObj).then(result => {
                                    console.log({
                                      status:201,
                                      message:  `your received a new ${crypto_name} transaction`,
                                      data: result
                                    })
                                     
                                  }).catch(error => {
                                      console(error)
                                   });
                                }
                              });
                        }
                        else{
                          console.log(error)
                        }

                      })
                
                }
            }
        });
      });

    });
 

  }
}



module.exports = {
    get_eth_tx_new : get_eth_tx_new
}