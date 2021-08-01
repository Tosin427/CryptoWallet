import bitcore from 'bitcore-lib';
import axios from 'axios';

// muetT8zZ7HfpWSsYqVyiRHZkFkrnkcTroe
// 92akzxGABDS8CWDS4cAvG4yJ9or5J23SE63fYJQkG5jQaAEkahq

// mwpHuYM4VLwoMSS57hexWZPWv8pU9aojEJ
// 92eArV8VLZups3BHBJfoF4wbTDLm2PSv9wtFkyqZaVUrwHpbzyr

// 02319558912db6a5830d6fa78faddc42bf50c3fef73340f69ea8cbef4853b24df0
// 1DLcJw9A96RPG5DbePtgtKQigj4TMEm1nX

const sendBitcoin = async (recieverAddress, amountToSend) => {
  const sochain_network = 'BTC';
  const privateKey =
    '02319558912db6a5830d6fa78faddc42bf50c3fef73340f69ea8cbef4853b24df0';
  const sourceAddress = '1DLcJw9A96RPG5DbePtgtKQigj4TMEm1nX';
  const satoshiToSend = amountToSend * 100000000;
  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;
  const utxos = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
  );
  const transaction = new bitcore.Transaction();
  let totalAmountAvailable = 0;

  let inputs = [];
  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  });

  const transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
  // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

  fee = transactionSize;
  if (totalAmountAvailable - satoshiToSend - fee < 0) {
    throw new Error('Balance is too low for this transaction');
  }

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee * 20);

  // Sign transaction with your private key
  transaction.sign(privateKey);

  // serialize Transactions
  const serializedTransaction = transaction.serialize();
  // Send transaction
  const result = await axios({
    method: 'POST',
    url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
    data: {
      tx_hex: serializedTransaction
    }
  });
  return result.data.data;
};

sendBitcoin('13qKjEmrrBs89Sg8ZFSdHvmU1YFUjgTk3f', 0.000005);
