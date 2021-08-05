const bitcore = require('bitcore-lib');
const axios = require('axios')
const fetch = require('node-fetch')
const sochain_network = "BTCTEST";
const privateKey = "";
const sourceAddress = "mtVE8anM63kQcgKUC6oQQD9K6xiV4wsr7q";


async function sendTransaction(from,to,value)
{

    const url = `http://127.0.0.1:5500/BTC/sendTransaction?from=${from}&to=${to}&value=${value}`;

    var response = await fetch(url,{
      method: "GET"
    });

    var result = await response.json();
    console.log(result);
  
};


async function getBalance(user_address)
{
  const url = "http://127.0.0.1:5500/BTC/accountBalance/"+user_address
  var response = await fetch(url,{
    method: "GET"
  });

  var balance = await response.json()
  console.log(balance.balance +" BTC")

}


async function createAccount()
{
  const urlAccount = "http://127.0.0.1:5500/BTC/createAccount"
  var response = await fetch(urlAccount)

  var res = await response.json();

  console.log(res);
}

// sendBitcoin('tb1qeyyya7ljghrsf9vhpu5ku6s8gxtze9kqsuhr49',0.01)
// getBalance('tb1qyk9zqyt5r4acqj9su7wcwuexqffnnh59cwe09l')
// createAccount()

sendTransaction("mtVE8anM63kQcgKUC6oQQD9K6xiV4wsr7q","tb1qeyyya7ljghrsf9vhpu5ku6s8gxtze9kqsuhr49",9)
