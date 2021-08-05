const express = require('express');
const app = express();

//ETH
const accountEth = require('./routes/ethereum/account');
const balanceEth = require('./routes/ethereum/balance');
const transactionEth = require('./routes/ethereum/transaction');

//BTC
const accountBtc = require('./routes/bitcoin/account');
const balanceBtc = require('./routes/bitcoin/balance');
const transactionBtc = require('./routes/bitcoin/transaction');

//SMB
const accountSmb = require('./routes/simbcoin/account');
const balanceSmb = require('./routes/simbcoin/balance');
const transactionSmb = require('./routes/simbcoin/transaction');

//USDT
const accountUsdt = require('./routes/tether/account');
const balanceUsdt = require('./routes/tether/balance');
const transactionUsdt = require('./routes/tether/transaction');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////**********************  Call routes ***************************** */

//ETH
app.use("/", accountEth);
app.use("/", balanceEth);
app.use("/", transactionEth);

//BTC
app.use("/", accountBtc);
app.use("/", balanceBtc);
app.use("/", transactionBtc);

//SMB
app.use("/", accountSmb);
app.use("/", balanceSmb);
app.use("/", transactionSmb);

//USDT
app.use("/", accountUsdt);
app.use("/", balanceUsdt);
app.use("/", transactionUsdt);


app.listen(5500,() => console.log('Server started: 5500'));