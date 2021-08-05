const express = require('express');
const app = express();
require('./app');
require('./models/dbConfig');

const transactionController = require('./controllers/ethereum/transactionController');


app.use('/',transactionController);

app.listen(5500,() => console.log('Server started: 5500'));