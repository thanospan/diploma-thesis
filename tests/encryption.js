'use strict';

require('dotenv').config({ path: './config/.env' });

const { decrypt } = require('../utils/encryption');

const encryptedSurname = "f53fd1067d8d2fa2e6e24806d6614370:2101cc277f7df6c9ef278dcf73ecd383bee3ca310b611eed8abe1f3196c06911";
const decryptedSurname = decrypt(encryptedSurname, process.env.MONGOOSE_ENCRYPTION_KEY);

console.log(decryptedSurname);
