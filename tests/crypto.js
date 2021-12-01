'use strict';

require('dotenv').config({ path: './config/.env' });

const crypto = require('crypto');

const { encrypt, decrypt } = require('../utils/crypto');

const pass = process.env.ENCRYPTION_PASS;

const key = process.env.ENCRYPTION_KEY;
// OR
// const key = crypto.createHash('sha256').update(String(pass)).digest('hex').substr(0, 32);

const plaintext = 'Papadopoulos';

const encryptedSurname = encrypt(plaintext, key);
// OR
// const encryptedSurname = "258c2440a3d90d990bec0d3470c11326:bd96338b9bd9595fa982e35e2d38729d"; // Papadopoulos

const decryptedSurname = decrypt(encryptedSurname, key);

console.log('Plaintext: ' + plaintext);
console.log('Encrypted: ' + encryptedSurname);
console.log('Decrypted: ' + decryptedSurname);
