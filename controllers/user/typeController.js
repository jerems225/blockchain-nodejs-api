const models = require('../../models');


async function getUserType(req,res)
{
    const types = await models.usertype.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : types
    })
} 

async function getType(req,res)
{
    const id_type = req.params.id_type;
    const type = await models.usertype.findAOne({where: {
        id : id_type
    }});
    if(type)
    {
        res.status(200).json({
            status : 200,
            message : "success",
            data : type.dataValues
        })
    }else
    {
        res.status(401).json({
            status : 401,
            message : "usertpyee not found",
            data : null
        })
    }
    
} 

async function addType(req,res){
    const type = {
        name : req.body.name,
        limittransfert: req.body.limittransfert
    }
    models.usertype.create(type).then(result => {
        res.status(200).json({
            status : 200,
            message : "success",
            data : result
        })
    })
}

async function updateType(req,res){
    const id_type = req.params.id_type;
    const type = {
        name : req.body.name,
        limittransfert: req.body.limittransfert
    }
    models.usertype.update(type,{
        where: {
            id : id_type
        }
    }).then(result => {
        res.status(200).json({
            status : 200,
            message : "success",
            data : result
        })
    })
}

async function deleteType(req,res){
    const id_type = req.params.id_type;
    models.usertype.destroy({where : {
        id : id_type
    }}).then(result => {
        res.status(200).json({
            status : 200,
            message: "success"
        })
    })
}


module.exports = {
    getUserType,
    getType,
    addType,
    updateType,
    deleteType
}