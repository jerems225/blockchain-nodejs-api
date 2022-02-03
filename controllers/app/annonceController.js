const models = require('../../models');

async function getAllAnnonce(req,res)
{
    const annonces = await models.annonce.findAll();
    if(annonces.length == 0)
    {
        res.status(200).json({
            status : 200,
            message : "no announcementb on this app",
            data : null
        })
    }
    else
    {
        res.status(200).json({
            status : 200,
            message : "all announcement on this app",
            data : annonces
        })
    }
}

async function getAnnonce(req,res)
{
    const id_annonce = req.params.id_annonce;
    const annonces = await models.annonce.findOne({ where : {
        id : id_annonce
    }})

    const annonce = annonces.dataValues;
    if(annonces)
    {
        res.status(200).json({
            status : 200,
            messgae : "success",
            data  : annonce
        })
    }else{
        res.status(401).json({
            status : 401,
            message : "This pub doesn't exist in this system or the admin remove it!",
            data : null
        })
    }
}

async function createAnnonce(req,res)
{
    const annonce = {
        title : req.body.title,
        description : req.body.description,
        lien : req.body.lien,
        status : req.body.status
    }

    models.annonce.create(annonce).then(result => {
        res.status(200).json({
            status: 200,
            message: "Pub add successfully!",
            data : reslut
        })
    })
}

async function updateAnnonce(req,res)
{
    const id_annonce = req.params.id_annonce;
    const annonce = {
        title : req.body.title,
        description : req.body.description,
        lien : req.body.lien,
        status : req.body.status
    }

    models.annonce.update(annonce,{where: {
        id : id_annonce
    }}).then(result => {
        res.status(200).json({
            status: 200,
            message: "Pub update successfully",
            data: result
        })
    })
}

async function deleteAnnonce(req,res)
{
    const id_annonce = req.params.id_annonce;
    models.annonce.destroy({where : {
        id : id_annonce
    }}).then(result => {
        res.status(200).json({
            status : 200,
            message: "success"
        })
    })

}

module.exports = {
    getAllAnnonce,
    getAnnonce,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce
}