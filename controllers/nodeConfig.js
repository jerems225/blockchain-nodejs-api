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
    ETH_NODE_URL = 'https://eth-ropsten.alchemyapi.io/v2/DtisPs5RMmTFGdGJAD2ExehMc_amW-8R'
    ETH_NODE_WS = 'wss://eth-ropsten.alchemyapi.io/v2/DtisPs5RMmTFGdGJAD2ExehMc_amW-8R'
    BTC_NODE_NETWORK = 'BTCTEST'
    BTC_NODE_PATH = `m/49'/1'/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.testnet
    GETBLOCK_APIKEY = '96c23333-21a1-4d38-9617-4d5153b3316b'
    GETBLOCK_NETWORK = 'testnet'
}
else if(NODE_ENV == 'devprod' || 'production')
{
    ETH_NODE_URL = 'https://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths'
    ETH_NODE_WS = 'wss://eth-mainnet.alchemyapi.io/v2/3MnmvJUyt4yXV0UDUFdrGlw2V11KJths'
    BTC_NODE_NETWORK = 'BTC'
    BTC_NODE_PATH = `m/49'/0/0'/0`
    BTC_NODE_NETWORK_CORE = bitcoin.networks.bitcoin
    GETBLOCK_APIKEY = '96c23333-21a1-4d38-9617-4d5153b3316b'
    GETBLOCK_NETWORK = 'mainet'
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