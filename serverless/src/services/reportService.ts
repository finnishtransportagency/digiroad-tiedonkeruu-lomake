import { v4 as uuidv4 } from 'uuid'
import { offline, virusScanBucket } from '../config'
import schema, { Report, ReportJSON } from '../schema'
import s3Service from './s3Service'
import { S3EventRecord } from 'aws-lambda'

interface ScannedReport {
	status: 'scanned'
	report: Report
}

interface NotScannedReport {
	status: 'notScanned'
}

interface NotFoundReport {
	status: 'notFound'
}

type ScannedReportResult = ScannedReport | NotScannedReport | NotFoundReport

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
			file.contentType || '',
			file.content,
			file.encoding,
			reportId
		)
	}

	return reportId
}

/**
 * Pop report details and scanned attachment files from virus scan bucket.
 *
 * @returns Object with scan status and report if scanned
 * @example { status: 'notFound' }
 * @example { status: 'notScanned' }
 * @example { status: 'scanned', report: Report }
 */
const getScannedReport = async (s3Details: S3EventRecord['s3']): Promise<ScannedReportResult> => {
	const reportId = s3Details.object.key.split('_')[0]
	let reportJSON: ReportJSON | null = null
	try {
		reportJSON = await s3Service.getReportJSON(virusScanBucket, `${reportId}_report.json`)
	} catch (error) {
		console.error('Error while getting report JSON: ', error)
	}

	if (!reportJSON) return { status: 'notFound' }

	if (reportJSON.files.length === 0) {
		await deleteReport(reportId, [])
		return { report: schema.validate(reportJSON), status: 'scanned' }
	}

	const notScannedFileNames: string[] = []
	const infectedFileNames: string[] = []
	const cleanFileNames: string[] = []

	for (const fileName of reportJSON.files) {
		const fileTags = offline
			? s3Service.simulateGetTags(reportJSON) // For local testing
			: await s3Service.getTags(virusScanBucket, fileName)
		const virusscan = fileTags.find(tag => tag.Key === 'viruscan')
		if (!virusscan) {
			notScannedFileNames.push(fileName)
			continue
		}
		if (virusscan.Value === 'virus') infectedFileNames.push(fileName)
		if (virusscan.Value === 'clean') cleanFileNames.push(fileName)
	}

	if (notScannedFileNames.length > 0) return { status: 'notScanned' }

	if (infectedFileNames.length > 0) {
		console.warn('Deleting infected files:\n', infectedFileNames)
		await deleteFiles(infectedFileNames)
	} else {
		console.info('Files scanned: no infected files')
	}

	const cleanFiles: Report['files'] = []
	for (const fileName of cleanFileNames) {
		const file = await s3Service.getFile(virusScanBucket, fileName)
		if (file) cleanFiles.push(file)
	}

	const parsedReport = schema.validate({ ...reportJSON, files: cleanFiles })

	await deleteReport(reportId, reportJSON.files)

	return { status: 'scanned', report: parsedReport }
}

const deleteReport = async (reportId: string, filenames: string[]) => {
	await s3Service.deleteObject(virusScanBucket, `${reportId}_report.json`)
	deleteFiles(filenames)
}

const deleteFiles = async (filenames: string[]) => {
	for (const filename of filenames) {
		await s3Service.deleteObject(virusScanBucket, filename)
	}
}

export default { sendToVirusScan, getScannedReport }
