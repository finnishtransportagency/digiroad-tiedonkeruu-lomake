import { z } from 'zod'

// Remember to update error messages if you change these values
/**
 * Amazon SES supports emails with a message size of up to 40MB but
 * lambda function has a limit of 6MB for the invocation payload.
 */
const MAX_TOTAL_FILE_SIZE = 4_200_000 // 4.2MB leaving some room for other fields
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
	reporter: z
		.string({
			required_error: 'errors.reporter.required',
		})
		.max(64, { message: 'errors.reporter.max' }),
	email: z
		.string({
			required_error: 'errors.email.required',
		})
		.email({
			message: 'errors.email.value',
		})
		.max(320, { message: 'errors.email.max' }),
	project: z
		.string({
			required_error: 'errors.project.required',
		})
		.max(64, { message: 'errors.project.max' }),
	municipality: z
		.string({
			required_error: 'errors.municipality.required',
		})
		.max(32, { message: 'errors.municipality.max' }),
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
	files: z
		// This could maybe be improved by using z.record(...) or something similar
		.any()
		.refine(filesObject => {
			if (!filesObject) return true
			if (filesObject instanceof Object) {
				const filesArray = Object.values(filesObject)
				return (
					filesArray.reduce((totalSize: number, file) => {
						return totalSize + (file instanceof File ? file.size : 0)
					}, 0) <= MAX_TOTAL_FILE_SIZE
				)
			}
			return false
		}, 'errors.files.size')
		.refine(filesObject => {
			if (!filesObject) return true
			if (filesObject instanceof Object) {
				const filesArray = Object.values(filesObject)
				return filesArray.reduce((onlyAcceptedFiles: boolean, file) => {
					return (
						onlyAcceptedFiles && file instanceof File && ACCEPTED_FILE_TYPES.includes(file.type)
					)
				}, true)
			}
			return false
		}, 'errors.files.type'),
	description: z.string().optional(),
})

export const defaultValues = {
	reporter: '',
	email: '',
	project: '',
	municipality: '',
	opening_date: new Date().toString(),
	files: null as { [number: number]: File } | null,
	description: '',
}

export type FormValues = typeof defaultValues

export default schema
