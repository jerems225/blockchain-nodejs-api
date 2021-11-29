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

module.exports = {
    getVersion  : getVersion,
    updateVersion : updateVersion,
    all_createNotification : all_createNotification,
    user_createNotification : user_createNotification,
    get_user_Notification : get_user_Notification,
    get_all_notification : get_all_notification,
    readNotif : readNotif
}