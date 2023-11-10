/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Formik, Form, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { ToastProps } from '../components/Toast'
import FieldLabel from '../components/FieldLabel'
import FormField from '../components/FormField'
import ErrorLabel from '../components/ErrorLabel'
import schema, { ACCEPTED_FILE_TYPES, defaultValues, FormValues } from '../schema'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'
import httpService from '../services/httpService'
import { apiURL } from '../config'

import 'react-datepicker/dist/react-datepicker.css'

type FormPageProps = {
	setToastProps: Dispatch<SetStateAction<ToastProps>>
}

const FormPage = ({ setToastProps }: FormPageProps) => {
	const { t, i18n } = useTranslation()
	const fileInputRef = useRef<HTMLInputElement>()
	const descriptionInputRef = useRef<HTMLTextAreaElement>()
	const [reCaptchaToken, setReCaptchaToken] = useState('')
	const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)

	const verifyReCaptcha = useCallback((token: string) => {
		setReCaptchaToken(token)
	}, [])

	const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
		setToastProps({ $visible: true, message: t('form.submitting'), type: 'loading' })
		const formData = new FormData()

		formData.append('lang', i18n.language)
		formData.append('reporter', values.reporter)
		formData.append('email', values.email)
		formData.append('project', values.project)
		formData.append('municipality', values.municipality)
		formData.append('opening_date', values.opening_date)
		const filesArray = Object.values(values.files)
		if (filesArray.length > 0)
			filesArray.forEach(file => {
				formData.append(`file/${file.name}`, file)
			})
		formData.append('description', values.description)

		if (await httpService.post(apiURL, formData, reCaptchaToken)) {
			// Successfull submit
			resetAllInputs(actions.resetForm)
			setRefreshReCaptcha(r => !r)
			setToastProps({ $visible: true, message: t('form.submit_success'), type: 'success' })
			setTimeout(() => {
				setToastProps(oldProps => ({ ...oldProps, $visible: false }))
			}, 3000)
		} else {
			// Failed submit
			setToastProps({ $visible: true, message: t('errors.submit'), type: 'error' })
			setTimeout(() => {
				setToastProps(oldProps => ({ ...oldProps, $visible: false }))
			}, 3000)
		}
	}

	const handleReset = (resetForm: () => void) => {
		setRefreshReCaptcha(r => !r)
		if (confirm(t('form.reset_confirm'))) {
			resetAllInputs(resetForm)
		}
	}

	const resetAllInputs = (resetForm: () => void) => {
		if (fileInputRef.current) fileInputRef.current.value = ''
		if (descriptionInputRef.current) descriptionInputRef.current.value = ''
		resetForm()
	}

	return (
		<Container>
			<Heading $level='h1'>{t('form.title')}</Heading>
			<Formik
				onSubmit={handleSubmit}
				initialValues={defaultValues}
				validationSchema={toFormikValidationSchema(schema)}
			>
				{({
					errors,
					touched,
					values,
					setFieldValue,
					setFieldTouched,
					isValid,
					isSubmitting,
					resetForm,
				}) => (
					<Form>
						<FieldLabel htmlFor='reporter'>{t('form.reporter')}</FieldLabel>
						<FormField name='reporter' placeholder={t('form.reporter')} />
						{errors.reporter && touched.reporter ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.reporter)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='email'>{t('form.email')}</FieldLabel>
						<FormField name='email' placeholder={t('form.email')} />
						{errors.email && touched.email ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.email)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='project'>{t('form.project')}</FieldLabel>
						<FormField name='project' placeholder={t('form.project')} />
						{errors.project && touched.project ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.project)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='municipality'>{t('form.municipality')}</FieldLabel>
						<FormField name='municipality' placeholder={t('form.municipality')} />
						{errors.municipality && touched.municipality ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.municipality)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='opening_date'>{t('form.opening_date')}</FieldLabel>
						<FormField
							as={DatePicker}
							name='opening_date'
							selected={new Date(values.opening_date)}
							onChange={(date: string) => {
								void setFieldTouched('opening_date')
								void setFieldValue('opening_date', new Date(date))
							}}
							dateFormat='dd.MM.yyyy'
						/>
						{errors.opening_date && touched.opening_date ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.opening_date)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='file'>{t('form.file')}</FieldLabel>
						<FormField
							as='input'
							type='file'
							multiple
							ref={fileInputRef}
							accept={ACCEPTED_FILE_TYPES.join(',')}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								if (!event.currentTarget.files || event.currentTarget.files.length < 1) {
									setFieldValue('files', null)
								} else {
									setFieldValue('files', event.currentTarget.files)
								}
							}}
						/>
						{errors.files ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.files)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='description'>{t('form.description')}</FieldLabel>
						<FormField
							as='textarea'
							name='description'
							ref={descriptionInputRef}
							placeholder={t('form.description')}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								setFieldValue('description', event.currentTarget.value)
							}
						/>

						<GoogleReCaptcha onVerify={verifyReCaptcha} refreshReCaptcha={refreshReCaptcha} />

						<br />

						<Button
							type='button'
							onClick={() => handleReset(resetForm)}
							color='negative'
							disabled={isSubmitting}
						>
							{t('form.reset')}
						</Button>
						<Button type='submit' color='positive' disabled={!isValid || isSubmitting}>
							{t('form.submit')}
						</Button>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default FormPage
