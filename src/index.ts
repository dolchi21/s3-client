import { S3Client } from '@aws-sdk/client-s3'
import * as Functions from './functions'

type S3Config = {
    accessKeyId: string
    secretAccessKey: string
    region: string
}

export class Bucket {
    bucket: string
    s3: S3Client

    constructor(s3: S3Client | S3Config, bucket: string) {
        if (typeof s3 === 'object' && 'accessKeyId' in s3) {
            this.s3 = new S3Client(s3)
        } else {
            this.s3 = s3
        }
        this.bucket = bucket
    }
    delete(key: string) {
        return Functions.deleteObject(this.s3, this.bucket, key)
    }
    get(key: string) {
        return Functions.get(this.s3, this.bucket, key)
    }
    head(key: string) {
        return Functions.head(this.s3, this.bucket, key)
    }
    list(prefix: string, options?: {}) {
        return Functions.list(this.s3, this.bucket, prefix, options)
    }
    upload(key: string, file: any) {
        return Functions.upload(this.s3, this.bucket, key, file)
    }
}

export const S3 = Functions