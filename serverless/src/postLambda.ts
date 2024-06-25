import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'
import axios from 'axios'
import parseFormData from './lambda-multipart-parser'
import { ZodError } from 'zod'
import schema from './schema'
import { corsHeaders, offline, reCaptchaSecret, reCaptchaVerifyURL } from './config'
import reportService from './services/reportService'

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  _callback: APIGatewayProxyCallback
) => {
  try {
    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      }
    }

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
      console.info('reCaptcha token verified')
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
    console.log(
      'Validated form data:\n' +
        `language: ${report.lang}\n` +
        `reporter: ${report.reporter.substring(0, 2)}****\n` +
        `email: ${report.email}\n` +
        `project: ${report.project}\n` +
        `municipality: ${report.municipality}\n` +
        `opening date: ${report.opening_date.toISOString()}\n` +
        `description: ${report.description}\n` +
        `files: ${report.files.map(file => file.filename).join(', ')}`
    )

    if (!offline) {
      const reportId = await reportService.sendToVirusScan(report)
      console.log('Report sent to virus scan:\n', reportId)
    }

    return {
      statusCode: 202,
      headers: corsHeaders,
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

const errorHandlers = (error: unknown) => {
  if (error instanceof ZodError) {
    console.error('Error while validating form data:\n', error)
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
