import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
  S3EventRecord,
} from 'aws-lambda'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import axios from 'axios'
import parseFormData from './lambda-multipart-parser'
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

    //const response = await emailService.sendEmail(report)
    //console.log('SMTP response:\n', response)

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

export const sendEmail = async (event: S3EventRecord) => {
  console.log('Email lamda triggered:\n', event)
  console.log('S3 bucket:\n', event.s3.bucket)

  const s3client = new S3Client()
  const s3ListObjectsCommand = new ListObjectsV2Command({ Bucket: event.s3.bucket.arn })

  const s3ObjectList = await s3client.send(s3ListObjectsCommand)

  console.log('S3 objects list:\n', s3ObjectList)
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
