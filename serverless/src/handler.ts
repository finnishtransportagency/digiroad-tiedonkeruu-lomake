import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
  S3Event,
} from 'aws-lambda'
import { S3Client, GetObjectTaggingCommand } from '@aws-sdk/client-s3'
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

export const sendEmail = async (event: S3Event) => {
  console.log('Email lamda triggered:\n', event)
  event.Records.forEach(async record => {
    console.log('S3EventRecord s3:\n', record.s3)
    console.log('S3EventRecord bucket:\n', record.s3.bucket)
    console.log('S3EventRecord object:\n', record.s3.object)
  })

  const s3client = new S3Client()

  const ObjectTags = await s3client.send(
    new GetObjectTaggingCommand({
      Bucket: event.Records[0].s3.bucket.name,
      Key: event.Records[0].s3.object.key,
    })
  )

  console.log('S3 objects list:\n', ObjectTags)

  const virusScan = ObjectTags.TagSet?.find(tag => tag.Key === 'virusscan')

  if (!virusScan) {
    console.log('Virus scan not found')
    return
  }

  if (virusScan.Value === 'virus') {
    console.log('Virus detected')
    return
  }

  if (virusScan.Value === 'clean') {
    console.log('Virus scan clean')
    return
  }
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
