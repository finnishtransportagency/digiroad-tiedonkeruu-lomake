import { Formik, Form } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import FieldLabel from '../components/FieldLabel'
import FormField from '../components/FormField'
import ErrorLabel from '../components/ErrorLabel'
import schema, { defaultValues } from '../schema'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'

import 'react-datepicker/dist/react-datepicker.css'

const FormPage = () => {
	const { t } = useTranslation()

	return (
		<Container>
			<Heading $level='h1'>{t('form.title')}</Heading>
			<Formik
				onSubmit={values => {
					// !!! TODO !!!
					console.log(values)
				}}
				initialValues={defaultValues}
				validationSchema={toFormikValidationSchema(schema)}
			>
				{({ errors, touched, values, setFieldValue, setFieldTouched }) => (
					<Form>
						<FieldLabel htmlFor='reporter'>{t('form.reporter')}</FieldLabel>
						<FormField name='reporter' placeholder={t('form.reporter')} />
						{errors.reporter && touched.reporter ? (
							<ErrorLabel>{errors.reporter}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='email'>{t('form.email')}</FieldLabel>
						<FormField name='email' placeholder={t('form.email')} />
						{errors.email && touched.email ? <ErrorLabel>{errors.email}</ErrorLabel> : null}

						<FieldLabel htmlFor='project'>{t('form.project')}</FieldLabel>
						<FormField name='project' placeholder={t('form.project')} />
						{errors.project && touched.project ? <ErrorLabel>{errors.project}</ErrorLabel> : null}

						<FieldLabel htmlFor='municipality'>{t('form.municipality')}</FieldLabel>
						<FormField name='municipality' placeholder={t('form.municipality')} />
						{errors.municipality && touched.municipality ? (
							<ErrorLabel>{errors.municipality}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='opening_date'>{t('form.opening_date')}</FieldLabel>
						<FormField
							as={DatePicker}
							name='opening_date'
							selected={new Date(values.opening_date)}
							onChange={(date: string) => {
								setFieldTouched('opening_date')
								setFieldValue('opening_date', new Date(date))
							}}
							dateFormat='dd.MM.yyyy'
						/>
						{errors.opening_date && touched.opening_date ? (
							<ErrorLabel>{errors.opening_date}</ErrorLabel>
						) : null}

						<br />
						<Button type='reset' color='negative'>
							{t('form.reset')}
						</Button>
						<Button type='submit' color='positive'>
							{t('form.submit')}
						</Button>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default FormPage
