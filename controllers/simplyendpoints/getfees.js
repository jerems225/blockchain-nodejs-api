const {BASE_IP} = process.env;
const fetch = require('node-fetch');
const models = require('../../models');

async function getfees(req,res)
{
    const uuid = req.query.uuid;
    const transaction_type = req.query.tx_type;
    const fee_type = req.query.fee_type;
    const crypto_name = req.query.crypto_name;
    const value = req.query.value;

    const cryptoRequest = await models.Crypto.findOne({where:{
        crypto_name : crypto_name
    }});
    const crypto = cryptoRequest.dataValues;

    // console.log(cryptoRequest)
    // process.exit();
    const prefix = crypto.prefix;
    var prefix_url="";
    if(prefix != null)
    {
        prefix_url = "/"+prefix;
    }
    const symbol = crypto.crypto_symbol;
    const blockchain = crypto.blockchain;
    const istoken = crypto.crypto_type;
    const crypto_name_market = crypto.crypto_name_market;

    var tx_fee;
    var company_fee;
    var fees_usd_dollar;
    var fees;

    if(transaction_type == "send")
    {
        //get tx fee
        const estimatefeeurl = `https://${BASE_IP}${prefix_url}/${symbol}/estimatefees?uuid=${uuid}&to=0x7991C46F3e4fdA773E853B4411d475eBBb2f2968&value=${value}&fees_type=${transaction_type}`;
        var reqestimate = await fetch(estimatefeeurl,{
            method: "POST"
        });
        var resestimate = await reqestimate.json();
        tx_fee = resestimate.data[fee_type];

        //get company fee
        const companyfeeurl = `http://${BASE_IP}/allfees/sendtransaction/${uuid}`;
        var reqcomp = await fetch(companyfeeurl,{
            method: "GET"
        });
        var rescomp = await reqcomp.json();
        company_fee = rescomp.data[fee_type]*Number(value);
    }
    else if(transaction_type == "withdraw")
    {
        //get tx fee
        const estimatefeeurl = `https://${BASE_IP}${prefix}/${symbol}/estimatefees?uuid=${uuid}&to=0x7991C46F3e4fdA773E853B4411d475eBBb2f2968&value=1&fees_type=${transaction_type}`;
        var reqestimate = await fetch(estimatefeeurl,{
            method: "POST"
        });
        var resestimate = await reqestimate.json();
        tx_fee = resestimate.data[fee_type];

        //get company fee
        const companyfeeurl = `https://${BASE_IP}/allfees/withdraw/${uuid}`;
        var reqcomp = await fetch(companyfeeurl,{
            method: "GET"
        });
        var rescomp = await reqcomp.json();
        company_fee = rescomp.data[fee_type]*Number(value);
    }

    if(blockchain == "ethereum" && istoken)
    {
        const urlethprice = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=eth`;
        var request = await fetch(urlethprice,{
            method: "GET"
        });
        var response = await request.json();
        company_fee = company_fee*response[crypto_name_market].eth;
    }
    else if(blockchain == "binnace" && istoken)
    {
        const urlbnbprice = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=bnb`;
        var request = await fetch(urlbnbprice,{
            method: "GET"
        });
        var response = await request.json();
        company_fee = company_fee*response[crypto_name_market].bnb;
    }

    var urlusd=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_name_market}&vs_currencies=usd`; 
    var response_usd = await fetch(urlusd,{method: "GET"});
    var result_usd = await response_usd.json();
    fees_usd_dollar = result_usd[crypto_name_market].usd*(tx_fee+company_fee);
    fees = tx_fee + company_fee;

    res.status(200).json({
        status: 200,
        message: "success",
        data: {
            tx_fee: tx_fee,
            company_fee: company_fee,
            fees_crypto: fees,
            fees_usd: fees_usd_dollar
        }
    });

}


module.exports = {
    getfees
}