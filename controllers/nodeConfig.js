require('dotenv').config();
const { NODE_ENV} = process.env;
const bitcoin = require('bitcoinjs-lib');

let ETH_NODE_URL;
let ETH_NODE_WS;
let BTC_NODE_NETWORK;
let BTC_NODE_PATH;
let BTC_NODE_NETWORK_CORE;
let GETBLOCK_APIKEY;
let GETBLOCK_NETWORK;

if(NODE_ENV == 'test' || 'development')
{
    BTC_NODE_NETWORK = 'BTCTEST'
    BTC_NODE_PATH = `m/49'/1'/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.testnet
    GETBLOCK_APIKEY = 'a63d8fa7-c230-4f1d-af13-82d5de21d9fe'
    GETBLOCK_NETWORK = 'testnet'
    ETH_NODE_URL = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    ETH_NODE_WS = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
}
else if(NODE_ENV == 'devprod' || 'production')
{
    BTC_NODE_NETWORK = 'BTC'
    BTC_NODE_PATH = `m/49'/0/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.bitcoin
    GETBLOCK_APIKEY = 'a63d8fa7-c230-4f1d-af13-82d5de21d9fe'
    GETBLOCK_NETWORK = 'mainet'
    ETH_NODE_URL = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    ETH_NODE_WS = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
}

module.exports = {
    ETH_NODE_URL : ETH_NODE_URL,
    ETH_NODE_WS : ETH_NODE_WS,
    BTC_NODE_NETWORK : BTC_NODE_NETWORK,
    BTC_NODE_PATH : BTC_NODE_PATH,
    BTC_NODE_NETWORK_CORE : BTC_NODE_NETWORK_CORE,
    GETBLOCK_NETWORK: GETBLOCK_NETWORK,
    GETBLOCK_APIKEY : GETBLOCK_APIKEY
}