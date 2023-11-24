import { v4 as uuidv4 } from 'uuid'
import { virusScanBucket } from '../config'
import { Report } from '../schema'
import s3Service from './s3Service'

const sendToVirusScan = async (report: Report) => {
  const reportId = uuidv4()
  const files = report.files.map(file => ({ ...file, filename: `${reportId}_${file.filename}` }))
  const reportJSON = { ...report, files: files.map(file => ({ filename: file.filename })) }

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

export default { sendToVirusScan }
