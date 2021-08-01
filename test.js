const CryptoAccount = require('send-crypto');
const await = require('await');

const privateKey =
  'cb3466d5a5985d327d38211b65a4c23be4a7d80950f217ff426ca3ee9f8d6f3c';

const account = new CryptoAccount(privateKey);

console.log(account);
