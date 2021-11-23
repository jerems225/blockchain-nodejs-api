const models = require('../../models');

async function getVersion(req,res)
{
    const request = await models.appversion.findAll();

    const version = request

    res.status(200).json({
        status:200,
        message:"version get successfully",
        data:
        {
            verison: version
        }
    })
}

async function updateVersion(req,res)
{
    const newVersion = req.body.version;
    var obj = {
        version : newVersion
    }
    const datas = await models.appversion.update(obj,{where: {
        id : 1
    }});

    const appreq = await models.appversion.findOne({where: {
        id:1
    }})

    const appli = appreq.dataValues;

    console.log(datas)

    res.status(200).json({
        status:200,
        message: "app version update successfully",
        data: appli
    })
}

async function sendNotification(req,res)
{
    
}


module.exports = {
    getVersion  : getVersion,
    updateVersion : updateVersion
}