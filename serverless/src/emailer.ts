import nodemailer from 'nodemailer'
import ssmService from './ssmService'

const sendEmail = async () => {
  const SMTP_credentials = await ssmService.getSMTPCredentials()

  const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_ENDPOINT,
    port: 465,
    secure: true,
    auth: {
      user: SMTP_credentials.username,
      pass: SMTP_credentials.password,
    },
  })

  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })
}

export default { sendEmail }
