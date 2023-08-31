import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import { Formik, Form } from 'formik'
import FormField from '../components/FormField'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import FieldLabel from '../components/FieldLabel'
import ErrorLabel from '../components/ErrorLabel'
import Heading from '../components/Heading'
import Container from '../components/Container'

const TestSchema = z.object({
	field: z.string({
		required_error: 'field required',
	}),
})

const initialValues = {
	field: 'initial field value',
}

const ComponentPalette = () => {
	const { t } = useTranslation()

	return (
		<Container>
			<Heading $level='h1'>Title</Heading>
			<p>Paragraph: {t('hello')}</p>
			<Button>Main button</Button>
			<br />
			<Button color='positive'>Positive button</Button>
			<br />
			<Button color='negative'>Negative button</Button>
			<Formik
				onSubmit={values => {
					console.log(values)
				}}
				initialValues={initialValues}
				validationSchema={toFormikValidationSchema(TestSchema)}
			>
				{({ errors, touched }) => (
					<Form>
						<FieldLabel htmlFor='field'>Field label</FieldLabel>
						<FormField name='field' />
						{errors.field && touched.field ? <ErrorLabel>{errors.field}</ErrorLabel> : null}
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default ComponentPalette
