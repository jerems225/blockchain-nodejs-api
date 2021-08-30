require('dotenv').config();
const { NODE_ENV} = process.env;
const bitcoin = require('bitcoinjs-lib')

let ETH_NODE_URL;
let ETH_NODE_WS;
let BTC_NODE_NETWORK;
let BTC_NODE_PATH;
let BTC_NODE_NETWORK_CORE;

if(NODE_ENV == 'development')
{
    ETH_NODE_URL = 'https://eth-rinkeby.alchemyapi.io/v2/M9lOf3E8QFH_XhcjR3_6VSsYBSFiqE5R'
    ETH_NODE_WS = 'wss://eth-rinkeby.alchemyapi.io/v2/M9lOf3E8QFH_XhcjR3_6VSsYBSFiqE5R'
    BTC_NODE_NETWORK = 'BTCTEST'
    BTC_NODE_PATH = `m/49'/1'/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.testnet
}
else if(NODE_ENV == 'production')
{
    ETH_NODE_URL = 'https://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths'
    ETH_NODE_WS = 'wss://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths'
    BTC_NODE_NETWORK = 'BTC'
    BTC_NODE_PATH = `m/49'/0'/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.bitcoin
}

module.exports = {
    ETH_NODE_URL : ETH_NODE_URL,
    ETH_NODE_WS : ETH_NODE_WS,
    BTC_NODE_NETWORK : BTC_NODE_NETWORK,
    BTC_NODE_PATH : BTC_NODE_PATH,
    BTC_NODE_NETWORK_CORE : BTC_NODE_NETWORK_CORE
}