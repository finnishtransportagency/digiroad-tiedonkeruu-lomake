import { z } from 'zod'

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
})

export const defaultValues = {
	reporter: '',
	email: '',
	project: '',
	municipality: '',
	opening_date: new Date().toString(),
}

export type FormValues = typeof defaultValues

export default schema
