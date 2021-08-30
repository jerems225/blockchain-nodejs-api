require('dotenv').config();
const { NODE_ENV} = process.env;

let simbAddress;
let usdtAddress;
let fauAddress;

if(NODE_ENV == 'development')
{
    simbAddress = '0x9277CfD32739F926bB7C56dBfEC6a88acac2EA25'
    usdtAddress = '0x512a34a032116ecde07bfe47e731b2d16b77a5fb'
    fauAddress  = '0x092de782a7e1e0a92991ad829a0a33aef3c7545e'
}
else if(NODE_ENV == 'production')
{
    simbAddress = '0x53bd789f2cdb846b227d8ffc7b46ed4263231fdf'
    usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
}

module.exports = {
    simbAddress : simbAddress,
    usdtAddress : usdtAddress,
    fauAddress : fauAddress,
}