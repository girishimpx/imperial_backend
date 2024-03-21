const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey('BKOqKWPTQOihtQ3qQUgcSw');


/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
  const auth = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // service: "sendinblue",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  }
  //const transporter = nodemailer.createTransport(mg(auth))
  const transporter = nodemailer.createTransport(auth)
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  }
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err,"email error")
      return callback(false)
    }
    // console.log(done,"email done")
    return callback(true)
  })
}

module.exports = { sendEmail }
