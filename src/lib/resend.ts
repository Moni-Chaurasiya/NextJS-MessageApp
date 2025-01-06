// import {Resend} from 'resend'

// export const resend = new Resend(process.env.RESEND_API_KEY);

const nodemailer = require('nodemailer');
require('dotenv').config();

export const transportor = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// module.exports = transportor;


/**
 * SendGrid:
 *  Mailgun:
 * Nexmo (Vonage API):
 * Amazon SES (Simple Email Service):
 * EmailJS:
 * Mailtrap
 *  SendGrid
 * Brevo (formerly Sendinblue)
 * Postmark
 * EmailJS
 * Gmail SMTP
 * . Yahoo Mail SMTP
 * 
 */