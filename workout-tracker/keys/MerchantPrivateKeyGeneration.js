var bitcore = require('bitcore');
var Transaction = bitcore.Transaction;
var PrivateKey = bitcore.PrivateKey;
var Address = bitcore.Address;
var Script = bitcore.Script;
var Networks = bitcore.Networks;
var Signature = bitcore.crypto.Signature;

// Create private Key
var merchantPrivateKey = new PrivateKey(Networks.testnet);
// encode into wallet export format
var exported = merchantPrivateKey.toWIF();

  console.log(" Merchant Private Key = ", merchantPrivateKey);
  console.log(" Merchant Private key encoded in WIF Format = ", exported);
  
  
