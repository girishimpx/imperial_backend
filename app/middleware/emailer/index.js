const { emailExists, gemailExists } = require('./emailExists')
const { emailExistsExcludingMyself } = require('./emailExistsExcludingMyself')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { sendEmail } = require('./sendEmail')
const {
  sendRegistrationEmailMessage, WithDrawOtpEmail, KycStatus
} = require('./sendRegistrationEmailMessage')
const {
  sendResetPasswordEmailMessage
} = require('./sendResetPasswordEmailMessage')

module.exports = {
  emailExists,
  gemailExists,
  emailExistsExcludingMyself,
  prepareToSendEmail,
  sendEmail,
  WithDrawOtpEmail,
  KycStatus,
  sendRegistrationEmailMessage,
  sendResetPasswordEmailMessage
}
