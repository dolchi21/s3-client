import * as Functions from './functions'
export class Bucket {
    bucket: string
    s3: AWS.S3
    constructor(s3: AWS.S3, bucket: string) {
        this.s3 = s3
        this.bucket = bucket
    }
    delete(key: string) {
        return Functions.deleteObject(this.s3, this.bucket, key)
    }
    exists(key: string) {
        return Functions.exists(this.s3, this.bucket, key)
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
    upload(key: string, file: any, options?: {}) {
        return Functions.upload(this.s3, this.bucket, key, file, options)
    }
    signedURL(key: string) {
        return Functions.signedURL(this.s3, this.bucket, key)
    }
    stream(key: string) {
        return Functions.stream(this.s3, this.bucket, key)
    }
}

export const S3 = Functions