import { getParameter } from './utils'

const sendEmail = async () => {
  const credentials = await getParameter(process.env.SES_CREDENTIALS_NAME || '')

  console.log(credentials)
}

export default sendEmail
