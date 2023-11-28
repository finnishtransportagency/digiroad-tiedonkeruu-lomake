import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectTaggingCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Report, ReportJSON } from '../schema'

const s3client = new S3Client()

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
        'Content-Type': contentType,
        'Content-Encoding': encoding,
        reportId,
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

const getFile = async (bucket: string, objectKey: string): Promise<Report['files'][0] | null> => {
  const s3Response = await getObject(bucket, objectKey)
  const byteArray = await s3Response.Body?.transformToByteArray()

  if (!byteArray) return null

  return {
    filename: objectKey.substring(objectKey.indexOf('_') + 1),
    contentType: s3Response.Metadata?.['Content-Type'] ?? '',
    content: Buffer.from(byteArray),
    encoding: s3Response.Metadata?.['Content-Encoding'] ?? '',
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

const deleteObject = async (bucket: string, objectKey: string) => {
  await s3client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    })
  )
}

export default { putObject, getReportJSON, getFile, getTags, deleteObject }
