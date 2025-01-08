const crypto = require('crypto');

exports.encrypt = (plainText, workingKey) => {
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(workingKey, 'hex'), initVector);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
exports.decrypt = (encryptedText, workingKey) => {
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(workingKey, 'hex'), initVector);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption Error:', error.message);
    throw new Error('Decryption failed. Verify input and working key.');
  }
};
