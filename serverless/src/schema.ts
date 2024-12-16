import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from './translations'
import { AttachmentArray, PresignReq, Report } from './types'

/**
 * Amazon SES supports emails with a message size of up to 40MB.
 * Backend has a limit of 35MB to allow for other data in the request.
 */
export const MAX_TOTAL_FILE_SIZE = 28_311_552 // 27 * 1024 * 1024 bytes
export const ACCEPTED_FILE_TYPES = [
	// Remember to update frontend also if you change these values
	'.pdf',
	'.dgn',
	'.dwg',
	'.dxf',
	'.gpkg',
	'application/pdf',
	'application/acad',
	'application/x-acad',
	'application/dgn',
	'image/vnd.dgn',
	'application/autocad.dwg',
	'application/dwg',
	'application/x-invisox',
	'image/dwg',
	'image/vnd.dwg',
	'image/x-dwg',
	'vector/x-dwg',
	'application/autocad.dxf',
	'application/dxf',
	'application/x-handydxf',
	'application/x-invisox',
	'dxf/dxf',
	'image/dxf',
	'image/vnd.dxf',
	'image/x-dxf',
	'application/x-sqlite3', // To allow geopackages
] as [string, ...string[]]

export const filesSchema = z
	.array(
		z.object({
			filename: z
				.string()
				.refine(filename => ACCEPTED_FILE_TYPES.includes(`.${filename.split('.').pop()}`), {
					message: 'Invalid file extension',
				}),
			contentType: z.string().optional(),
			content: z.instanceof(Buffer),
			encoding: z.string().optional(),
		})
	)
	.refine(
		files =>
			files.reduce((totalSize: number, file) => {
				return totalSize + file.content.length
			}, 0) <= MAX_TOTAL_FILE_SIZE,
		`File size too large`
	)

/**
 * Validate the input object against the files schema.
 * If the total size of the files is too large, throws an error.
 */
const validateFiles = (input: object): AttachmentArray => {
	const safeParseResult = filesSchema.safeParse(input)
	if (safeParseResult.success) return safeParseResult.data
	throw safeParseResult.error
}

// ------------------------------------------------------------

export const reportSchema = z.object({
	report_id: z.string().uuid(),
	lang: z.enum(SUPPORTED_LANGUAGES),
	reporter: z
		.string({ required_error: 'Missing reporter' })
		.max(64, { message: 'Reporter too long' }),
	email: z
		.string({ required_error: 'Missing email' })
		.email({ message: 'Invalid email' })
		.max(320, { message: 'Email too long' }),
	project: z.string({ required_error: 'Missing project' }).max(64, { message: 'Project too long' }),
	municipality: z
		.string({ required_error: 'Missing municipality' })
		.max(32, { message: 'Municipality too long' }),
	opening_date: z
		.string({ required_error: 'Missing opening date' })
		.transform(value => new Date(value)),
	description: z.string().optional(),
	attachment_names: z.preprocess(value => {
		if (typeof value === 'string') return JSON.parse(value)
		return value
	}, z.array(z.string()).max(5).default([])),
})

/**
 * Validate the input object against the report schema.
 * If the lang field is missing or invalid, sets it to the first supported language.
 * If there are other missing fields, throws an error.
 */
const validateReport = (input: unknown): Report => {
	if (typeof input !== 'object') throw new Error('Invalid input in validateReport')
	const safeParseResult = reportSchema.safeParse(input)
	if (safeParseResult.success) return safeParseResult.data
	if (safeParseResult.error.issues.filter(issue => issue.path[0] === 'lang').length > 0)
		return reportSchema.parse({ ...input, lang: SUPPORTED_LANGUAGES[0] })
	throw safeParseResult.error
}

// ------------------------------------------------------------

export const presignReqSchema = z.object({
	reportId: z.string(),
	fileName: z.string(), // TODO: Add a regex to validate the filename (starts with attachment/<uuid>/)
	// contentType: z.string(),
	// TODO: Add MD5 hash for more security
})

/**
 * Validate the input object against the presign request schema.
 * If there are missing fields, throws an error.
 */
const validatePresign = (input: object): PresignReq => {
	const safeParseResult = presignReqSchema.safeParse(input)
	if (safeParseResult.success) return safeParseResult.data
	throw safeParseResult.error
}

export default { validateReport, validatePresign, validateFiles }
