import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import validate from './validator'

export const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.body === null)
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

  const formData = validate(JSON.parse(event.body))

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Form data received',
        formData: formData,
      },
      null,
      2
    ),
  }
}
