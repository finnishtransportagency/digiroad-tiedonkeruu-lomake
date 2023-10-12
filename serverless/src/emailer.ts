import { SSM } from 'aws-sdk'

const ssm = new SSM()

const getParameter = async (name: string): Promise<string> => {
  const { Parameter } = await ssm.getParameter({ Name: name, WithDecryption: true }).promise()
  return Parameter?.Value || ''
}

const sendEmail = async () => {
  const credentials = getParameter(process.env.SES_CREDENTIALS_NAME || '')

  console.log(credentials)
}

export default sendEmail
