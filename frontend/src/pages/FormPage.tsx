/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Formik, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { v4 as uuidv4 } from 'uuid'
import Form from '../components/form/Form'
import FieldLabel from '../components/form/FieldLabel'
import FormField from '../components/form/FormField'
import ErrorLabel, { ErrorLabelPlaceholder } from '../components/form/ErrorLabel'
import FormikPersist from '../components/form/FormikPersist'
import VerticalGroup from '../components/VericalGroup'
import HorizontalGroup from '../components/HorizontalGroup'
import { ToastProps } from '../components/Toast'
import Tooltip from '../components/Tooltip'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'
import reportSchema, {
	ACCEPTED_FILE_TYPES,
	defaultValues,
	FormValues,
	presignResponseSchema,
} from '../schema'
import httpService from '../services/httpService'
import { apiURL } from '../config'
import { resources } from '../i18n/config'
import municipalities from '../i18n/municipalities'

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
	const [municipalitySuggestions, setMunicipalitySuggestions] = useState<string[]>([])

	useEffect(() => {
		// Refresh reCaptcha token every 110 seconds (token expires after 120 seconds)
		const interval: NodeJS.Timer = setInterval(() => {
			setRefreshReCaptcha(r => !r)
		}, 1000 * 110)
		return () => clearInterval(interval)
	}, [i18n])

	useEffect(() => {
		setMunicipalitySuggestions(municipalities[i18n.language as keyof typeof resources])
	}, [i18n.language])

	const verifyReCaptcha = useCallback((token: string) => {
		setReCaptchaToken(token)
	}, [])

	const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
		const reportId = uuidv4()
		if (values.files) {
			for (const file of Object.values(values.files)) {
				setToastProps({
					$visible: true,
					message: `${t('form.submitting_attachment')}: ${file.name}`,
					type: 'loading',
				})
				const attachmentInfo = new FormData()
				attachmentInfo.append('reportId', reportId)
				attachmentInfo.append('fileName', file.name)
				const presignResponse = await httpService.post(`${apiURL}/api/presign`, attachmentInfo)
				if (!presignResponse.success) {
					setToastProps({
						$visible: true,
						message: `${t('errors.attachment')}: ${file.name}`,
						type: 'error',
					})
					setTimeout(() => {
						setToastProps(oldProps => ({ ...oldProps, $visible: false }))
					}, 4000)
					return
				}
				const presignData = presignResponseSchema.parse(presignResponse.response.data)
				const attachmentFile = new FormData()
				attachmentFile.append('file', file, presignData.fields.key)
				const uploadResponse = await httpService.post(
					presignData.url,
					attachmentFile,
					presignData.fields,
				)
				console.log('Upload response:', uploadResponse)
			}
		}
		setToastProps({ $visible: true, message: t('form.submitting'), type: 'loading' })

		const formData = new FormData()
		formData.append('report_id', reportId)
		formData.append('lang', i18n.language)
		formData.append('reporter', values.reporter)
		formData.append('email', values.email)
		formData.append('project', values.project)
		formData.append('municipality', values.municipality)
		formData.append('opening_date', values.opening_date)
		formData.append('description', values.description)
		if (values.files)
			formData.append(
				'attachment_names',
				JSON.stringify(Object.values(values.files).map(file => file.name)),
			)

		if (
			(
				await httpService.post(`${apiURL}/api/postData`, formData, {
					'g-recaptcha-response': reCaptchaToken,
				})
			).success
		) {
			// Successfull submit
			resetAllInputs(actions.resetForm)
			setToastProps({ $visible: true, message: t('form.submit_success'), type: 'success' })
		} else {
			// Failed submit
			setToastProps({ $visible: true, message: t('errors.submit'), type: 'error' })
		}

		setTimeout(() => {
			setToastProps(oldProps => ({ ...oldProps, $visible: false }))
		}, 3000)
		setRefreshReCaptcha(r => !r)
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
			<HorizontalGroup>
				<Heading $level='h1'>{t('form.title')}</Heading>
				<img
					src='/vayla_alla_fi_sv_rgb.png'
					alt='Väylävirasto-logo'
					style={{ userSelect: 'none' }}
					width='35%'
					height='35%'
				/>
			</HorizontalGroup>
			<Formik
				onSubmit={handleSubmit}
				initialValues={defaultValues}
				validationSchema={toFormikValidationSchema(reportSchema)}
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
						<FormikPersist name='form-values' />
						<VerticalGroup>
							<FieldLabel htmlFor='reporter'>{t('form.reporter')}</FieldLabel>
							<FormField
								name='reporter'
								placeholder={t('form.reporter')}
								$errors={errors.reporter && touched.reporter}
							/>
							{errors.reporter && touched.reporter ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.reporter)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='email'>{t('form.email')}</FieldLabel>
							<FormField
								name='email'
								placeholder={t('form.email')}
								$errors={errors.email && touched.email}
							/>
							{errors.email && touched.email ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.email)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='project'>{t('form.project')}</FieldLabel>
							<FormField
								name='project'
								placeholder={t('form.project')}
								$errors={errors.project && touched.project}
							/>
							{errors.project && touched.project ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.project)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='municipality'>{t('form.municipality')}</FieldLabel>
							<FormField
								name='municipality'
								placeholder={t('form.municipality')}
								$errors={errors.municipality && touched.municipality}
								list='muni-suggestions'
							/>
							{values.municipality.length > 1 && (
								<datalist id='muni-suggestions'>
									{municipalitySuggestions &&
										municipalitySuggestions
											.filter(suggestion =>
												suggestion
													.toLocaleLowerCase()
													.startsWith(values.municipality.toLocaleLowerCase()),
											)
											.map(suggestion => {
												return <option key={suggestion} value={suggestion} />
											})}
								</datalist>
							)}
							{errors.municipality && touched.municipality ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.municipality)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='opening_date'>{t('form.opening_date')}</FieldLabel>
							<FormField
								as={DatePicker}
								name='opening_date'
								$errors={errors.opening_date && touched.opening_date}
								selected={new Date(values.opening_date)}
								onChange={(date: string) => {
									void setFieldTouched('opening_date')
									void setFieldValue('opening_date', new Date(date))
								}}
								dateFormat='dd.MM.yyyy'
							/>
							{errors.opening_date ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.opening_date)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<HorizontalGroup>
								<FieldLabel htmlFor='file'>{t('form.file')}</FieldLabel>
								<Tooltip message={t('tooltips.file')} />
							</HorizontalGroup>
							<FormField
								as='input'
								type='file'
								multiple
								$errors={errors.files && touched.files}
								$maxWidth='15.5em'
								ref={fileInputRef}
								accept={ACCEPTED_FILE_TYPES.join(',')}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									void setFieldTouched('files')
									if (!event.currentTarget.files || event.currentTarget.files.length < 1) {
										setFieldValue('files', null)
									} else {
										setFieldValue('files', event.currentTarget.files)
									}
								}}
							/>
							{errors.files && touched.files ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.files)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='description'>{t('form.description')}</FieldLabel>
							<FormField
								as='textarea'
								name='description'
								ref={descriptionInputRef}
								placeholder={t('form.description')}
								value={values.description}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFieldValue('description', event.currentTarget.value)
								}
							/>

							<GoogleReCaptcha onVerify={verifyReCaptcha} refreshReCaptcha={refreshReCaptcha} />

							<HorizontalGroup>
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
							</HorizontalGroup>
						</VerticalGroup>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default FormPage
