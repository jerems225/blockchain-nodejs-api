const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ETH
const accountEth = require('./routes/ethereum/account');
const addressEth = require('./routes/ethereum/address');
const balanceEth = require('./routes/ethereum/balance');
const transactionEth = require('./routes/ethereum/transaction');

//BTC
const accountBtc = require('./routes/bitcoin/account');
const addressBtc = require('./routes/bitcoin/address');
const balanceBtc = require('./routes/bitcoin/balance');
const transactionBtc = require('./routes/bitcoin/transaction');

//SMB
const accountSmb = require('./routes/simbcoin/account');
const addressSmb = require('./routes/simbcoin/address');
const balanceSmb = require('./routes/simbcoin/balance');
const transactionSmb = require('./routes/simbcoin/transaction');

//USDT
const accountUsdt = require('./routes/tether/account');
const addressUsdt = require('./routes/tether/address');
const balanceUsdt = require('./routes/tether/balance');
const transactionUsdt = require('./routes/tether/transaction');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////**********************  Call routes ***************************** */

//ETH
app.use("/", accountEth);
app.use("/", addressEth);
app.use("/", balanceEth);
app.use("/", transactionEth);

//BTC
app.use("/", accountBtc);
app.use("/", addressBtc);
app.use("/", balanceBtc);
app.use("/", transactionBtc);

//SMB
app.use("/", accountSmb);
app.use("/", addressSmb);
app.use("/", balanceSmb);
app.use("/", transactionSmb);

//USDT
app.use("/", accountUsdt);
app.use("/", addressUsdt);
app.use("/", balanceUsdt);
app.use("/", transactionUsdt);


app.listen(5500);
console.log('Server started: 5500')