import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'
import { parse as parseFormData } from 'lambda-multipart-parser'
import { ZodError } from 'zod'
import validate from './validator'
import emailer from './emailer'

export const handlePost = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  _callback: APIGatewayProxyCallback
) => {
  if (event.body === null) {
    console.log('Bad Request: Missing body')
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

  try {
    const formData = await parseFormData(event)
    const validated = validate(formData)
    console.log('Validated form data:', validated)

    // TESTING
    await emailer.sendEmail()

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Form data received',
          formData: validated,
        },
        null,
        2
      ),
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.log('Error validating form data:', error)
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
      console.log('Error parsing form data:', error)
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
