import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

export const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSMClient({ region: process.env.REGION || 'eu-west-1' })

  const { Parameter } = await ssm.send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  )
  return Parameter?.Value || ''
}
