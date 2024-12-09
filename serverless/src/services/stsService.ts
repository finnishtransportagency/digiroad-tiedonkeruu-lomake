import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts'
import { awsRegion } from '../config'

const getRoleCredentials = async (roleArn: string, roleSessionName: string) => {
	const assumedRole = await new STSClient({ region: awsRegion }).send(
		new AssumeRoleCommand({
			RoleArn: roleArn,
			RoleSessionName: roleSessionName,
		})
	)
	if (!assumedRole.Credentials) throw new Error('No credentials found in assumed role')
	const { AccessKeyId, SecretAccessKey, SessionToken } = assumedRole.Credentials
	if (!AccessKeyId || !SecretAccessKey || !SessionToken)
		throw new Error('Missing credentials in assumed role')
	return { AccessKeyId, SecretAccessKey, SessionToken }
}

export default { getRoleCredentials }

