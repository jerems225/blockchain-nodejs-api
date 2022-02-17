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
//const rewardController = require('./controllers/staking/rewardsController');
//const autorenewController = require('./controllers/staking/autoRenewController');

//create all wallet
const wallets = require('./routes/simplyendpoint');

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

//ETHEREUM TOKENS
const account = require('./routes/tokens/account');
const address = require('./routes/tokens/address');
const balance = require('./routes/tokens/balance');
const transaction = require('./routes/tokens/transaction');  
const gas = require('./routes/tokens/estimateGas');

//BSC
const accountBsc = require('./routes/binance/account');
const addressBsc = require('./routes/binance/address');
const balanceBsc = require('./routes/binance/balance');
const transactionBsc = require('./routes/binance/transaction');
// const newtxBSC = require('./controllers/binance/newtransactionController');
const gasBsc = require('./routes/binance/estimateGas');

//BSC TOKENS
const accountBSCtoken = require('./routes/bsctokens/account');
const addressBSCtoken = require('./routes/bsctokens/address');
const balanceBSCtoken = require('./routes/bsctokens/balance');
const transactionBSCtoken = require('./routes/bsctokens/transaction');  
const gasBSCtoken = require('./routes/bsctokens/estimateGas');

//const newtxBSC = require('./controllers/binance/newtransactionController');


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

//ADMIN
const admin = require("./routes/admin/admin");

//USER
const user = require('./routes/user/user');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////**********************  Call routes ***************************** */

//APP VERSION
app.use("/",appconfig);

//STAKING
app.use("/",staking);
// rewardController.rewards();
// autorenewController.run_auto_renew_stake();

//create all wallet
app.use("/",wallets);

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

//ETHEREUM TOKENS
app.use("/", account);
app.use("/", address);
app.use("/", balance);
app.use("/", transaction)
app.use("/",gas);

//BINANCE
app.use("/", accountBsc);
app.use("/", addressBsc);
app.use("/", balanceBsc);
app.use("/", transactionBsc)
app.use("/",gasBsc);

//BSC TOKENS
app.use("/", accountBSCtoken);
app.use("/", addressBSCtoken);
app.use("/", balanceBSCtoken);
app.use("/", transactionBSCtoken)
app.use("/",gasBSCtoken);

//websocket listener for binance new transaction
// newtxBSC.get_bsc_tx_new()


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

//ADMIN
app.use("/",admin); 

//USER
app.use("/",user);


//wallet no exist
// const { createWallet } = require('./controllers/crypto/addController');
// createWallet();


app.listen(5500);
console.log('********************************   Server started Port: 5500 ***************************************************************')