import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { awsRegion, smtpCredentialsName } from './config'

/**
 * Fetches a parameter from AWS SSM Parameter Store
 *
 * @param name name of the parameter to fetch
 * @returns the value of the parameter
 */
const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSMClient({ region: awsRegion })

  const { Parameter } = await ssm.send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  )
  return Parameter?.Value || ''
}

/**
 * Fetches and parses SMTP credentials from AWS SSM Parameter Store
 *
 * @example const { username, password } = await getSMTPCredentials()
 * @throws Error if unable to parse credentials from SecureString
 * @returns SMTP credentials
 */
const getSMTPCredentials = async () => {
  const credentialsString = await getParameter(smtpCredentialsName)

  const usernameRegex = /SMTP user name\s*([\s\S]+?)\r?\n/
  const passwordRegex = /SMTP password\s*([\s\S]+)/
  const usernameMatch = credentialsString.match(usernameRegex)
  const passwordMatch = credentialsString.match(passwordRegex)

  if (usernameMatch && passwordMatch) {
    const username = usernameMatch[1].trim()
    const password = passwordMatch[1].trim()

    return { username, password }
  } else {
    throw new Error('Unable to parse SMTP credentials from SecureString')
  }
}

/**
 * @property getParameter fetches a parameter from AWS SSM Parameter Store
 * @property getSMTPCredentials fetches and parses SMTP credentials from AWS SSM Parameter Store
 */
export default { getParameter, getSMTPCredentials }
