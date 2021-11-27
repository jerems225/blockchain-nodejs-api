const models = require('../../models');

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
            const userHolderRequest = models.user.findAll();
            const userHolders = userHolderRequest;
            res.status(200).json({
                status: 200,
                message: `All stake holder on this platform`,
                data : {
                    count: userHolders.length,
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

    if(userRequest)
    {
        const userStakes = await models.stakeholder.findAll({where:{
            user_uuid : uuid
        }});
        res.status(200).json({
            status: 200,
            message: `stake holder informations`,
            data : userStakes
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