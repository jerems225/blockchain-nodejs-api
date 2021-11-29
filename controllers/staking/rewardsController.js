const models = require('../../models');
const bitcoin = require('./transactions/bitcoin');
const ethereum = require('./transactions/ethereum');
const token = require('./transactions/token');

async function rewards()
{
    
    setInterval(async function run(){
        console.log("rewards");
        const userHolders = await models.user.findAll({ where : {
            isholder : true
        }});
        userHolders.forEach(async (u) => {
            const uuid = u.uuid;
            const stakeHolderRequest = await models.stakeholder.findAll({ where : {
                user_uuid : uuid
            }});
            stakeHolderRequest.forEach(async (stakeholder) => {
                const now_time = new Date();

                if(now_time > stakeholder.end_time && stakeholder.end_status == false)
                {
                    
                    if(stakeholder.auto_renew == false)
                    {
                        const crypto_name = stakeholder.crypto_name;
                        const value = stakeholder.amount_invest + stakeholder.amount_reward;
                        const fee = stakeholder.fee_end;
    
                        const stakeobject = {
                            crypto_name: crypto_name,
                            user_uuid: uuid,
                            amount_invest: value,
                            fee_start: fee,
                        }

                        models.stakeholder.update({end_time : true,end_status: true},{where : {
                            user_uuid : uuid,
                            id : stakeholder.id
                        }});
    
                        if(crypto_name == "bitcoin")
                        {
                            //owner_stake
                            //get owner wallet info
                            const OwnerRequest = await models.ownerstakewallet.findOne({where : {
                                crypto_name :crypto_name
                            }});
                            const ownerwallet = OwnerRequest.dataValues;
                            var btcurl = `http://${BASE_IP}/btc/owner/getaddress/stake`
                            var btcreq = await fetch(btcurl,{
                                method: "GET"
                            });
                            var btcres = await btcreq.json();
                            const user_address = btcres.address; //owner_address
                            const user_privkey = ownerwallet.dataValues.privkey//owner_privkey
    
                            //user_stake
                            const userUrl = `http://${BASE_IP}/btc/getaddress?uuid=${uuid}`;
                            const userReq = await fetch(userUrl,{
                                method : "GET"
                            })
                            const result = await userReq.json();
                            const owner_address = result.address; //user_address
    
                            //send transaction
                            bitcoin.send(stakeobject,user_address,owner_address,user_privkey,stakeholder.id);
    
                        }
                        else if(crypto_name == "ethereum")
                        {
                            //owner_stake
                            //get owner wallet info
                            const OwnerRequest = await models.ownerstakewallet.findOne({where : {
                                crypto_name :crypto_name
                            }});
                            const ownerwallet = OwnerRequest.dataValues;
                            const user_address = ownerwallet.pubkey;//owner_address
                            const user_privkey = ownerwallet.privkey;//owner_address
    
                            const walletRequest = await models.Wallet.findOne({where : {
                                user_uuid : uuid,
                                crypto_name : crypto_name
                            }});
    
                            const wallet = walletRequest.dataValues;
                            const owner_address = wallet.pubkey;//user_address
    
                            setTimeout(ethereum.send(stakeobject,user_address,owner_address,user_privkey,stakeholder.id), 6000)
                            
                            
                        }
                        else{
                            //owner_stake
                            //get owner wallet info
                            const OwnerRequest = await models.ownerstakewallet.findOne({where : {
                                crypto_name : 'ethereum'
                            }});
                            const ownerwallet = OwnerRequest.dataValues;
                            const user_address = ownerwallet.pubkey;//owner_address
                            const user_privkey = ownerwallet.privkey;//owner_address
    
                            const walletRequest = await models.Wallet.findOne({where : {
                                user_uuid : uuid,
                                crypto_name : crypto_name
                            }});
    
                            const wallet = walletRequest.dataValues;
                            const owner_address = wallet.pubkey;//user_address
    
                            setTimeout(token.send(stakeobject,user_address,owner_address,user_privkey,stakeholder.id), 6000)
                        }
                    }
                }
            })

        });
    },400);

}

module.exports = {
    rewards : rewards
}