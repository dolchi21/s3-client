import AWS from 'aws-sdk'
import { Bucket, S3 } from './index'

async function main() {
    const bucket = new Bucket(new AWS.S3(), 'file-forwarder-charlie')
    const res = await bucket.list('bkp/2021/01/29/ADB')
    const keys = await Promise.all(res.map(async (e: string) => {
        const info = await bucket.head(e)
        if (info?.Metadata?.key) {
            const info2 = await bucket.get(info?.Metadata?.key)
            return info2
        }
        return info
    }))
    console.log(res, keys)
}

main()
