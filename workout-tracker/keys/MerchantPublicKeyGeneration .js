var bitcore = require('bitcore');
var merchantPrivatekeys = require('./MerchantPrivateKeys');
var merchantPublickeys = require('./MerchantPublicKeys');
var merchantAddresskeys = require('./MerchantAddressKeys');

var PrivateKey = bitcore.PrivateKey;
var Address = bitcore.Address;
var Networks = bitcore.Networks;

function generatePublicKeyAndAddress(name, value) {

	for(var i = 1; i <= 4; i++){
		var merchant1PrivateKeyWIF = merchantPrivatekeys.merchant1; // 
		var merchant1PrivateKey = PrivateKey.fromWIF(merchant1PrivateKeyWIF);
		var merchant1publicKey = merchant1PrivateKey.toPublicKey();
		var merchant1Address = merchant1publicKey.toAddress(Networks.testnet);
		merchantAddresskeys.define("merchant1PublicKey", merchant1Address);
		merchantPublickeys.define("merchant1Address", merchant1PublicKey);
	}

}

var merchant1PrivateKeyWIF = merchantPrivatekeys.merchant1WIF; // 
var merchant1PrivateKey = PrivateKey.fromWIF(merchant1PrivateKeyWIF);
var merchant1publicKey = merchant1PrivateKey.toPublicKey();
var merchant1Address = merchant1publicKey.toAddress(Networks.testnet);
console.log('Address = ', merchant2Address);
merchantPublickeys.define("merchant1Address", merchant1Address);
merchantPublickeys.define("merchant1PublicKey", merchant1PublicKey);	

var merchant2PrivateKeyWIF = merchantPrivatekeys.merchant2WIF; // 
var merchant2PrivateKey = PrivateKey.fromWIF(merchant3PrivateKeyWIF);
var merchant2publicKey = merchant2PrivateKey.toPublicKey();
var merchant2Address = merchant2publicKey.toAddress(Networks.testnet);
console.log('Address = ', merchant2Address);

var merchant3PrivateKeyWIF = merchantPrivatekeys.merchant3WIF; // 
var merchant3PrivateKey = PrivateKey.fromWIF(merchant3PrivateKeyWIF);
var merchant3publicKey = merchant3PrivateKey.toPublicKey();
var merchant3Address = merchant3publicKey.toAddress(Networks.testnet);
console.log('Address = ', merchant3Address);

var merchant4PrivateKeyWIF = merchantPrivatekeys.merchant1WIF; // 
var merchant4PrivateKey = PrivateKey.fromWIF(merchant4PrivateKeyWIF);
var merchant4publicKey = merchant4PrivateKey.toPublicKey();
var merchant4Address = merchant4publicKey.toAddress(Networks.testnet);
console.log('Address = ', merchant4ddress);
