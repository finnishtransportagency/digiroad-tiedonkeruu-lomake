export const offline = process.env.IS_OFFLINE === 'true'
export const offlineVirusTag =
	(process.env.OFFLINE_VIRUS_TAG && process.env.OFFLINE_VIRUS_TAG !== 'false') || false
export const serviceName = process.env.SERVICE_NAME || 'dr-tiedonkeruu'
export const stage = process.env.STAGE || 'dev'

export const securityGroupId = process.env.SECURITY_GROUP_ID || ''
export const subnetId1 = process.env.SUBNET_ID_1 || ''
export const subnetId2 = process.env.SUBNET_ID_2 || ''
export const virusScanArn = process.env.VIRUS_SCAN_ARN || ''

export const corsHeaders = {
	'Access-Control-Allow-Origin': offline
		? 'http://localhost:3000'
		: `${process.env.DOMAIN}, ${process.env.ALTERNATE_DOMAIN}`,
	'Access-Control-Allow-Methods': 'OPTIONS, POST',
	'Access-Control-Allow-Headers': 'Content-Type, g-recaptcha-response',
} as const
export const reCaptchaVerifyURL =
	process.env.RECAPTCHA_VERIFY_URL || 'https://www.google.com/recaptcha/api/siteverify'
export const reCaptchaSecret = process.env.RECAPTCHA_SECRET || ''
export const awsRegion = process.env.REGION || 'eu-west-1'
export const smtpCredentialsName = process.env.SMTP_CREDENTIALS_NAME || ''
export const emailSender = process.env.SMTP_SENDER || ''
export const emailRecipient = process.env.SMTP_RECIPIENT || ''
export const smtpEndpoint = process.env.SMTP_ENDPOINT || ''
export const virusScanBucket = `${serviceName}-${stage}-virus-scanner-hosting`
export const presignRoleArn = process.env.PRESIGN_ROLE_ARN || ''
export const attachmentRetryConfig = {
	retryLimit: 6,
	retryInterval: 10 /*seconds*/ * 1000,
}