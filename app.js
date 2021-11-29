const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/gitblockchain/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//APP CONFIG
const appconfig = require('./routes/app/appversion');

//CHECK WALLET ANS CREATE


//STAKING ENDPOINT
const staking = require('./routes/staking/stake');
const rewardController = require('./controllers/staking/rewardsController');
const autorenewController = require('./controllers/staking/autoRenewController');

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

//TOKENS
const account = require('./routes/tokens/account');
const address = require('./routes/tokens/address');
const balance = require('./routes/tokens/balance');
const transaction = require('./routes/tokens/transaction');  
const gas = require('./routes/tokens/estimateGas');


//Universal Endpoint
const alltx = require('./routes/alltransactions');
const allcrypto = require('./routes/crypto/allcrypto');

//COMPANY FEES MANAGMENT
const send = require('./routes/companyfees/send');
const withdraw = require('./routes/companyfees/withdraw');
const allfees = require('./routes/companyfees/allfees');

//TWILIO ENDPOINT
const twilio = require('./routes/twilio/verify');

//MOMO ENDPOINT
const momo = require("./routes/momo/momo");

//wallet no exist
const { createWallet } = require('./controllers/crypto/addController');
createWallet();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////**********************  Call routes ***************************** */

//APP VERSION
app.use("/",appconfig);

//STAKING
app.use("/",staking);
// rewardController.rewards();
// autorenewController.run_auto_renew_stake();

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

//TOKENS
app.use("/", account);
app.use("/", address);
app.use("/", balance);
app.use("/", transaction)
app.use("/",gas);


//Universall call route
app.use("/", alltx);
app.use("/",allcrypto)

//COMPANY FEES MANAGMENT
app.use("/", send);
app.use("/", withdraw);
app.use("/",allfees);

//TWILIO ENDPOINT
app.use("/",twilio);

//MOMO ENDPOINT
app.use("/",momo);


app.listen(5500);
console.log('Server started: 5500')