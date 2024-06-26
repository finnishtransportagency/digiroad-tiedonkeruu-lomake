import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from './translations'

/**
 * Amazon SES supports emails with a message size of up to 40MB but
 * lambda function has a limit of 6MB for the invocation payload.
 * Backend has a limit of 35MB incase the invocation payload somehow
 * contains file larger than 6MB.
 */
const MAX_TOTAL_FILE_SIZE = 35_000_000
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
// ^----------------------------------------------------------^

const schema = z.object({
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
	files: z
		.array(
			z.object({
				filename: z
					.string()
					.refine(filename => ACCEPTED_FILE_TYPES.includes(`.${filename.split('.').pop()}` ?? ''), {
						message: 'Invalid file extension',
					}),
				contentType: z.string().optional(),
				content: z.instanceof(Buffer),
				encoding: z.string(),
			}),
		)
		.refine(
			files =>
				files.reduce((totalSize: number, file) => {
					return totalSize + file.content.length
				}, 0) <= MAX_TOTAL_FILE_SIZE,
			`File size too large`,
		),
	description: z.string().optional(),
})

export type Report = z.infer<typeof schema>
export type ReportJSON = Omit<Report, 'files'> & { files: string[] }

const validate = (input: Object): Report => {
	const safeParseResult = schema.safeParse(input)
	if (safeParseResult.success) return safeParseResult.data
	if (safeParseResult.error.issues.filter(issue => issue.path[0] === 'lang').length > 0)
		return schema.parse({ ...input, lang: SUPPORTED_LANGUAGES[0] })
	throw safeParseResult.error
}

export default { validate }
