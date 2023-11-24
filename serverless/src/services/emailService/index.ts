import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { ACCEPTED_FILE_TYPES, Report } from '../../schema'
import ssmService from '../ssmService'
import t from '../../translations'
import template from './template'
import { emailSender, offline, smtpEndpoint } from '../../config'

type EmailOptions = Mail.Options & {
  attachments?: Array<{
    filename: string
    contentType: (typeof ACCEPTED_FILE_TYPES)[number]
    content: Buffer
  }>
}

const constructEmail = (report: Report) => {
  const translations = t(report.lang)
  const emailContents = template.renderEmailContents(report, translations)

  const emailOptions: EmailOptions = {
    from: emailSender,
    to: report.email,
    subject: `${translations.title}: ${report.project}, ${report.municipality}`,
    text: emailContents.text,
    html: emailContents.html,
  }

  if (report.files.length > 0) {
    emailOptions.attachments = report.files.map(file => ({
      filename: file.filename,
      contentType: file.contentType,
      content: file.content,
    }))
  }

  return emailOptions
}

const sendEmail = async (report: Report): Promise<string> => {
  if (offline) {
    return new Promise(resolve =>
      setTimeout(() => resolve('Offline mode, not sending email'), 1000)
    )
  }

  const SMTP_credentials = await ssmService.getSMTPCredentials()

  const transporter = createTransport({
    host: smtpEndpoint,
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
