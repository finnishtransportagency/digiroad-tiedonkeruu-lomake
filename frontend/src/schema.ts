import { z } from 'zod'

/**
 * Amazon SES supports emails with a message size of up to 40MB but
 * lambda function has a limit of 6MB for the invocation payload.
 */
const MAX_TOTAL_FILE_SIZE = 1_100_000 // TEMPORARY LIMIT: Something (maybe loadbalancer) limits file size... //4_200_000 // 4.2MB leaving some room for other fields
export const ACCEPTED_FILE_TYPES = [
	// Remember to update error messages if you change accepted file types
	'.pdf',
	'.dgn',
	'.dwg',
	'.dxf',
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
				return Object.values(filesObject).reduce((onlyAcceptedFiles: boolean, file) => {
					if (!onlyAcceptedFiles || !(file instanceof File)) return false
					let fileType = file.type
					if (!fileType) fileType = `.${file.name.split('.').pop()}`
					return ACCEPTED_FILE_TYPES.includes(fileType)
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
