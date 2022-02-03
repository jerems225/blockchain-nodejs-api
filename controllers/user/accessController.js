const models = require('../../models');


async function getPageRestrict(req,res)
{
    const pages = await models.pagerestrict.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : pages
    })
} 

async function getPage(req,res)
{
    const id_page = req.params.id_page;
    const pages = await models.pagerestrict.findOne({where: {
        id : id_page
    }});
    if(pages)
    {
        res.status(200).json({
            status : 200,
            message : "success",
            data : pages.dataValues
        })
    }else
    {
        res.status(401).json({
            status : 401,
            message : "page not found",
            data : null
        })
    }
    
} 

async function addPage(req,res){
    const page = {
        name : req.query.name
    }
    models.pagerestrict.create(page).then(result => {
        res.status(200).json({
            status : 200,
            message : "success",
            data : result
        })
    });
}

async function updatePage(req,res){
    const id_page = req.params.id_page;
    const page = {
        name : req.query.name
    }
    models.pagerestrict.update(page,{
        where: {
            id : id_page
        }
    }).then(result => {
        res.status(200).json({
            status : 200,
            message : "success",
            data : result
        })
    })
}

async function deletePage(req,res){
    const id_page = req.params.id_page;
    models.pagerestrict.destroy({where : {
        id : id_page
    }}).then(result => {
        res.status(200).json({
            status : 200,
            message: "success"
        })
    })
}


module.exports = {
    getPageRestrict,
    getPage,
    addPage,
    updatePage,
    deletePage
}