export const offline = process.env.IS_OFFLINE === 'true'
export const stage = process.env.STAGE || 'dev'
export const corsHeaders = {
  'Access-Control-Allow-Origin': offline
    ? 'http://localhost:3000'
    : `${process.env.DOMAIN}, ${process.env.ALTERNATE_DOMAIN}`,
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type, g-recaptcha-response',
}
export const reCaptchaVerifyURL =
  process.env.RECAPTCHA_VERIFY_URL || 'https://www.google.com/recaptcha/api/siteverify'
export const reCaptchaSecret = process.env.RECAPTCHA_SECRET || ''
export const awsRegion = process.env.REGION || 'eu-west-1'
export const smtpCredentialsName = process.env.SMTP_CREDENTIALS_NAME || ''
export const emailSender = process.env.SMTP_SENDER || ''
export const emailRecipient = process.env.SMTP_RECIPIENT || ''
export const smtpEndpoint = process.env.SMTP_ENDPOINT || ''
export const virusScanBucket = process.env.VIRUS_SCAN_BUCKET || ''
export const s3ClientConfig = offline
  ? {
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
      },
      endpoint: 'http://127.0.0.1:4569',
    }
  : {}
