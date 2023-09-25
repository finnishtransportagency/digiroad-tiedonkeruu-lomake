import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'
import validate from './validator'

export const handlePost = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
) => {
  if (event.body === null) {
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(
        {
          message: 'Bad Request: Missing body',
        },
        null,
        2
      ),
    })
    return
  }

  const formData = validate(JSON.parse(event.body))

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
    },
    body: JSON.stringify(
      {
        message: 'Form data received',
        formData: formData,
      },
      null,
      2
    ),
  })
}
