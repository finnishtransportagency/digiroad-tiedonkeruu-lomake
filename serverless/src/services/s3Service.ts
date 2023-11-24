import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectTaggingCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

const s3client = new S3Client()

const putObject = async (
  bucket: string,
  objectKey: string,
  objectBody: Buffer,
  tags: Record<string, string>
) => {
  await s3client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: objectBody,
      Tagging: Object.entries(tags)
        .map(([key, value]) => `${key}=${value}`)
        .join('&'),
    })
  )
}

const getObject = async (bucket: string, objectKey: string) => {
  const ObjectBody = await s3client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    })
  )

  return ObjectBody.Body
}

const getTags = async (bucket: string, objectKey: string) => {
  const ObjectTags = await s3client.send(
    new GetObjectTaggingCommand({
      Bucket: bucket,
      Key: objectKey,
    })
  )

  return ObjectTags.TagSet
}

const deleteObject = async (bucket: string, objectKey: string) => {
  await s3client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    })
  )
}

export default { putObject, getObject, getTags, deleteObject }
