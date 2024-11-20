import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	GetObjectTaggingCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { offlineVirusTag, s3ClientConfig } from '../config'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Attachment, Report } from '../types'

const s3client = new S3Client(s3ClientConfig)

const getPresignedPostUrl = async (
	bucket: string,
	fileName: string,
	reportId: string
	// contentType: string
	// checksum: string // TODO: Add MD5 hash check to the conditions for more security
) =>
	await createPresignedPost(s3client, {
		Bucket: bucket,
		Key: `attachments/${reportId}/${fileName}`,
		Conditions: [
			{ bucket },
			['starts-with', '$key', `attachments/${reportId}/`],
			// { 'Content-MD5': checksum },
			['content-length-range', 1024, 10485760], // file size limit 1KB-10MB
			// ['starts-with', '$Content-Type', contentType],
		],
		// Fields: { 'Content-MD5': checksum },
		Expires: 30, // Seconds before the presigned post expires. 3600 by default.
	})

const putObject = async (
	bucket: string,
	objectKey: string,
	contentType: string,
	objectBody: Buffer,
	encoding: string,
	reportId: string
) =>
	await s3client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: objectKey,
			Body: objectBody,
			Metadata: {
				'content-type': contentType,
				'content-encoding': encoding,
				reportid: reportId,
			},
		})
	)

const getObject = async (bucket: string, objectKey: string) =>
	await s3client.send(
		new GetObjectCommand({
			Bucket: bucket,
			Key: objectKey,
		})
	)

const getReportJSON = async (bucket: string, objectKey: string): Promise<Report | null> => {
	const s3Response = await getObject(bucket, objectKey)
	const objectBody = await s3Response.Body?.transformToString()
	// TODO: Implement validation in schema.ts for JSON response
	return objectBody ? JSON.parse(objectBody) : null
}

/**
 * @param bucket Name of s3 bucket
 * @param objectKey Name of the file in s3 bucket
 * @returns Object with file name, content type, encoding and data as Buffer | null if file is not found
 */
const getFile = async (bucket: string, objectKey: string): Promise<Attachment | null> => {
	const s3Response = await getObject(bucket, objectKey)
	const byteArray = await s3Response.Body?.transformToByteArray()

	if (!byteArray) {
		console.error(`File not found: ${objectKey}\nFrom bucket: ${bucket}`)
		return null
	}

	return {
		filename: objectKey.substring(objectKey.indexOf('_') + 1),
		contentType: s3Response.Metadata ? s3Response.Metadata['content-type'] : undefined,
		content: Buffer.from(byteArray),
		encoding: s3Response.Metadata ? s3Response.Metadata['content-encoding'] : '',
	}
}

const getTags = async (bucket: string, objectKey: string) => {
	const objectTags = await s3client.send(
		new GetObjectTaggingCommand({
			Bucket: bucket,
			Key: objectKey,
		})
	)

	return objectTags.TagSet ?? []
}

/**
 * For local testing with s3rver.
 */
const simulateGetTags = () => {
	const value = offlineVirusTag ? 'virus' : 'clean'
	return [{ Key: 'viruscan', Value: value }]
}

const deleteObject = async (bucket: string, objectKey: string) => {
	await s3client.send(
		new DeleteObjectCommand({
			Bucket: bucket,
			Key: objectKey,
		})
	)
}

export default {
	getPresignedPostUrl,
	putObject,
	getReportJSON,
	getFile,
	getTags,
	simulateGetTags,
	deleteObject,
}
