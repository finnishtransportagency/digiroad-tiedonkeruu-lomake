import { S3Event } from 'aws-lambda'
import reportService from './services/reportService'
import emailService from './services/emailService'

export const handler = async (event: S3Event) => {
  console.log('Email lamda triggered by:\n', event.Records[0].s3.object.key)

  const scannedReport = await reportService.getScannedReport(event.Records[0].s3)

  switch (scannedReport.status) {
    case 'notFound':
      console.error('Report not found')
      break

    case 'notScanned':
      console.info('Report not yet scanned')
      break

    case 'scanned':
      console.info('Sending report email...')
      const response = await emailService.sendEmail(scannedReport.report)
      console.log('SMTP response:\n' + response)
      break
  }
}
