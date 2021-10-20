require('dotenv').config();
const models = require('../models');

//get all transactions by user
async function get_tx_all(req,res)
{
    const owner_uuid = req.query.uuid;
  // verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : owner_uuid,
  }});

  if(result)
  {
       var datas = await models.Transaction.findAll({ where :
      {
        user_uuid : owner_uuid,
      }});

      if(datas.length != 0)
      {
        res.status(200).json({
          status: 200,
          message: `All transaction for this user`,
          data : datas
        });
      }
      else{
        res.status(200).json({
          status: 200,
          message: `This user doesn't have any transaction`,
          data : null
        });
      }

  }
  else
  {
    res.status(401).json({
      status: 401,
      message: `This user doesn't exist`,
    });
  }
}

//get number of transaction
async function get_tx_all_number(req,res)
{
    const admin_uuid = req.query.uuid;
  // verification if uuid is exist and valid before run code
 const user = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});

  if(user && user.dataValues.roles[0] == 'ROLE_ADMIN')
  {
       var datas = await models.Transaction.findAll();

      if(datas.length != 0)
      {
        res.status(200).json({
          status: 200,
          message: `All transaction count`,
          data : {
            txnumber : datas.length
          }
        });
      }
      else{
        res.status(200).json({
          status: 200,
          message: `No transactions`,
          data : null
        });
      }

  }
  else
  {
    res.status(401).json({
      status: 401,
      message: `This user doesn't exist or not a admin`,
    });
  }
}

//get all transactions
async function get_tx_all_all(req,res)
{
    const admin_uuid = req.query.uuid;
  // verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});

  if(result)
  {
       var datas = await models.Transaction.findAll();

      if(datas.length != 0)
      {
        res.status(200).json({
          status: 200,
          message: `All transaction`,
          data : datas
        });
      }
      else{
        res.status(200).json({
          status: 200,
          message: `No transaction`,
          data : null
        });
      }

  }
  else
  {
    res.status(401).json({
      status: 401,
      message: `This user doesn't exist or not a admin`,
    });
  }
}

module.exports = {
    get_tx_all : get_tx_all,
    get_tx_all_number : get_tx_all_number,
    get_tx_all_all: get_tx_all_all
}