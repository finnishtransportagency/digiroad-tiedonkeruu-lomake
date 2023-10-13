import { createTransport } from 'nodemailer'
import ssmService from './ssmService'
import { Report } from './validator'

const sendEmail = async (info: Report) => {
  const SMTP_credentials = await ssmService.getSMTPCredentials()

  const transporter = createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    auth: {
      user: SMTP_credentials.username,
      pass: SMTP_credentials.password,
    },
  })

  const mailContent = {
    from: process.env.SMTP_SENDER,
    to: info.email,
    subject: 'TEST EMAIL',
    text: 'Hello Email World from AWS Lambda!',
    html: '<b>Hello Email World from AWS Lambda!</b>',
  }

  const sentMessageInfo = await transporter.sendMail(mailContent)
  console.log('SMTP response: ', sentMessageInfo.response)
}

export default { sendEmail }
