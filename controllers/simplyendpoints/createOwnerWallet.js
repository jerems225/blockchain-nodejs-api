const btc = require('../bitcoin/accountController');
const eth = require('../ethereum/accountController');
const ethtoken = require('../tokens/accountController');
const bsctoken = require('../bsctokens/accountController');

async function createOwnerStakeWallet(name,blockchain)
{
    // btc.create_owner_Btc_Account();
    // eth.create_owner_Eth_Account();
    if(blockchain == "ethereum")
    {
        ethtoken.create_owner_TokenAccount(name);
    }
    else if(blockchain == "binance")
    {
        bsctoken.create_owner_TokenAccount(name);
    }
}

module.exports = {
    createOwnerStakeWallet
}