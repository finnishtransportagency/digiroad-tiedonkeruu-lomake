import { createTransport } from 'nodemailer'
import { ACCEPTED_FILE_TYPES, Report } from '../../schema'
import ssmService from '../ssmService'
import t from '../../translations'
import template from './template'
import { emailRecipient, emailSender, offline, smtpEndpoint, stage } from '../../config'

type EmailOptions = {
	from: string
	to: string
	subject: string
	text: string
	html: string
	attachments?: Array<{
		filename: string
		contentType?: (typeof ACCEPTED_FILE_TYPES)[number]
		content: Buffer
	}>
}

const constructEmail = (report: Report): EmailOptions => {
	const translations = t(report.lang)
	const emailContents = template.renderEmailContents(report, translations)

	const emailOptions: EmailOptions = {
		from: emailSender,
		to: emailRecipient,
		subject: `${stage === 'dev' || stage === 'test' ? 'TEST EMAIL!!! ' : translations.title}: ${
			report.project
		}, ${report.municipality}`,
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
	const emailOptions = constructEmail(report)

	if (offline) {
		console.log(
			`EMAIL:\nSender: ${emailOptions.from}\nRecipient: ${emailOptions.to}\nSubject: ${emailOptions.subject}\nCONTENT:\n${emailOptions.text}\n`,
		)
		return new Promise(resolve =>
			setTimeout(() => resolve('Offline mode, not sending email'), 1000),
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

	const sentMessageInfo = await transporter.sendMail(emailOptions)
	return sentMessageInfo.response
}

export default { sendEmail }
