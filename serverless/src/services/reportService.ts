import { v4 as uuidv4 } from 'uuid'
import { virusScanBucket } from '../config'
import schema, { Report, ReportJSON } from '../schema'
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
  const reportJSON: ReportJSON = { ...report, files: files.map(file => file.filename) }

  // Upload report
  await s3Service.putObject(
    virusScanBucket,
    `${reportId}_report.json`,
    'application/json',
    Buffer.from(JSON.stringify(reportJSON)),
    'utf-8',
    reportId
  )

  // Upload files
  for (const file of files) {
    await s3Service.putObject(
      virusScanBucket,
      file.filename,
      file.contentType,
      file.content,
      file.encoding,
      reportId
    )
  }

  return reportId
}

/**
 * Get report details and scanned attachment files from virus scan bucket.
 *
 * @returns parsed report | null if all files are not scanned or report is not found
 */
const getScannedReport = async (s3Details: S3EventRecord['s3']): Promise<Report | null> => {
  const reportJSON = await s3Service.getReportJSON(
    virusScanBucket,
    `${s3Details.object.key.split('_')[0]}_report.json`
  )

  if (!reportJSON) return null
  if (reportJSON.files.length === 0) return schema.validate(reportJSON)

  const cleanFileNames: string[] = []
  const infectedFileNames: string[] = []

  for (const fileName of reportJSON.files) {
    const fileTags = await s3Service.getTags(virusScanBucket, fileName)
    const virusscan = fileTags.find(tag => tag.Key === 'virusscan')

    if (!virusscan) return null
    if (virusscan.Value === 'clean') cleanFileNames.push(fileName)
    if (virusscan.Value === 'virus') infectedFileNames.push(fileName)
  }

  infectedFileNames.length > 0
    ? console.error('Infected files:\n', infectedFileNames)
    : console.log('No infected files')

  const cleanFiles: Report['files'] = []
  for (const fileName of cleanFileNames) {
    const file = await s3Service.getFile(virusScanBucket, fileName)
    if (file) cleanFiles.push(file)
  }

  return schema.validate({ ...reportJSON, files: cleanFiles })
}

export default { sendToVirusScan, getScannedReport }
