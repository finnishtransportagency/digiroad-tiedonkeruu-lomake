import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyCallback,
} from 'aws-lambda'

export const ping = async (
  event: APIGatewayProxyEvent,
  _context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Pong!',
        input: event,
      },
      null,
      2
    ),
  }

  callback(null, response)
}
