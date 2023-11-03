import { APIGatewayEvent } from 'aws-lambda'
import busboy from 'busboy'

interface File {
  filename: string
  content?: Buffer
  contentType: string
  encoding: string
  fieldname: string
}

/**
 * This module will parse the multipart-form containing files and fields from the lambda event object.
 * @param event an event containing the multipart/form-data in the body
 * @return a JSON object containing unknown fields and a known field 'files' containing an array of files
 */
const parse = (event: APIGatewayEvent): Promise<{ files: Array<File>; [key: string]: unknown }> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type'],
      },
    })

    const result: { files: File[] } = {
      files: [],
    }

    const additionalProperties: Record<string, string> = {}

    bb.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info
      const uploadFile: File = {
        filename: '',
        contentType: '',
        encoding: '',
        fieldname: '',
      }

      file.on('data', data => {
        uploadFile.content = data
      })

      file.on('end', () => {
        if (uploadFile.content) {
          uploadFile.filename = filename
          uploadFile.contentType = mimeType
          uploadFile.encoding = encoding
          uploadFile.fieldname = fieldname
          result.files.push(uploadFile)
        }
      })
    })

    bb.on('field', (fieldname, value) => {
      additionalProperties[fieldname] = value
    })

    bb.on('error', error => {
      reject(error)
    })

    bb.on('close', () => {
      const finalResult = { ...result, ...additionalProperties }
      resolve(finalResult)
    })

    const encoding = event.isBase64Encoded ? 'base64' : 'binary'

    bb.write(event.body, encoding)
    bb.end()
  })
}

export default parse
