import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSMClient({ region: process.env.REGION || 'eu-west-1' })

  const { Parameter } = await ssm.send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  )
  return Parameter?.Value || ''
}

const getSMTPCredentials = async () => {
  const credentialsString = await getParameter(process.env.SMTP_CREDENTIALS_NAME || '')

  const usernameRegex = /SMTP user name\s*([\s\S]+?)\r?\n/
  const passwordRegex = /SMTP password\s*([\s\S]+)/
  const usernameMatch = credentialsString.match(usernameRegex)
  const passwordMatch = credentialsString.match(passwordRegex)

  if (usernameMatch && passwordMatch) {
    const username = usernameMatch[1].trim()
    const password = passwordMatch[1].trim()

    return { username, password }
  } else {
    throw new Error('Unable to parse credentials from SecureString')
  }
}

export default { getParameter, getSMTPCredentials }
