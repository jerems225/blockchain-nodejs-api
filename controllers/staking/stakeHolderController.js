const models = require('../../models');
const fetch = require('node-fetch')

async function getstakeholders(req,res)
{
    const query = req.params;
    const uuid = query.uuid;

    const userAdminRequest = await models.user.findOne({where :{
        uuid : uuid
    }})
    if(userAdminRequest)
    {
        const userAdmin = userAdminRequest.dataValues;
        if(userAdmin.roles[0] == "ROLE_ADMIN")
        {
            const userHolderRequest = models.stakeholder.findAll();
            const userHolders = userHolderRequest;
            const count = userHolders.length
            res.status(200).json({
                status: 200,
                message: `All stake holder on this platform`,
                data : {
                    count: count,
                    holders: userHolders
                }
            })
        }else{
            res.status(401).json({
                status: 401,
                message: `UnAutorized User.`,
                data : null
            });
        }
    }else{
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
    }
}

async function userStake(req,res)
{
    const query = req.params;
    const uuid = query.uuid;

    const userRequest = await models.user.findOne({where:{
        uuid : uuid
    }});
    var responses = [];
    var count = 0;
    if(userRequest)
    {
        const userStakes = await models.stakeholder.findAll({where:{
            user_uuid : uuid
        }});

        userStakes.forEach(async (us) => {

            const crypto = await models.Crypto.findOne({where: {
                crypto_name: us.crypto_name
                }
            });
            const symbol = crypto.dataValues.crypto_symbol;
            //get icon for crypto instance
            var icon_url = `https://api.coingecko.com/api/v3/coins/${crypto.dataValues.crypto_name_market}`;
            var iconresquest = await fetch(icon_url,{
                method: "GET"
            }); 
            var iconresponse = await iconresquest.json();
            const icon = iconresponse.image.thumb;
            const response = {
                 id: us.id,
                 crypto_name: us.crypto_name,
                 start_time: us.start_time,
                 end_time: us.end_time,
                 fee_start: us.fee_start,
                 fee_end: us.fee_end,
                 amount_invest: us.amount_invest,
                 amount_reward: us.amount_reward,
                 amount_reward_day: us.amount_reward_day,
                 period: us.period,
                 rate: us.rate,
                 end_status: us.end_status,
                 auto_renew: us.auto_renew,
                 symbol: symbol,
                 image_url: icon
            };

            responses[count] = response;
            count = count + 1;
            if(count == userStakes.length)
            {
                res.status(200).json({
                    status: 200,
                    message: "stake holder informations",
                    data: responses
                })
            }
        });
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
    }



}

//activate auto_renew
async function enable_auto_renew(req,res)
{
    const query = req.body;
    const uuid = query.uuid;
    const stake_id = query.stake_id;

    const userRequest = await models.user.findOne({where:{
        uuid:uuid
    }});

    if(userRequest)
    {
        models.stakeholder.update({auto_renew: true},{where:{
            id : stake_id,
            user_uuid : uuid
        }}).then(result => {console.log(result)})
    
        res.status(200).json({
            status: 200,
            message: `success`,
            data : {
                auto_renew : true
            }
        });
    }
    else{
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
    }
}

//disable auto_renew
async function disable_auto_renew(req,res)
{
    const query = req.body;
    const uuid = query.uuid;
    const stake_id = query.stake_id;

    const userRequest = await models.user.findOne({where:{
        uuid:uuid
    }});

    if(userRequest)
    {
        models.stakeholder.update({auto_renew: false},{where:{
            id : stake_id
        }})
    
        res.status(200).json({
            status: 200,
            message: `success`,
            data : {
                auto_renew : false
            }
        });
        
    }
    else{
        res.status(401).json({
            status: 401,
            message: `Unknown user.`,
            data : null
        });
    }
}

async function date_now(req,res)
{
    res.status(200).json({
        status:200,
        message: 'current date get successfully!',
        data : {
            current_date : new Date()
        }
    })
}





module.exports = {
    getstakeholders : getstakeholders,
    userStake : userStake,
    enable_auto_renew : enable_auto_renew,
    disable_auto_renew : disable_auto_renew,
    date_now : date_now
}