const models = require('../../models');

async function stakeconfig(req,res)
{
    const body = req.body;
    const uuid = body.uuid;
    const crypto_name  = body.crypto_name;
    const rates = body.rates;
    const days = body.days;

    const userRequest = await models.user.findOne({where :{
        uuid : uuid
    }});
    if(userRequest)
    {
        const user = userRequest.dataValues;
        if(user.roles[0] == "ROLE_ADMIN")
        {
            const configObj = {
                crypto_name : crypto_name,
                rates : rates,
                days : days
            }

            models.stakeconfig.create(configObj).then(result => {
                res.status(200).json({
                  status: 200,
                  message: `${crypto_name} staking config add successfully`,
                  datas: result
              });
          }).catch(error => {
              res.status(500).json({
                  status : 500,
                  message: "Something went wrong",
                  error : error
              });
          });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `This user doesn't have access for that endpoint.`,
                data : null
            });
        }
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

async function updateStakeconfig(req,res)
{
    const body = req.body;
    const uuid = body.uuid;
    const crypto_name  = body.crypto_name;
    const rates = body.rates;
    const days = body.days;

    const userRequest = await models.user.findOne({where :{
        uuid : uuid
    }});
    if(userRequest)
    {
        const user = userRequest.dataValues;
        if(user.roles[0] == "ROLE_ADMIN")
        {
            const configObj = {
                crypto_name : crypto_name,
                rates : rates,
                days : days
            }

            models.stakeconfig.update(configObj,{where: {
                crypto_name : crypto_name
            }}).then(result => {
                res.status(200).json({
                  status: 200,
                  message: `${crypto_name} staking config update successfully`,
                  datas: result
              });
          }).catch(error => {
              res.status(500).json({
                  status : 500,
                  message: "Something went wrong",
                  error : error
              });
          });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `This user doesn't have access for that endpoint.`,
                data : null
            });
        }
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

async function getstakingconfig(req,res)
{
    const query = req.query;
    const uuid = query.uuid;
    const crypto_name  = query.crypto_name;

    const userRequest = await models.user.findOne({where :{
        uuid : uuid
    }});
    if(userRequest)
    {
        const user = userRequest.dataValues;
        if(user.roles[0] == "ROLE_ADMIN")
        {

            models.stakeconfig.findOne({where: {
                crypto_name : crypto_name
            }}).then(result => {
                res.status(200).json({
                  status: 200,
                  message: `${crypto_name} staking config update successfully`,
                  datas: result
              });
          }).catch(error => {
              res.status(500).json({
                  status : 500,
                  message: "Something went wrong",
                  error : error
              });
          });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `This user doesn't have access for that endpoint.`,
                data : null
            });
        }
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

module.exports = {
    stakeconfig : stakeconfig,
    updateStakeconfig : updateStakeconfig,
    getstakingconfig : getstakingconfig
}