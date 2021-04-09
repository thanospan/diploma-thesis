const crypto = require('crypto');

const decrypt = function (encryptedHex, secret) {
  secret = crypto.createHash('sha256').update(String(secret)).digest('hex').substr(0, 32);
  const encryptedArray = encryptedHex.split(":");
  const algorithm = "aes-256-cbc";
  const iv = new Buffer.from(encryptedArray[0], "hex");
  const encrypted = new Buffer.from(encryptedArray[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  const decrypted = decipher.update(encrypted);
  const clearText = Buffer.concat([decrypted, decipher.final()]).toString();

  return clearText;
};

module.exports = {
  decrypt
};
