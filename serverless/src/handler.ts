import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
  S3Event,
} from 'aws-lambda'
import axios from 'axios'
import parseFormData from './lambda-multipart-parser'
import { ZodError } from 'zod'
import schema from './schema'
import { reCaptchaSecret, reCaptchaVerifyURL } from './config'
import reportService from './services/reportService'

export const handlePost = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  _callback: APIGatewayProxyCallback
) => {
  try {
    // Verify body exists
    if (event.body === null) {
      console.error('Bad Request: Missing body')
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            message: 'Bad Request: Missing body',
          },
          null,
          2
        ),
      }
    }
    // Verify reCaptcha token exists
    if (!event.headers['g-recaptcha-response']) {
      console.error('Bad Request: Missing reCaptcha token')
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            message: 'Bad Request: Missing reCaptcha token',
          },
          null,
          2
        ),
      }
    }
    // Verify reCaptcha token
    if (
      (
        await axios.post(
          `${reCaptchaVerifyURL}?secret=${reCaptchaSecret}&response=${event.headers['g-recaptcha-response']}`
        )
      ).data.success
    ) {
      console.log('reCaptcha token verified')
    } else {
      console.error('Bad Request: Invalid reCaptcha token')
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            message: 'Bad Request: Invalid reCaptcha token',
          },
          null,
          2
        ),
      }
    }

    const report = schema.validate(await parseFormData(event))
    console.log('Validated form data:\n', report)

    const reportId = await reportService.sendToVirusScan(report)
    console.log('Report sent to virus scan:\n', reportId)

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Form data received',
          formData: {
            ...report,
            files: report.files.map(file => {
              return {
                filename: file.filename,
              }
            }),
          },
        },
        null,
        2
      ),
    }
  } catch (error: unknown) {
    return errorHandlers(error)
  }
}

export const sendEmail = async (event: S3Event) => {
  console.log('Email lamda triggered:\n', event)

  const record = event.Records[0]
  console.log('S3EventRecord s3:\n', record.s3)
  const scannedReport = await reportService.getScannedReport(record.s3)
  console.log('Scanned report:\n', scannedReport)
  // TODO
}

const errorHandlers = (error: unknown) => {
  if (error instanceof ZodError) {
    console.error('Error validating form data:\n', error)
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'Bad Request: Invalid form data',
          error: JSON.parse(error.message),
        },
        null,
        2
      ),
    }
  } else {
    console.error('Unhandled error:\n', error)
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Internal Server Error',
        },
        null,
        2
      ),
    }
  }
}
