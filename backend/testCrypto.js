const { encrypt, decrypt } = require('./utils/crypto');

const workingKey = 'D2FB5AD5FB33D007835756256959B90B';
const testData = 'merchant_id=3041682&order_id=645783657&amount=10000';

const encryptedData = encrypt(testData, workingKey);
console.log('Encrypted:', encryptedData);

const decryptedData = decrypt(encryptedData, workingKey);
console.log('Decrypted:', decryptedData);
