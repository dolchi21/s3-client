import { Bucket } from './index'

const bucketName = process.env.BUCKET_NAME
const objectKey = process.env.TEST_OBJECT_KEY || 'test-object.txt'
const region = process.env.AWS_REGION || 'us-east-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

async function run() {
    if (!bucketName) {
        console.error('Error: set BUCKET_NAME environment variable')
        process.exit(1)
    }

    if (!accessKeyId || !secretAccessKey) {
        console.error('Error: set AWS_ACCESS_KEY_ID/AWS_KEY and AWS_SECRET_ACCESS_KEY/AWS_SECRET environment variables')
        process.exit(1)
    }
    const bucket = new Bucket({ accessKeyId, secretAccessKey, region }, bucketName)
    const metadata = await bucket.head(objectKey)

    if (!metadata) {
        console.log(`Bucket.head: object \"${objectKey}\" not found in bucket \"${bucketName}\"`)
        process.exit(1)
    }

    console.log(`Bucket.head: object \"${objectKey}\" exists in bucket \"${bucketName}\"`)
    console.log('Metadata:')
    console.log('  LastModified:', metadata.LastModified)
    console.log('  ContentLength:', metadata.ContentLength)
    console.log('  ETag:', metadata.ETag)
}

run().catch((error) => {
    console.error('Bucket.head test failed:')
    console.error(error)
    process.exit(1)
})
