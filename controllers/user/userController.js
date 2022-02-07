const models = require('../../models');

async function getUsers(req,res)
{
    const users = await models.user.findAll();
    res.status(200).json({
        status : 200,
        message : "success",
        data : users
    })
}

async function countUser(req,res)
{
    const users = await models.user.findAll();
    res.status(200).json({
        status : 200,
        message : "message",
        data : {
            users : users.length
        }
    })
}


module.exports = {
    getUsers,
    countUser
}