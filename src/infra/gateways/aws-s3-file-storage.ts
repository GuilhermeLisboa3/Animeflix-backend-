import { UploadFile } from '@/domain/contracts/gateways'

import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile {
  constructor (accessKeyId: string, secretAccessKey: string, private readonly bucket: string) {
    config.update({ credentials: { accessKeyId, secretAccessKey } })
  }

  async upload ({ file, fileName }: UploadFile.Input): Promise<UploadFile.Output> {
    await new S3().upload({ Bucket: this.bucket, Body: file, Key: fileName, ACL: 'public-read' }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }
}
