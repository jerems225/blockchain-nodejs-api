const bitcore = require('bitcore-lib');
const axios = require('axios')
const fetch = require('node-fetch')
const sochain_network = "BTCTEST";
const privateKey = "";
const sourceAddress = "mtVE8anM63kQcgKUC6oQQD9K6xiV4wsr7q";

const user_uuid = "0xc697486fjhgb96e4f13ba4754b9d5cba5c9";


async function sendTransaction(user_uuid,to,value)
{

    const url = `http://127.0.0.1:5500/BTC/sendTransaction?uuid=${user_uuid}&to=${to}&value=${value}`;

    var response = await fetch(url,{
      method: "GET"
    });

    var result = await response.json();
    console.log(result);
  
};


async function getBalance(user_uuid)
{
  const url = "http://127.0.0.1:5500/BTC/accountBalance/"+user_uuid
  var response = await fetch(url,{
    method: "GET"
  });

  var balance = await response.json()
  console.log(balance.balance +" BTC")

}


async function createAccount()
{
  const rateUrl = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
  const reqRate = await fetch(rateUrl,{
    method : "GET"
  })
  const rate = await reqRate.json();
  
  console.log(rate)
}
async function fees()
{
  const rateUrl = "https://bitcoinfees.earn.com/api/v1/fees/recommended";
  const reqRate = await fetch(rateUrl,{
    method : "GET"
  })
  const rate = await reqRate.json();
  
  console.log(rate)
}
fees()



// async function createAddress()

// sendBitcoin('tb1qeyyya7ljghrsf9vhpu5ku6s8gxtze9kqsuhr49',0.01)
// getBalance(user_uuid)
// createAccount()

// sendTransaction(user_uuid,"tb1qyk9zqyt5r4acqj9su7wcwuexqffnnh59cwe09l",0.0001)
