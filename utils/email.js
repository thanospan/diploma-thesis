'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST,
  port: process.env.MAILHOG_SMTP_PORT
});

const sendMail = async (mailOptions) => {
  const response = await transporter.sendMail(mailOptions);

  return response;
};

exports.sendVerificationEmail = async (userId, emailToken, emailAddress) => {
  const mailOptions = {
    from: 'no-reply@safeamea.gr',
    to: emailAddress,
    subject: 'Verify email address',
    text: `Please click on the following link to verify your email address: http://masked-api-frontend/email-verification?userId=${userId}&emailToken=${emailToken}`
  };
  const response = await sendMail(mailOptions);

  return response;
};
