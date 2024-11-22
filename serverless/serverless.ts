import type { AWS } from '@serverless/typescript'
import 'dotenv/config'
import {
	offline,
	stage,
	reCaptchaSecret,
	securityGroupId,
	serviceName,
	subnetId1,
	subnetId2,
	virusScanArn,
	virusScanBucket,
} from './src/config'

type FunctionWithRoles = Exclude<AWS['functions'], undefined>[string] & {
	iamRoleStatements: Array<{
		Effect: 'Allow' | 'Deny'
		Action: Array<string>
		Resource: Array<
			| string
			| {
					'Fn::GetAtt': string[]
			  }
		>
	}>
}

interface ServerlessConfiguration extends AWS {
	functions: {
		[key: string]: FunctionWithRoles
	}
}

const slsServiceStageStr = '${self:service}-${self:custom.stage}'
const tags = [
	{
		Key: 'Name',
		Value: slsServiceStageStr,
	},
	{
		Key: 'Environment',
		Value: '${self:custom.stage}',
	},
	{
		Key: 'Administrator',
		Value: '${env:ADMINISTRATOR}',
	},
] as const

const serverlessConfiguration: ServerlessConfiguration = {
	service: serviceName,
	frameworkVersion: '3',
	useDotenv: true,
	plugins: [
		'serverless-plugin-typescript',
		'serverless-iam-roles-per-function',
		'serverless-s3-local',
		'serverless-offline',
		'serverless-s3-sync',
	],
	custom: {
		stage: "${opt:stage, 'dev'}",
		'serverless-offline': {
			httpPort: 3003,
		},
		s3: {
			address: '127.0.0.1',
			directory: './s3rver',
		},
		securityGroupId: offline ? securityGroupId : `\${ssm:${securityGroupId}}`,
		subnetId1: offline ? subnetId1 : `\${ssm:${subnetId1}}`,
		subnetId2: offline ? subnetId2 : `\${ssm:${subnetId2}}`,
		recaptchaSecret: offline ? reCaptchaSecret : `\${ssm:${reCaptchaSecret}}`,
		virusScanLambdaArn: offline ? virusScanArn : `\${ssm:${virusScanArn}}`,
		virusScanRole: '${env:offline.VIRUS_SCAN_ROLE, ssm:${env:VIRUS_SCAN_ROLE}}',
		acmCertificateArn: '${env:offline.ACM_CERTIFICATE_ARN, ssm:${env:ACM_CERTIFICATE_ARN}}',
		proxy: '${env:offline.PROXY, ssm:${env:PROXY}}',
		s3Sync: [
			{
				bucketNameKey: 'FrontendS3BucketName',
				localDir: 'ui',
				deleteRemoved: true,
			},
		],
	},
	package: {
		individually: true,
	},
	provider: {
		name: 'aws',
		stage,
		runtime: 'nodejs18.x',
		region: '${env:REGION}' as 'eu-west-1',
		vpc: {
			securityGroupIds: ['${self:custom.securityGroupId}'],
			subnetIds: ['${self:custom.subnetId1}', '${self:custom.subnetId2}'],
		},
		iam: {
			deploymentRole: 'arn:aws:iam::${env:AWS_ACCOUNT_ID}:role/${env:AWS_CLOUDFORMATION_ROLE}',
		},
		stackTags: {
			Name: slsServiceStageStr,
			Environment: '${self:custom.stage}',
			Administrator: '${env:ADMINISTRATOR}',
		},
		tags: {
			Name: slsServiceStageStr,
			Environment: '${self:custom.stage}',
			Administrator: '${env:ADMINISTRATOR}',
		},
	},
	functions: {
		presignPost: {
			handler: 'src/presignLambda.handler',
			iamRoleStatements: [
				{
					Effect: 'Allow',
					Action: ['sts:AssumeRole'],
					Resource: [{ 'Fn::GetAtt': ['PresignRole', 'Arn'] }],
				},
			],
			environment: {
				PRESIGN_ROLE_ARN: {
					'Fn::GetAtt': ['PresignRole', 'Arn'],
				},
			},
			events: offline
				? [
						{
							httpApi: {
								path: '/api/presign',
								method: 'post',
							},
						},
						{
							httpApi: {
								path: '/api/presign',
								method: 'options',
							},
						},
				  ]
				: [
						{
							alb: {
								listenerArn: {
									Ref: 'Listener',
								},
								priority: 2,
								conditions: {
									path: ['/api/presign'],
									method: ['POST', 'OPTIONS'],
									// There is a known issue with serverless-offline and alb events
									// https://github.com/dherault/serverless-offline/issues/1771 -> https://github.com/dherault/serverless-offline/pull/1772
								},
							},
						},
				  ],
		},
		handlePost: {
			handler: 'src/postLambda.handler',
			iamRoleStatements: [
				{
					Effect: 'Allow',
					Action: ['s3:PutObject'],
					Resource: [`arn:aws:s3:::${virusScanBucket}`, `arn:aws:s3:::${virusScanBucket}/*`],
				},
			],
			environment: {
				RECAPTCHA_SECRET: '${self:custom.recaptchaSecret}',
				VIRUS_SCAN_BUCKET: virusScanBucket,
			},
			events: offline
				? [
						{
							httpApi: {
								path: '/api/postData',
								method: 'post',
							},
						},
						{
							httpApi: {
								path: '/api/postData',
								method: 'options',
							},
						},
				  ]
				: [
						{
							alb: {
								listenerArn: {
									Ref: 'Listener',
								},
								priority: 1,
								conditions: {
									path: ['/api/postData'],
									method: ['POST', 'OPTIONS'],
									// There is a known issue with serverless-offline and alb events
									// https://github.com/dherault/serverless-offline/issues/1771 -> https://github.com/dherault/serverless-offline/pull/1772
								},
							},
						},
				  ],
		},
		sendEmail: {
			handler: 'src/emailLambda.handler',
			iamRoleStatements: [
				{
					Effect: 'Allow',
					Action: ['ssm:GetParameter', 'ssm:GetParameters'],
					Resource: [
						'arn:aws:ssm:${env:REGION}:${env:AWS_ACCOUNT_ID}:parameter/${env:SMTP_CREDENTIALS_NAME}',
					],
				},
				{
					Effect: 'Allow',
					Action: ['s3:ListBucket', 's3:GetObject', 's3:GetObjectTagging', 's3:DeleteObject'],
					Resource: [`arn:aws:s3:::${virusScanBucket}`, `arn:aws:s3:::${virusScanBucket}/*`],
				},
			],
			environment: {
				STAGE: '${self:custom.stage}',
				REGION: '${env:REGION}',
				SMTP_CREDENTIALS_NAME: '${env:SMTP_CREDENTIALS_NAME}',
				SMTP_ENDPOINT: 'email-smtp.${env:REGION}.amazonaws.com',
				SMTP_SENDER: '${env:SMTP_SENDER}',
				SMTP_RECIPIENT: '${env:SMTP_RECIPIENT}',
				VIRUS_SCAN_BUCKET: virusScanBucket,
			},
			/* events: [
				{
					schedule: {
						name: 'SendEmailSchedule',
						description: 'Send email with virus scan report',
						rate: ['cron(0 3 ? * MON-FRI *)'],
					},
				},
			], */
		},
	},
	resources: {
		Resources: {
			PresignPostLogGroup: {
				Type: 'AWS::Logs::LogGroup',
				Properties: {
					RetentionInDays: 180,
					Tags: tags,
				},
			},
			HandlePostLogGroup: {
				Type: 'AWS::Logs::LogGroup',
				Properties: {
					RetentionInDays: 180,
					Tags: tags,
				},
			},
			SendEmailLogGroup: {
				Type: 'AWS::Logs::LogGroup',
				Properties: {
					RetentionInDays: 180,
					Tags: tags,
				},
			},
			DrTiedonkeruuAlarmTopic: {
				Type: 'AWS::SNS::Topic',
				Properties: {
					TopicName: 'DrTiedonkeruuAlarmTopic',
					Tags: tags,
				},
			},
			HandlePostInvocationAlarm: {
				Type: 'AWS::CloudWatch::Alarm',
				Properties: {
					AlarmName: 'DrTiedonkeruu/HandlePostInvocationAlarm',
					AlarmDescription: 'Alarm for unusually high number of invocations of HandlePost',
					MetricName: 'Invocations',
					Namespace: 'AWS/Lambda',
					Statistic: 'Sum',
					Period: 300,
					EvaluationPeriods: 3,
					DatapointsToAlarm: 2,
					Threshold: 1000,
					ComparisonOperator: 'GreaterThanThreshold',
					TreatMissingData: 'notBreaching',
					Dimensions: [
						{
							Name: 'FunctionName',
							Value: `${slsServiceStageStr}-handlePost`,
						},
					],
					AlarmActions: [
						{
							Ref: 'DrTiedonkeruuAlarmTopic',
						},
					],
				},
			},
			S3BucketDrtiedonkeruuvirusscannerhosting: {
				Type: 'AWS::S3::Bucket',
				Properties: {
					BucketName: virusScanBucket,
					CorsConfiguration: {
						CorsRules: [
							{
								AllowedHeaders: ['*'],
								AllowedMethods: ['POST'],
								AllowedOrigins: ['https://${env:DOMAIN}', 'https://${env:ALTERNATE_DOMAIN}'],
								MaxAge: 30,
							},
						],
					},
					LifecycleConfiguration: {
						Rules: [
							{
								ExpirationInDays: 30,
								Prefix: 'reports/',
								Status: 'Enabled',
							},
							{
								ExpirationInDays: 7,
								Prefix: 'attachments/',
								Status: 'Enabled',
							},
						],
					},
					NotificationConfiguration: {
						LambdaConfigurations: [
							{
								Event: 's3:ObjectCreated:*',
								Function: '${self:custom.virusScanLambdaArn}',
							},
							{
								Event: 's3:ObjectTagging:Put',
								Function: {
									'Fn::GetAtt': ['SendEmailLambdaFunction', 'Arn'],
								},
								Filter: {
									S3Key: {
										Rules: [
											{
												Name: 'prefix',
												Value: 'reports/',
											},
										],
									},
								},
							},
						],
					},
					PublicAccessBlockConfiguration: {
						BlockPublicAcls: true,
						BlockPublicPolicy: false,
						IgnorePublicAcls: true,
						RestrictPublicBuckets: true,
					},
					Tags: tags,
				},
			},
			PresignRole: {
				Type: 'AWS::IAM::Role',
				Properties: {
					AssumeRolePolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Principal: {
									Service: ['lambda.amazonaws.com'],
								},
								Action: ['sts:AssumeRole'],
							},
						],
					},
					Policies: [
						{
							PolicyName: 'PresignPolicy',
							PolicyDocument: {
								Version: '2012-10-17',
								Statement: [
									{
										Effect: 'Allow',
										Action: ['s3:PutObject', 's3:GetBucketLocation'],
										Resource: [
											{ 'Fn::GetAtt': ['S3BucketDrtiedonkeruuvirusscannerhosting', 'Arn'] },
											{
												'Fn::Join': [
													'',
													[
														{ 'Fn::GetAtt': ['S3BucketDrtiedonkeruuvirusscannerhosting', 'Arn'] },
														'/attachments/*',
													],
												],
											},
										],
									},
								],
							},
						},
					],
					RoleName: 'presign-role',
					Tags: tags,
				},
			},
			S3BucketDrtiedonkeruuvirusscannerhostingPolicy: {
				Type: 'AWS::S3::BucketPolicy',
				Properties: {
					Bucket: {
						Ref: 'S3BucketDrtiedonkeruuvirusscannerhosting',
					},
					PolicyDocument: {
						Statement: [
							{
								Sid: 'AllowUploadsWithPresignedPost',
								Effect: 'Allow',
								Principal: {
									AWS: {
										'Fn::GetAtt': ['PresignRole', 'Arn'],
									},
								},
								Action: 's3:PutObject',
								Resource: {
									'Fn::Join': [
										'',
										[
											{ 'Fn::GetAtt': ['S3BucketDrtiedonkeruuvirusscannerhosting', 'Arn'] },
											'/attachments/*',
										],
									],
								},
							},
							{
								Sid: 'AllowVirusScanLambdaActions',
								Effect: 'Allow',
								Principal: {
									AWS: '${self:custom.virusScanRole}',
								},
								Action: ['s3:GetObject', 's3:PutObjectTagging'],
								Resource: {
									'Fn::Join': [
										'',
										[
											'arn:aws:s3:::',
											{
												Ref: 'S3BucketDrtiedonkeruuvirusscannerhosting',
											},
											'/*',
										],
									],
								},
							},
						],
					},
				},
			},
			InvokeSendEmailPermissionVirusScanS3: {
				Type: 'AWS::Lambda::Permission',
				Properties: {
					FunctionName: {
						'Fn::GetAtt': ['SendEmailLambdaFunction', 'Arn'],
					},
					Action: 'lambda:InvokeFunction',
					Principal: 's3.amazonaws.com',
					SourceArn: {
						'Fn::Join': [
							'',
							[
								'arn:',
								{
									Ref: 'AWS::Partition',
								},
								`:s3:::${slsServiceStageStr}-virus-scanner-hosting`,
							],
						],
					},
					SourceAccount: {
						Ref: 'AWS::AccountId',
					},
				},
			},
			FrontendS3Bucket: {
				Type: 'AWS::S3::Bucket',
				Properties: {
					BucketName: `${slsServiceStageStr}-frontend-hosting`,
					Tags: tags,
				},
			},
			FrontendS3OAI: {
				Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
				Properties: {
					CloudFrontOriginAccessIdentityConfig: {
						Comment: 'DRTiedonkeruu Frontend Origin Access Identity',
					},
				},
			},
			FrontendS3BucketPolicy: {
				Type: 'AWS::S3::BucketPolicy',
				Properties: {
					Bucket: {
						Ref: 'FrontendS3Bucket',
					},
					PolicyDocument: {
						Statement: [
							{
								Effect: 'Allow',
								Principal: {
									CanonicalUser: {
										'Fn::GetAtt': ['FrontendS3OAI', 'S3CanonicalUserId'],
									},
								},
								Action: 's3:GetObject',
								Resource: {
									'Fn::Join': [
										'',
										[
											'arn:aws:s3:::',
											{
												Ref: 'FrontendS3Bucket',
											},
											'/*',
										],
									],
								},
							},
						],
					},
				},
			},
			CloudFrontDistribution: {
				Type: 'AWS::CloudFront::Distribution',
				Properties: {
					DistributionConfig: {
						Aliases: ['${env:DOMAIN}', '${env:ALTERNATE_DOMAIN}'],
						CNAMEs: ['${env:DOMAIN}', '${env:ALTERNATE_DOMAIN}'],
						ViewerCertificate: {
							AcmCertificateArn: '${self:custom.acmCertificateArn}',
							MinimumProtocolVersion: 'TLSv1.2_2021',
							SslSupportMethod: 'sni-only',
						},
						PriceClass: 'PriceClass_100',
						Restrictions: {
							GeoRestriction: {
								RestrictionType: 'whitelist',
								Locations: ['FI'],
							},
						},
						Origins: [
							{
								Id: 'S3Origin',
								DomainName: {
									'Fn::Join': [
										'',
										[
											{
												Ref: 'FrontendS3Bucket',
											},
											'.s3-${env:REGION}.amazonaws.com',
										],
									],
								},
								S3OriginConfig: {
									OriginAccessIdentity: {
										'Fn::Sub': 'origin-access-identity/cloudfront/${FrontendS3OAI}',
									},
								},
							},
							{
								Id: 'DmzAlbOrigin',
								DomainName: '${self:custom.proxy}',
								CustomOriginConfig: {
									OriginProtocolPolicy: 'https-only',
									OriginSSLProtocols: ['TLSv1.2'],
								},
							},
						],
						DefaultRootObject: 'index.html',
						DefaultCacheBehavior: {
							TargetOriginId: 'S3Origin',
							CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
							ViewerProtocolPolicy: 'redirect-to-https',
						},
						CacheBehaviors: [
							{
								TargetOriginId: 'DmzAlbOrigin',
								PathPattern: '/api/*',
								ViewerProtocolPolicy: 'redirect-to-https',
								OriginRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3',
								CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
								AllowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
							},
						],
						Enabled: true,
						WebACLId: '${env:WEB_ACL_ID}',
					},
					Tags: tags,
				},
			},
			Alb: {
				Type: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
				Properties: {
					Name: {
						'Fn::Sub': '${self:service}-alb-${self:custom.stage}',
					},
					Scheme: 'internal',
					SecurityGroups: ['${self:custom.securityGroupId}'],
					Subnets: ['${self:custom.subnetId1}', '${self:custom.subnetId2}'],
					Tags: tags,
				},
			},
			Listener: {
				Type: 'AWS::ElasticLoadBalancingV2::Listener',
				Properties: {
					DefaultActions: [
						{
							Type: 'fixed-response',
							FixedResponseConfig: {
								ContentType: 'text/plain',
								MessageBody: 'Not found.',
								StatusCode: '404',
							},
						},
					],
					LoadBalancerArn: {
						Ref: 'Alb',
					},
					Port: 80,
					Protocol: 'HTTP',
				},
			},
		},
		Outputs: {
			PresignRoleArn: {
				Description: 'ARN of the presign role',
				Value: {
					'Fn::GetAtt': 'PresignRole.Arn',
				},
			},
			FrontendS3BucketName: {
				Description: 'Name of the frontend S3 bucket',
				Value: {
					Ref: 'FrontendS3Bucket',
				},
			},
			CloudFrontDistributionUrl: {
				Description: 'URL of the CloudFront distribution for the frontend',
				Value: {
					'Fn::Join': [
						'',
						[
							'https://',
							{
								'Fn::GetAtt': 'CloudFrontDistribution.DomainName',
							},
						],
					],
				},
			},
		},
	},
}

module.exports = serverlessConfiguration
