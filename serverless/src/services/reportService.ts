import { offline, virusScanBucket, attachmentRetryConfig } from '../config'
import schema from '../schema'
import { AttachmentArray, Report, ScannedReportResult } from '../types'
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
const saveReport = async (report: Report): Promise<string> => {
	const reportId = report.report_id
	await s3Service.putObject(
		virusScanBucket,
		`reports/${reportId}.json`,
		'application/json',
		Buffer.from(JSON.stringify(report, null, 2), 'utf-8'),
		'utf-8',
		reportId
	)
	return reportId
}

/**
 * Pop report details and scanned attachment files from virus scan bucket.
 *
 * @returns Object with scan status and report if scanned
 * @example { status: 'notFound' }
 * @example { status: 'notScanned', retrys: 0 }
 * @example { status: 'scanned', report: Report, attachments: AttachmentArray, retrys: 0 }
 */
const getScannedReport = async (s3Details: S3EventRecord['s3']): Promise<ScannedReportResult> => {
	// Example key: reports/a26896ec-3693-4687-bc62-42e6e46b19f3.json
	const reportId = (s3Details.object.key.match(
		// returns [<original string>, <first group>, <second group>, ...]
		/^reports\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).json$/
	) ?? [null, null])[1]
	if (!reportId) {
		console.error('Report id not found in key: ', s3Details.object.key)
		return { status: 'notFound' }
	}
	let reportJSON: Report | null = null
	try {
		console.info('Getting report: ', reportId)
		reportJSON = schema.validateReport(
			await s3Service.getReportJSON(virusScanBucket, `reports/${reportId}.json`)
		)
	} catch (error) {
		console.error('Error while getting report JSON: ', error)
	}

	if (!reportJSON) return { status: 'notFound' }

	if (reportJSON.attachment_names.length === 0) {
		//await deleteReport(reportId, [])
		return {
			report: reportJSON,
			status: 'scanned',
			attachments: [],
			retrys: 0,
		}
	}

	const scannedAttachments = await checkAttachments(reportId, reportJSON.attachment_names)
	if (scannedAttachments.notScannedAttachmentNames.length > 0) {
		console.error(
			`File scans not completed after ${attachmentRetryConfig.retryLimit} retries with ${
				attachmentRetryConfig.retryInterval / 1000
			}sec intervals:\n`,
			scannedAttachments.notScannedAttachmentNames
		)
		return { status: 'notScanned', retrys: scannedAttachments.retrys }
	}

	if (scannedAttachments.infectedFileNames.length > 0) {
		console.warn('Deleting infected files:\n', scannedAttachments.infectedFileNames)
		await deleteFiles(scannedAttachments.infectedFileNames)
	} else {
		console.info(`${scannedAttachments.cleanFileNames.length} file(s) scanned: no infected files`)
	}

	const cleanFiles: AttachmentArray = []
	for (const fileName of scannedAttachments.cleanFileNames) {
		const file = await s3Service.getFile(virusScanBucket, fileName)
		if (file) cleanFiles.push(file)
	}
	schema.validateFiles(cleanFiles)

	//await deleteReport(reportId, scannedAttachments.cleanFileNames)
	return {
		status: 'scanned',
		report: reportJSON,
		attachments: cleanFiles,
		retrys: scannedAttachments.retrys,
	}
}

/**
 * Check if attachments are scanned and get clean attachments.
 *
 * @param reportId Report id
 * @param attachment_names Array of attachment filenames
 * @returns Object with names of infected files, clean files, files not scanned after 30 retries and number of retries
 */
const checkAttachments = async (reportId: string, attachment_names: string[]) => {
	const infectedFileNames: string[] = []
	const cleanFileNames: string[] = []
	let retrys = 0
	do {
		for (const attachmentName of attachment_names) {
			const fileName = `attachments/${reportId}/${attachmentName}`
			const fileTags = offline
				? s3Service.simulateGetTags() // For local testing
				: await s3Service.getTags(virusScanBucket, fileName)
			console.info(`${fileName} tags: `, fileTags)
			const virusscan = fileTags.find(tag => tag.Key === 'viruscan')
			if (!virusscan) continue
			if (virusscan.Value === 'virus') {
				infectedFileNames.push(fileName)
				attachment_names = attachment_names.filter(name => name !== attachmentName)
				continue
			}
			if (virusscan.Value === 'clean') {
				cleanFileNames.push(fileName)
				attachment_names = attachment_names.filter(name => name !== attachmentName)
				continue
			}
		}
		if (attachment_names.length > 0) {
			console.info('Waiting for virusscan lambda...')
			// Wait before retrying
			await new Promise(resolve => {
				retrys++
				console.info(`Retry number: ${retrys}`)
				setTimeout(resolve, attachmentRetryConfig.retryInterval)
			})
		}
	} while (attachment_names.length > 0 && retrys < attachmentRetryConfig.retryLimit)
	return { infectedFileNames, cleanFileNames, notScannedAttachmentNames: attachment_names, retrys }
}

const deleteReport = async (reportId: string, filenames: string[]) => {
	await s3Service.deleteObject(virusScanBucket, `reports/${reportId}.json`)
	deleteFiles(filenames)
}

const deleteFiles = async (filenames: string[]) => {
	for (const filename of filenames) {
		await s3Service.deleteObject(virusScanBucket, filename)
	}
}

export default { saveReport, getScannedReport }
