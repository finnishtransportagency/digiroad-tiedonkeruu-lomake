import { createTransport } from 'nodemailer'
import ssmService from './ssmService'

const sendEmail = async () => {
  const SMTP_credentials = await ssmService.getSMTPCredentials()

  const transporter = createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    auth: {
      user: SMTP_credentials.username,
      pass: SMTP_credentials.password,
    },
  })

  console.log('Transporter created')

  transporter.verify((error, _success) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })
}

export default { sendEmail }
