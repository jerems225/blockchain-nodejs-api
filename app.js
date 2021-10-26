const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/gitblockchain/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ETH
const accountEth = require('./routes/ethereum/account');
const addressEth = require('./routes/ethereum/address');
const balanceEth = require('./routes/ethereum/balance');
const transactionEth = require('./routes/ethereum/transaction');
// const newtxETH = require('./controllers/ethereum/newtransactionController');
const gasEth = require('./routes/ethereum/estimateGas');

//BTC
const accountBtc = require('./routes/bitcoin/account');
const addressBtc = require('./routes/bitcoin/address');
const balanceBtc = require('./routes/bitcoin/balance');
const transactionBtc = require('./routes/bitcoin/transaction');
// const newtxBTC = require('./controllers/bitcoin/newtransactionController');

//SMB
const accountSmb = require('./routes/simbcoin/account');
const addressSmb = require('./routes/simbcoin/address');
const balanceSmb = require('./routes/simbcoin/balance');
const transactionSmb = require('./routes/simbcoin/transaction');  
const gasSmb = require('./routes/simbcoin/estimateGas');

//USDT
const accountUsdt = require('./routes/tether/account');
const addressUsdt = require('./routes/tether/address');
const balanceUsdt = require('./routes/tether/balance');
const transactionUsdt = require('./routes/tether/transaction');
const gasUsdt = require('./routes/tether/estimateGas');

//Universal Endpoint
const alltx = require('./routes/alltransactions');
const allcrypto = require('./routes/crypto/allcrypto');

//COMPANY FEES MANAGMENT
const send = require('./routes/companyfees/send');
const withdraw = require('./routes/companyfees/withdraw');
const allfees = require('./routes/companyfees/allfees');


//TWILIO ENDPOINT
const request = require('./routes/twilio/request');
const verify = require('./routes/twilio/verify');
const reset = require('./routes/twilio/reset');
const config = require('./routes/twilio/config');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////**********************  Call routes ***************************** */

//ETH
app.use("/", accountEth);
app.use("/", addressEth);
app.use("/", balanceEth);
app.use("/", transactionEth);
app.use("/",gasEth);

//websocket listener for ethereum new transaction
// newtxETH.get_eth_tx_new()

//BTC
app.use("/", accountBtc);
app.use("/", addressBtc);
app.use("/", balanceBtc);
app.use("/", transactionBtc);

//websocket listener for bitcoin new transaction
// newtxBTC.get_btc_tx_new()

//SMB
app.use("/", accountSmb);
app.use("/", addressSmb);
app.use("/", balanceSmb);
app.use("/", transactionSmb);
app.use("/",gasSmb);


//USDT
app.use("/", accountUsdt);
app.use("/", addressUsdt);
app.use("/", balanceUsdt);
app.use("/", transactionUsdt);
app.use("/",gasUsdt);


//Universall call route
app.use("/", alltx);
app.use("/",allcrypto)

//COMPANY FEES MANAGMENT
app.use("/", send);
app.use("/", withdraw);
app.use("/",allfees);

//TWILIO ENDPOINT
app.use("/",request);
app.use("/",verify);
app.use("/",reset);
app.use("/",config);


app.listen(5500);
console.log('Server started: 5500')