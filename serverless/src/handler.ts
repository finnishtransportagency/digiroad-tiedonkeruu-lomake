import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'
import axios from 'axios'
import { parse as parseFormData } from 'lambda-multipart-parser'
import { ZodError } from 'zod'
import schema from './schema'
import emailService from './emailService'
import { reCaptchaSecret, reCaptchaVerifyURL } from './config'

export const handlePost = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  _callback: APIGatewayProxyCallback
) => {
  try {
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

    const formData = await parseFormData(event)
    const report = schema.validate(formData)
    console.log('Validated form data:', report)

    const response = await emailService.sendEmail(report)
    console.log('SMTP response:' + response)

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
    if (error instanceof ZodError) {
      console.error('Error validating form data:', error)
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
      console.error('Error parsing form data:', error)
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
}
