require('dotenv').config();
const models = require('../../models');
const bitcoin = require('bitcoinjs-lib');
const zmq = require('zeromq');
const crypto_name = "bitcoin" ;

const sock = zmq.socket('sub');
const addr = 'tcp://127.0.0.1:3000';



async function get_btc_tx_confirmation(uuid)
{
    const owner_uuid = uuid;


  //verification if uuid is exist and valid before run code
 const result = await models.Transaction.findAll({ where :
  {
    user_uuid : owner_uuid,
    crypto_name : crypto_name
  }});

  if(result.length != 0)
  {
      console.log({
        status : 401,
        message: `No transaction for this user`
    });
  }
  else
  {
    sock.connect(addr);
    sock.subscribe('rawtx');
    console.log('sock:', sock);
    sock.on('message', function(topic, message) {
      console.log('topic:', topic.toString());
        if (topic.toString() === 'rawtx') {
            var rawTx = message.toString('hex');
            var tx = bitcoin.Transaction.fromHex(rawTx);
            var txid = tx.getId();
            console.log('received transaction', txid, tx);
        }
    });
  }
    
}

get_btc_tx_confirmation('1d654d02-d2c8-4fba-89e7-2cea31e90451')

// module.exports = {
//     get_btc_tx_confirmation : get_btc_tx_confirmation
// }