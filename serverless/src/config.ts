export const offline = process.env.IS_OFFLINE || false
export const reCaptchaVerifyURL =
  process.env.RECAPTCHA_VERIFY_URL || 'https://www.google.com/recaptcha/api/siteverify'
export const reCaptchaSecret = process.env.RECAPTCHA_SECRET || ''
export const awsRegion = process.env.REGION || 'eu-west-1'
export const smtpCredentialsName = process.env.SMTP_CREDENTIALS_NAME || ''
export const emailSender = process.env.SMTP_SENDER || ''
export const smtpEndpoint = process.env.SMTP_ENDPOINT || ''
export const virusScanBucket = process.env.VIRUS_SCAN_BUCKET || ''
