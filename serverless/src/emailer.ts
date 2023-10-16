import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { ACCEPTED_FILE_TYPES, Report } from './schema'
import ssmService from './ssmService'

type EmailContent = Mail.Options & {
  attachments?: Array<{
    filename: string
    contentType: (typeof ACCEPTED_FILE_TYPES)[number]
    content: Buffer
  }>
}

const constructEmail = (report: Report) => {
  const emailContent: EmailContent = {
    from: process.env.SMTP_SENDER ?? '',
    to: report.email,
    subject: 'TEST EMAIL',
    text: `Hello Email World from AWS Lambda!`,
    html: '<b>Hello Email World from AWS Lambda!</b>',
  }

  if (report.files.length > 0) {
    emailContent.attachments = report.files.map(file => ({
      filename: file.filename,
      contentType: file.contentType,
      content: file.content,
    }))
  }

  return emailContent
}

const sendEmail = async (report: Report) => {
  const SMTP_credentials = await ssmService.getSMTPCredentials()

  const transporter = createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    auth: {
      user: SMTP_credentials.username,
      pass: SMTP_credentials.password,
    },
  })

  const sentMessageInfo = await transporter.sendMail(constructEmail(report))
  return sentMessageInfo.response
}

export default { sendEmail }
