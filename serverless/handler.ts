import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const ping = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Pong!",
        input: event,
      },
      null,
      2
    ),
  };
};
