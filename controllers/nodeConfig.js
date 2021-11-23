require('dotenv').config();
const { NODE_ENV} = process.env;
const bitcoin = require('bitcoinjs-lib');

let ETH_NODE_URL;
let ETH_NODE_WS;
let BTC_NODE_NETWORK;
let BTC_NODE_PATH;
let BTC_NODE_NETWORK_CORE;
let GETBLOCK_APIKEY = '794a1000-bb39-41c3-9bde-c689950e7e4c';
let GETBLOCK_NETWORK;
let INFURA_APIKEY = "cc765c53051248f49e69775c937242a2";

if(NODE_ENV == 'test' || NODE_ENV == 'development')
{
    BTC_NODE_NETWORK = 'BTCTEST'
    BTC_NODE_PATH = `m/49'/1'/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.testnet
    GETBLOCK_NETWORK = 'testnet'
    //ETH_NODE_URL = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    //ETH_NODE_WS = `wss://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    ETH_NODE_URL = `https://ropsten.infura.io/v3/${INFURA_APIKEY}`
    ETH_NODE_WS = `wss://ropsten.infura.io/ws/v3/${INFURA_APIKEY}`
}
else if(NODE_ENV == 'devprod' || NODE_ENV == 'production' )
{
    BTC_NODE_NETWORK = 'BTC'
    BTC_NODE_PATH = `m/49'/0/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.bitcoin
    GETBLOCK_NETWORK = 'mainet'
    //ETH_NODE_URL = `https://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    //ETH_NODE_WS = `wss://eth.getblock.io/${GETBLOCK_NETWORK}/?api_key=${GETBLOCK_APIKEY}`
    ETH_NODE_URL = `https://mainnet.infura.io/v3/${INFURA_APIKEY}`
    ETH_NODE_WS = `wss://mainnet.infura.io/ws/v3/${INFURA_APIKEY}`
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