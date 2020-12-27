import AWS from 'aws-sdk'

export function copy(s3: AWS.S3, bucket: string, source: string, target: string) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucket,
            CopySource: `/${bucket}/${source}`,
            Key: target,
        }
        s3.copyObject(params, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export async function deleteObject(s3: AWS.S3, bucket: string, key: string) {
    await copy(s3, bucket, key, 'deleted/' + key)
    const params = {
        Bucket: bucket,
        Key: key
    }
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export function exists(s3: AWS.S3, bucket: string, key: string) {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: key
        }
        s3.headObject(params, function cb(err, data) {
            if (err) {
                switch (err.statusCode) {
                    case 404:
                        return resolve(false)
                    default:
                        return reject(err)
                }
            }

            return !data ? resolve(false) : resolve(true)

        })
    })
}

export function get(s3: AWS.S3, bucket: string, key: string) {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: key
        }
        s3.getObject(params, (err, data) => {
            if (err) return reject(err)
            return resolve(data.Body)
        })
    })
}

export function head(s3: AWS.S3, bucket: string, key: string) {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: key
        }
        s3.headObject(params, (err, data) => {
            if (err) {
                switch (err.code) {
                    case 'NotFound':
                        return resolve(null)
                    default:
                        return reject(err)
                }
            }
            return resolve(data)
        })
    })
}

export function list(s3: AWS.S3, bucket: string, prefix: string, options = {}) {
    return new Promise((resolve, reject) => {
        var params = Object.assign({
            Bucket: bucket,
            Prefix: prefix
        }, options)
        return s3.listObjectsV2(params, (err, data) => {
            if (err) return reject(err)

            var { ContinuationToken, KeyCount, IsTruncated, MaxKeys, NextContinuationToken } = data

            let nextParams
            if (IsTruncated) {
                nextParams = {
                    ...params,
                    ContinuationToken: NextContinuationToken
                }
            }

            var res = {
                keys: data.Contents?.map(Content => Content.Key),
                data: {
                    ContinuationToken,
                    KeyCount, MaxKeys
                },
                keyCount: KeyCount,
                isTruncated: IsTruncated,
                nextParams
            }

            resolve(res)
        })
    })
}

export function stream(s3: AWS.S3, bucket: string, key: string) {
    var params = {
        Bucket: bucket,
        Key: key
    }
    return s3.getObject(params).createReadStream()
}

export function upload(s3: AWS.S3, bucket: string, key: string, file: any, options = {}) {
    return new Promise((resolve, reject) => {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucket,
            Key: key,
            Body: file,
            ACL: 'authenticated-read',
            ContentDisposition: 'inline',
            ...options
        }
        return s3.upload(params, function (err, data) {
            if (err) return reject(err)
            return resolve(data)
        })
    })
}