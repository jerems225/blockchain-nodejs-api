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

async function user_createNotification(req,res)
{
    const body = req.body;
    const uuid = body.uuid;
    const title = body.title;
    const message = body.title;
    const read = body.read;
    const notification_type = body.notification_type

    const notif = {
        title : title,
        message : message,
        read : read,
        notification_type : notification_type,
        user_uuid : uuid
    }

    models.notification.create(notif).then(result => {
        res.status(200).json({
            status : 200,
            message : "Notification create successfully",
            data : result
        })
    })
}

async function all_createNotification(req,res)
{
    const body = req.body;
    const title = body.title;
    const message = body.title;
    const read = body.read;
    const notification_type = body.notification_type

    const notif = {
        title : title,
        message : message,
        read : read,
        notification_type : notification_type,
    }

    models.notification.create(notif).then(result => {
        res.status(200).json({
            status : 200,
            message : "Notification create successfully",
            data : result
        })
    })
}

async function get_user_Notification(req,res)
{
    const query = req.query;
    const uuid = query.uuid;

    const notifications = await models.notification.findAll({ where : {
        user_uuid : uuid
    }});

    res.status(200).json({
        status : 200,
        message : "get user notification",
        data : notifications
    });
}

async function get_all_notification(req,res)
{
    const notifications = await models.notification.findAll({ where : {
        user_uuid : ""
    }});

    res.status(200).json({
        status : 200,
        message : "get notification for all user",
        data : notifications
    })
}

async function readNotif(req,res)
{
    const notif_id = req.query.id;
    models.notification.update({read : true}, { where : {
        id : notif_id
    }}).then(result => {
        res.status(200).json({
            status : 200,
            message : "Notification read",
            data : result
        })
    })
}

async function getPolicy(req,res)
{
    const policy = await models.appsetting.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : policy
    })
}

async function createPolicy(req,res)
{
    var policy = {
        terms : req.body.terms,
        conditions : req.body.conditions,
        policy : req.body.policy
    }
    models.appsettings.create(policy).then(result => {
        res.status(200).json({
            status : 200,
            message : "create terms,conditions and policy ok.",
            data : result
        });
    })
}

async function updatePolicy(req,res)
{
    var policy = {
        terms : req.body.terms,
        conditions : req.body.conditions,
        policy : req.body.policy
    }
    models.appsettings.update(policy,{where: {id : 1}}).then(result => {
        res.status(200).json({
            status : 200,
            message : "update terms,conditions or policy ok.",
            data : result
        });
    })
}

async function getFaq(req,res)
{
    const faq = await models.faq.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : faq
    })
}

async function createFaq(req,res)
{
    var faq = {
        question : req.body.question,
        answer : req.body.answer,
    }
    models.faq.create(faq).then(result => {
        res.status(200).json({
            status : 200,
            message : "question or answer add successfully.",
            data : result
        });
    })
}

async function updateFaq(req,res)
{
    const id_question = req.params.id_question;
    var faq = {
        question : req.body.question,
        answer : req.body.answer,
    }
    models.faq.update(faq,{where: {id:id_question}}).then(result => {
        res.status(200).json({
            status : 200,
            message : "question or answer update successfully.",
            data : result
        });
    })
}

async function getSupport(req,res)
{
    const support = await models.support.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : support
    })
}

async function createSupport(req,res)
{
    var support = {
        title : req.body.title,
        message : req.body.message,
        user_uuid : req.body.user_uuid
    }

    models.support.create(support).then(result => {
        res.status(200).json({
            status : 200,
            message : "request sent successfully.",
            data : result
        })
    })
}






module.exports = {
    getVersion  : getVersion,
    updateVersion : updateVersion,
    all_createNotification : all_createNotification,
    user_createNotification : user_createNotification,
    get_user_Notification : get_user_Notification,
    get_all_notification : get_all_notification,
    readNotif : readNotif,
    getPolicy : getPolicy,
    createPolicy :createPolicy,
    updatePolicy : updatePolicy,
    getFaq : getFaq,
    createFaq : createFaq,
    updateFaq : updateFaq,
    getSupport : getSupport,
    createSupport : createSupport,
}