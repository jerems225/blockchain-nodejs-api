require('dotenv').config();
const models = require('../models');


async function get_tx_all(req,res)
{
    const owner_uuid = req.query.uuid;
  // verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : owner_uuid,
  }});

  if(!result)
  {
       datas = await models.Transaction.findAll({ where :
      {
        user_uuid : owner_uuid,
      }});

      
    res.status(200).json({
      status: 200,
      message: `All transaction for this user`,
      data : datas
    });
  }
  else
  {
    res.status(401).json({
      status: 401,
      message: `This user doesn't have any transaction`,
      data : datas
    });
  }
}

module.exports = {
    get_tx_all : get_tx_all,
}