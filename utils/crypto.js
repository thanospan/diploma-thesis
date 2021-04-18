const crypto = require('crypto');

const encrypt = (plaintext, key) => {
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(plaintext, 'utf8', 'hex') + cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (data, key) => {
  const algorithm = "aes-256-cbc";
  const iv = Buffer.from(data.split(":")[0], "hex");
  const encrypted = Buffer.from(data.split(":")[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};
