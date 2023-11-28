import { v4 as uuidv4 } from 'uuid'
import { virusScanBucket } from '../config'
import { Report } from '../schema'
import s3Service from './s3Service'
import { S3EventRecord } from 'aws-lambda'

/**
 * Send report details as json to virus scan bucket.
 * Add report id as prefix to all filenames and upload to virus scan bucket.
 *
 * @example
 * a26896ec-3693-4687-bc62-42e6e46b19f3_report.json
 * a26896ec-3693-4687-bc62-42e6e46b19f3_originalFilename.pdf
 *
 * @returns report id
 */
const sendToVirusScan = async (report: Report): Promise<string> => {
  const reportId = uuidv4()
  const files = report.files.map(file => ({ ...file, filename: `${reportId}_${file.filename}` }))
  const reportJSON = { ...report, files: files.map(file => file.filename) }

  // Upload report
  await s3Service.putObject(
    virusScanBucket,
    `${reportId}_report.json`,
    Buffer.from(JSON.stringify(reportJSON)),
    { reportId, 'file-count': `${files.length}` }
  )

  // Upload files
  for (const file of files) {
    await s3Service.putObject(virusScanBucket, file.filename, file.content, {
      reportId,
    })
  }

  return reportId
}

/**
 * Get report details and scanned attachment files from virus scan bucket.
 *
 * @returns parsed report | null if all files are not scanned or report is not found
 */
const getScannedReport = async (s3Details: S3EventRecord['s3']): Promise<Report | null> => {
  const getReportResponse = await s3Service.getObject(
    virusScanBucket,
    `${s3Details.object.key.split('_')[0]}_report.json`
  )
  if (!getReportResponse) return null
  const reportDetails = await getReportResponse?.transformToString()
  console.log('Report details:\n', reportDetails)
  return null
}

export default { sendToVirusScan, getScannedReport }
