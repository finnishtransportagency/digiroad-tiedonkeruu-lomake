import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { ACCEPTED_FILE_TYPES, Report } from './schema'
import ssmService from './ssmService'
import t from './translations'

type EmailContent = Mail.Options & {
  attachments?: Array<{
    filename: string
    contentType: (typeof ACCEPTED_FILE_TYPES)[number]
    content: Buffer
  }>
}

const constructEmail = (report: Report) => {
  const translations = t(report.lang)

  const emailContent: EmailContent = {
    from: process.env.SMTP_SENDER ?? '',
    to: report.email,
    subject: `${translations.title}: ${report.project}, ${report.municipality}`,
    text: `${translations.title}
    ${translations.reporter}: ${report.reporter}
    ${translations.email}: ${report.email}
    ${translations.project}: ${report.project}
    ${translations.municipality}: ${report.municipality}
    ${translations.opening_date}: ${report.opening_date.toLocaleDateString(report.lang)}`,
    html: `<div>
    <h1>${translations.title}</h1>
    <p>${translations.reporter}: ${report.reporter}</p>
    <p>${translations.email}: ${report.email}</p>
    <p>${translations.project}: ${report.project}</p>
    <p>${translations.municipality}: ${report.municipality}</p>
    <p>${translations.opening_date}: ${report.opening_date.toLocaleDateString(report.lang)}</p>
    </div>`.replace(/\n/g, '<br>'),
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
