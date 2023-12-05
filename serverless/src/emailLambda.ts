import { S3Event } from 'aws-lambda'
import reportService from './services/reportService'

export const handler = async (event: S3Event) => {
  console.log('Email lamda triggered:\n', event)

  const record = event.Records[0]
  console.log('S3EventRecord s3:\n', record.s3)
  const scannedReport = await reportService.getScannedReport(record.s3)
  console.log('Scanned report:\n', scannedReport)
  // TODO
}
