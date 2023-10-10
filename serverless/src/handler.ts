import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'
import { parse as parseFormData } from 'lambda-multipart-parser'
import validate from './validator'

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
  } catch (error) {
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
  }
}
