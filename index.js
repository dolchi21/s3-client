//@ts-check
const H = require('./s3-helpers')

module.exports = function S3Wrapper(s3) {
    return {
        get: H.get.bind(null, s3),
        exists: H.exists.bind(null, s3),
        list: H.list.bind(null, s3),
        stream: H.stream.bind(null, s3),
        upload: H.upload.bind(null, s3),
        bucket: Bucket.bind(null, s3)
    }
}
function Bucket(s3, bucketName) {
    return {
        get: H.get.bind(null, s3, bucketName),
        exists: H.exists.bind(null, s3, bucketName),
        list: H.list.bind(null, s3, bucketName),
        stream: H.stream.bind(null, s3, bucketName),
        upload: H.upload.bind(null, s3, bucketName)
    }
}