import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectTaggingCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Report, ReportJSON } from '../schema'
import { s3ClientConfig } from '../config'

const s3client = new S3Client(s3ClientConfig)

const putObject = async (
  bucket: string,
  objectKey: string,
  contentType: string,
  objectBody: Buffer,
  encoding: string,
  reportId: string
) => {
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
}

const getObject = async (bucket: string, objectKey: string) => {
  return await s3client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    })
  )
}

const getReportJSON = async (bucket: string, objectKey: string): Promise<ReportJSON | null> => {
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
const getFile = async (bucket: string, objectKey: string): Promise<Report['files'][0] | null> => {
  const s3Response = await getObject(bucket, objectKey)
  const byteArray = await s3Response.Body?.transformToByteArray()

  if (!byteArray) {
    console.error('File not found: ', objectKey)
    return null
  }

  return {
    filename: objectKey.substring(objectKey.indexOf('_') + 1),
    contentType: s3Response.Metadata ? s3Response.Metadata['content-type'] : '',
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
const simulateGetTags = (reportJSON: ReportJSON) => {
  const value =
    reportJSON.description && reportJSON.description.includes('virus') ? 'virus' : 'clean'
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

export default { putObject, getReportJSON, getFile, getTags, simulateGetTags, deleteObject }
