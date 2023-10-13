import { getParameter } from './utils'

const getCredentials = async () => {
  const credentialsString = await getParameter(process.env.SES_CREDENTIALS_NAME || '')

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

const sendEmail = async () => {
  const SMTP_credentials = await getCredentials()
  console.log(SMTP_credentials.username, SMTP_credentials.password)
}

export default { sendEmail }
