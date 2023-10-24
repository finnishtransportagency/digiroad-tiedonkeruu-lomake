import { z } from 'zod'

// Remember to update error messages if you change these values
const MAX_FILE_SIZE = 39_000_000 // Amazon SES now supports emails with a message size of up to 40MB
export const ACCEPTED_FILE_TYPES = [
	'application/pdf',
	'application/acad',
	'image/vnd.dwg',
	'image/x-dwg',
	'application/dxf',
	'image/vnd.dxf',
	'image/vnd.dgn',
]
// ^----------------------------------------------------------^

const schema = z.object({
	reporter: z.string({
		required_error: 'errors.reporter',
	}),
	email: z
		.string({
			required_error: 'errors.email.required',
		})
		.email({
			message: 'errors.email.value',
		}),
	project: z.string({
		required_error: 'errors.project',
	}),
	municipality: z.string({
		required_error: 'errors.municipality',
	}),
	opening_date: z
		.date({
			coerce: true,
			errorMap: (issue, ctx) => {
				// console.log(issue)
				if (issue.code === 'invalid_type') {
					return { message: 'errors.opening_date.required' }
				}
				if (issue.code === 'invalid_date') {
					return { message: 'errors.opening_date.value' }
				}
				return { message: ctx.defaultError }
			},
		})
		.min(new Date(new Date().setHours(0, 0, 0, 0)), 'errors.opening_date.min'),
	file: z
		.any()
		.refine(file => !file || file.size <= MAX_FILE_SIZE, 'errors.file.size')
		.refine(file => !file || ACCEPTED_FILE_TYPES.includes(file.type), 'errors.file.type'),
})

export const defaultValues = {
	reporter: '',
	email: '',
	project: '',
	municipality: '',
	opening_date: new Date().toString(),
	file: null as File | null,
}

export type FormValues = typeof defaultValues

export default schema
