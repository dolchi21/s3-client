import AWS from 'aws-sdk'
import { Bucket, S3 } from './index'

async function main() {
    const bucket = new Bucket(new AWS.S3(), 'cobranzas')
}