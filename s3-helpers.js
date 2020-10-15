//@ts-check
const copy = exports.copy = function copy(s3, bucket, source, target) {
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

exports.delete = async function deleteObject(s3, bucket, key) {
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

exports.exists = function exists(s3, bucket, key) {
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

exports.get = function get(s3, bucket, key) {
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

exports.list = function list(s3, bucket, prefix, options = {}) {
    return new Promise((resolve, reject) => {
        var params = Object.assign({
            Bucket: bucket,
            Prefix: prefix
        }, options)
        return s3.listObjectsV2(params, (err, data) => {
            if (err) return reject(err)

            var { ContinuationToken, KeyCount, IsTruncated, MaxKeys, NextContinuationToken } = data

            if (IsTruncated) {
                var nextParams = Object.assign({}, params, {
                    ContinuationToken: NextContinuationToken
                })
            }

            var res = {
                keys: data.Contents.map(Content => Content.Key),
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

exports.stream = function stream(s3, bucket, key) {
    var params = {
        Bucket: bucket,
        Key: key
    }
    return s3.getObject(params).createReadStream()
}

exports.upload = function upload(s3, bucket, key, file, options = {}) {
    var mime = require('mime-types')

    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: key,
            Body: file,
            ACL: options.ACL || 'authenticated-read',
            ContentDisposition: options.ContentDisposition || 'inline',
            ContentType: options.ContentType || mime.lookup(key)
        }
        return s3.upload(params, function (err, data) {
            if (err) return reject(err)
            return resolve(data)
        })
    })
}