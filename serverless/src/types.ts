import { z } from 'zod'
import { ACCEPTED_FILE_TYPES, filesSchema, presignReqSchema, reportSchema } from './schema'

export type PresignReq = z.infer<typeof presignReqSchema>

export type Report = z.infer<typeof reportSchema>

export type AttachmentArray = z.infer<typeof filesSchema>
export type Attachment = AttachmentArray[number]

export interface ScannedReport {
	status: 'scanned'
	report: Report
	attachments: AttachmentArray
	retrys: number
}

interface NotScannedReport {
	status: 'notScanned'
	retrys: number
}

interface NotFoundReport {
	status: 'notFound'
}

export type ScannedReportResult = ScannedReport | NotScannedReport | NotFoundReport

export interface EmailOptions {
	from: string
	to: string
	subject: string
	text: string
	html: string
	attachments?: {
		filename: string
		contentType?: (typeof ACCEPTED_FILE_TYPES)[number]
		content: Buffer
		encoding?: string
	}[]
}

