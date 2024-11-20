import { createTransport } from 'nodemailer'
import ssmService from '../ssmService'
import t from '../../translations'
import template from './template'
import { emailRecipient, emailSender, offline, smtpEndpoint, stage } from '../../config'
import { AttachmentArray, EmailOptions, Report, ScannedReport } from '../../types'

const constructEmail = (report: Report, files: AttachmentArray): EmailOptions => {
	const translations = t(report.lang)
	const emailContents = template.renderEmailContents(report, translations)

	const emailOptions: EmailOptions = {
		from: emailSender,
		to: emailRecipient,
		subject: `${stage === 'dev' || stage === 'test' ? 'TEST EMAIL!!! ' : ''}${
			translations.title
		}: ${report.project}, ${report.municipality}`,
		text: emailContents.text,
		html: emailContents.html,
	}

	if (files.length > 0) {
		emailOptions.attachments = files
	}

	return emailOptions
}

const sendEmail = async (scannedReport: ScannedReport): Promise<string> => {
	const emailOptions = constructEmail(scannedReport.report, scannedReport.attachments)

	if (offline) {
		console.log(
			`EMAIL:\nSender: ${emailOptions.from}\nRecipient: ${emailOptions.to}\nSubject: ${emailOptions.subject}\nCONTENT:\n${emailOptions.text}\n`
		)
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

	const sentMessageInfo = await transporter.sendMail(emailOptions)
	return sentMessageInfo.response
}

export default { sendEmail }
