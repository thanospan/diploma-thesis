'use strict';

require('dotenv').config({ path: './config/.env' });

const crypto = require('crypto');

const { encrypt, decrypt } = require('../utils/crypto');

const key = process.env.ENCRYPTION_KEY;
// OR
// const key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_PASS)).digest('hex').substr(0, 32);

const plaintext = 'Παπαδόπουλος';

const encryptedSurname = encrypt(plaintext, key);
// OR
// const encryptedSurname = "f53fd1067d8d2fa2e6e24806d6614370:2101cc277f7df6c9ef278dcf73ecd383bee3ca310b611eed8abe1f3196c06911"; // Παπαδόπουλος

const decryptedSurname = decrypt(encryptedSurname, key);

console.log('Plaintext: ' + plaintext);
console.log('Encrypted: ' + encryptedSurname);
console.log('Decrypted: ' + decryptedSurname);
