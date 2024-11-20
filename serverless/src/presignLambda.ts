import { Handler } from 'aws-lambda'
import s3Service from './services/s3Service'
import { corsHeaders, offline, virusScanBucket } from './config'
import parseFormData from './lambda-multipart-parser'
import schema from './schema'

export const handler: Handler = async event => {
	if (offline) console.log('Received event:\n', event)
	// Handle OPTIONS request
	if (offline && event.requestContext.http.method === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: corsHeaders,
			body: '',
		}
	}

	// TODO: Add reCaptcha verification

	const data = schema.validatePresign(await parseFormData(event))
	console.log('Validated data:', data)

	const reportId = data.reportId
	const fileName = data.fileName
	// const contentType = data.contentType

	const presignedURL = await s3Service.getPresignedPostUrl(
		virusScanBucket,
		fileName,
		reportId
		// contentType
		// TODO: Add MD5 hash of the file from the request for more security
	)

	console.log('Presigned URL:', presignedURL.url)
	console.log('Fields:', presignedURL.fields)
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(presignedURL, null, 2),
	}
}

