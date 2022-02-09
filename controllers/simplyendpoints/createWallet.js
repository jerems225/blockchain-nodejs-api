require('dotenv').config();
const {BSC_NODE_URL,ETH_NODE_URL, BTC_NODE_NETWORK_CORE, BTC_NODE_PATH }= require('../nodeConfig');
const { NODE_ENV} = process.env;
const fetch = require('node-fetch');
const bip32 = require('bip32');
const bip39 = require('bip39');

//eth
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(ETH_NODE_URL);
const web3 = new Web3(provider);
const models = require('../../models');

//bnb
const bWeb3 = require('web3');
const bprovider = new bWeb3.providers.HttpProvider(BSC_NODE_URL);
const bweb3 = new bWeb3(bprovider);

var results = [];
var send = []


async function createWallet(req,res)
{
    const uuid = req.query.uuid;
    //btc
    async function btcwallet(uuid)
    {
            const crypto_name = "bitcoin";
            const owner_uuid = uuid;

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
                        console.log({
                        status : 401,
                        message: `This user already have a ${crypto_name} account`
                    });
                    }
                    else
                    {
                        //create btc account
                        let mnemonic = bip39.generateMnemonic()
                        const seed = bip39.mnemonicToSeedSync(mnemonic)
                        let root = bip32.fromSeed(seed,BTC_NODE_NETWORK_CORE)
                        let account = root.derivePath(BTC_NODE_PATH)
                        let node = account.derive(0).derive(0)

                        var publicKey = node.publicKey.toString('hex');
                        const walletObject = {
                            crypto_name : crypto_name,
                            pubkey : publicKey,
                            privkey : node.toWIF(),
                            mnemonic : mnemonic,
                            user_uuid : owner_uuid
                        }
                    //save in the database
                    models.Wallet.create(walletObject).then(result => {
                        console.log({
                            status: 200,
                            message: "Wallet created successfully",
                            wallet : result
                        });
                    }).catch(error => {
                        console.log({
                            status : 500,
                            message: "Something went wrong",
                            error : error
                        });
                    });
                    }
                }
                else
                {
                console.log(
                {
                    status : 401,
                    message: "Unknown User",
                });
                }
    }
    
    //eth
    async function ethwallet(uuid)
    {
        const owner_uuid = uuid;
        const crypto_name = "ethereum";
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
                console.log({
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
                console.log({
                    status: 200,
                    message: "Wallet created successfully",
                    wallet : result
                }); 
              }).catch(error => {
                console.log({
                    status : 500,
                    message: "Something went wrong",
                    error : error
                });
              });
            }
        }
        else
        {
            console.log({
              status : 401,
              message: `Unknown User`
          });
        }
    }


    //eth tokens
    async function ethtokenwallet(uuid)
    {
        const cryptos = await models.Crypto.findAll({
            where : {
                crypto_type : "token",
                blockchain : "ethereum"
            }
        })
        cryptos.forEach(async (cr) => {
            const owner_uuid = uuid;
            const crypto_name = cr.crypto_name;
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
                  console.log({
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
                      privkey : account.dataValues.privkey,
                      mnemonic : "N/A",
                      user_uuid : owner_uuid
                  }
                
                  //save in the database
                  models.Wallet.create(walletObject).then(result => {
                    console.log({
                        status: 200,
                        message: "Wallet created successfully",
                        wallet : result
                    });
                  }).catch(error => {
                    console.log({
                        status : 500,
                        message: "Something went wrong",
                        error : error
                    });
                  });
                }
            }
            else
            {
                console.log({
                  status : 401,
                  message: `Unknown User`
              });
            }
        });
        send = results;
    }

    
    //bsc
    async function bnbwallet(uuid)
    {
        const owner_uuid = uuid;
        const crypto_name = "binance";
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
                console.log({
                status : 401,
                message: `This user already have a ${crypto_name} account`
            });
            }
            else
            {
              //create eth account
              var user_bnb_account = await bweb3.eth.accounts.create();
      
              const walletObject = {
                  crypto_name : crypto_name,
                  pubkey : user_bnb_account.address,
                  privkey : user_bnb_account.privateKey,
                  mnemonic : "N/A",
                  user_uuid : owner_uuid
              }
            
              //save in the database
              models.Wallet.create(walletObject).then(result => {
                console.log({
                    status: 200,
                    message: "Wallet created successfully",
                    wallet : result
                });
              }).catch(error => {
                console.log({
                    status : 500,
                    message: "Something went wrong",
                    error : error
                });
              });
            }
        }
        else
        {
            console.log({
              status : 401,
              message: `Unknown User`
          });
        }
    }

    //bsc tokens
    async function bnbtokenwallet(uuid)
    {
        const cryptos = await models.Crypto.findAll({
            where : {
                crypto_type : "token",
                blockchain : "binance"
            }
        })
        cryptos.forEach(async (cr) => {
            const owner_uuid = uuid;
            const crypto_name = cr.crypto_name;
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
                  console.log({
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
                      crypto_name : "binance"
                    }})
        
                  const walletObject = {
                      crypto_name : crypto_name,
                      pubkey : account.dataValues.pubkey,
                      privkey : account.dataValues.privkey,
                      mnemonic : "N/A",
                      user_uuid : owner_uuid
                  }
                
                  //save in the database
                  models.Wallet.create(walletObject).then(result => {
                    console.log({
                        status: 200,
                        message: "Wallet created successfully",
                        wallet : result
                    });
                  }).catch(error => {
                    console.log({
                        status : 500,
                        message: "Something went wrong",
                        error : error
                    });
                  });
                }
            }
            else
            {
                console.log({
                  status : 401,
                  message: `Unknown User`
              });
            }
        });
        send = results;
    }


    btcwallet(uuid);
    ethwallet(uuid);
    ethtokenwallet(uuid);
    bnbwallet(uuid);
    bnbtokenwallet(uuid);

    res.status(200).json({
        status : 200,
        message: "success",
    });

}



module.exports = {
    createWallet
}



