require('dotenv').config();
const models = require('../../models');
const crypto_name = ["bitcoin","ethereum","tether","simbcoin"];

//withdraw Fees
async function createwithdrawFees(req,res)
{
const admin_uuid = req.query.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
    if(result.dataValues.roles[0] == "ROLE_ADMIN")
    {

        const fees = await models.Fees.findAll({ where :
            {
                fees_type : 'withdraw',
            }});

        if(fees.length == 0)
        {
            const creObject = {
                fastplus: req.query.fastplus,
                fast : req.query.fast,
                medium : req.query.medium,
                normal : req.query.normal,
                fees_type : 'withdraw'
            }
            const datas = await models.Fees.create(creObject);
            res.status(200).json({
                status: 200,
                message: `Successfully Add Company Fees For Withdraw`,
                data : datas
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `Aleady Exist`,
              });
        }
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `UnAuthorized User`,
          });
    }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}
async function getwithdrawFees(req,res)
{
const admin_uuid = req.params.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
      const datas = await models.Fees.findOne({ where :
      {
          fees_type : 'withdraw',
      }});
      if(datas)
      {
        const fees = {
          fees_type: datas.dataValues.fees_type,
          fastplus : Number(datas.dataValues.fastplus)*0.01,
          fast : Number(datas.dataValues.fast)*0.01,
          medium : Number(datas.dataValues.medium)*0.01,
          normal : Number(datas.dataValues.normal)*0.01
        }
          res.status(200).json({
              status: 200,
              message: `Company Fees For Withdraw`,
              data : fees
          });
      }
      else
      {
          res.status(200).json({
              status: 200,
              message: `No Fees Managment`,
              data : null
          });
      }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}

async function updatewithdrawFees(req,res)
{
const admin_uuid = req.query.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
    if(result.dataValues.roles[0] == "ROLE_ADMIN")
    {
        const upObject = {
            fastplus: req.query.fastplus,
            fast : req.query.fast,
            medium : req.query.medium,
            normal : req.query.normal,
            fees_type: 'withdraw'
        }
        const datas = await models.Fees.update(upObject,{ where :
        {
            fees_type : 'withdraw',
        }});
        if(datas)
        {
            res.status(200).json({
                status: 200,
                message: `Successsfully Update Company Fees percent For Withdraw`,
                data : upObject
            });
        }
        else{
            res.status(200).json({
                status: 200,
                message: `No Fees Managment`,
                data: null
            });
        }
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `UnAuthorized User`,
          });
    }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}


//Transaction Fees
async function createsendFees(req,res)
{
const admin_uuid = req.query.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
    if(result.dataValues.roles[0] == "ROLE_ADMIN")
    {
        const fees = await models.Fees.findAll({ where :
            {
                fees_type : 'send',
            }});

        if(fees.length == 0)
        {
            const creObject = {
                fastplus: req.query.fastplus,
                fast : req.query.fast,
                medium : req.query.medium,
                normal : req.query.normal,
                fees_type : 'send'
            }
            const datas = await models.Fees.create(creObject);
            res.status(200).json({
                status: 200,
                message: `Successfully Add Company Fees For send transaction`,
                data : datas
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `Aleady Exist`,
              });
        }
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `UnAuthorized User`,
          });
    }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}

async function getsendFees(req,res)
{
const admin_uuid = req.params.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
      const datas = await models.Fees.findOne({ where :
      {
          fees_type : 'send',
      }});
      if(datas)
      {
        const fees = {
          fees_type: datas.dataValues.fees_type,
          fastplus : Number(datas.dataValues.fastplus)*0.01,
          fast : Number(datas.dataValues.fast)*0.01,
          medium : Number(datas.dataValues.medium)*0.01,
          normal : Number(datas.dataValues.normal)*0.01
        }
          res.status(200).json({
              status: 200,
              message: `Company Fees For Send Transaction`,
              data : fees
          });
      }
      else
      {
          res.status(200).json({
              status: 200,
              message: `No Fees Managment`,
              data : null
          });
      }
    
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}

async function updatesendFees(req,res)
{
const admin_uuid = req.query.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
    if(result.dataValues.roles[0] == "ROLE_ADMIN")
    {
        const upObject = {
            fastplus: req.query.fastplus,
            fast : req.query.fast,
            medium : req.query.medium,
            normal : req.query.normal,
            fees_type: 'send'
        }
        const datas = await models.Fees.update(upObject,{ where :
        {
            fees_type : 'send',
        }});
        if(datas)
        {
            res.status(200).json({
                status: 200,
                message: `Successfully Update Company Fees percent For send Transaction`,
                data : upObject
            });
        }
        else{
            res.status(200).json({
                status: 200,
                message: `No Fees Managment`,
                data : null
            });
        }
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `UnAuthorized User`,
          });
    }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}

//get all transaction fees 
async function getallfees(req,res)
{
  const admin_uuid = req.query.uuid;
// verification if uuid is exist and valid before run code
 const result = await models.user.findOne({ where :
  {
    uuid : admin_uuid,
  }});
  if(result)
  {
    if(result.dataValues.roles[0] == "ROLE_ADMIN")
    {
        var btcfees = 0;
        var ethfees = 0;
        var usdtfees = 0;
        var smbfees = 0;

        const datas = await models.CompanyFees.findAll();
        if(datas.length != 0)
        {
            for(var i=0;i<=datas.length-1;i++)
            {
                if(datas[i].crypto_name == crypto_name[0])
                {
                  btcfees = btcfees + datas[i].amount;
                }
                else if(datas[i].crypto_name == crypto_name[1])
                {
                  ethfees = ethfees + datas[i].amount;
                }
                else if(datas[i].crypto_name == crypto_name[2])
                {
                  smbfees = smbfees + datas[i].amount;
                }
                else if(datas[i].crypto_name == crypto_name[3])
                {
                  usdtfees = usdtfees + datas[i].amount;
                }
             
            }

            var feeobject = [
                    {
                    name : "bitcoin",
                    fee : btcfees,
                    symbol : 'BTC'
                    },
                    {
                    name : "ethereum",
                    fee : ethfees,
                    symbol : 'ETH'
                    },
                    {
                    name : "simbcoin",
                    fee : smbfees,
                    symbol : 'SMB'
                    },
                    {
                    name: "tether",
                    fee : usdtfees,
                    symbol : 'USDT'
                    }
                  ]
            res.status(200).json({
                status: 200,
                message: `Total of company fees collect.`,
                data : feeobject
            });
        }
        else
        {
            res.status(401).json({
                status: 401,
                message: `Empty`,
            });
        }
    }
    else
    {
        res.status(401).json({
            status: 401,
            message: `UnAuthorized User`,
          });
    }
  }
  else{
    res.status(401).json({
        status: 401,
        message: `Unknown User`,
      });
  }
}

module.exports = {
    createsendFees: createsendFees,
    createwithdrawFees : createwithdrawFees,
    getwithdrawFees : getwithdrawFees,
    getsendFees : getsendFees,
    updatewithdrawFees : updatewithdrawFees,
    updatesendFees : updatesendFees,
    getallfees : getallfees
}

