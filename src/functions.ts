import {
    S3Client,
    CopyObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    HeadObjectOutput,
    PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export function copy(s3: S3Client, bucket: string, source: string, target: string) {
    const params = {
        Bucket: bucket,
        CopySource: `/${bucket}/${source}`,
        Key: target,
    }
    return s3.send(new CopyObjectCommand(params))
}

export async function deleteObject(s3: S3Client, bucket: string, key: string) {
    await copy(s3, bucket, key, 'deleted/' + key)
    const params = {
        Bucket: bucket,
        Key: key,
    }
    return s3.send(new DeleteObjectCommand(params))
}

export async function exists(s3: S3Client, bucket: string, key: string) {
    const params = {
        Bucket: bucket,
        Key: key,
    }

    try {
        await s3.send(new HeadObjectCommand(params))
        return true
    } catch (err: any) {
        if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NotFound') {
            return false
        }
        throw err
    }
}

export async function get(s3: S3Client, bucket: string, key: string) {
    const params = {
        Bucket: bucket,
        Key: key,
    }
    const data = await s3.send(new GetObjectCommand(params))
    return data.Body
}

export async function head(s3: S3Client, bucket: string, key: string): Promise<HeadObjectOutput | null> {
    const params = {
        Bucket: bucket,
        Key: key,
    }

    try {
        return await s3.send(new HeadObjectCommand(params))
    } catch (err: any) {
        if (err?.name === 'NotFound' || err?.$metadata?.httpStatusCode === 404) {
            return null
        }
        throw err
    }
}

export async function list(s3: S3Client, bucket: string, prefix: string, options = {}) {
    let state = {
        keys: [] as string[],
        isTruncated: true,
        nextParams: null as Record<string, any> | null,
    }

    while (state.isTruncated) {
        const opts = Object.assign({}, options, state.nextParams)
        const res = (await list1K(s3, bucket, prefix, opts)) as any
        state.keys = state.keys
            .concat(res.keys)
            .filter((e, i, arr) => arr.indexOf(e) === i)
        state.isTruncated = res.isTruncated
        state.nextParams = res.nextParams
    }

    return state.keys
}

export function list1K(s3: S3Client, bucket: string, prefix: string, options = {}) {
    const params = Object.assign(
        {
            Bucket: bucket,
            Prefix: prefix,
        },
        options
    )

    return s3.send(new ListObjectsV2Command(params)).then((data) => {
        const { ContinuationToken, KeyCount, IsTruncated, MaxKeys, NextContinuationToken } = data

        let nextParams = null
        if (IsTruncated) {
            nextParams = {
                ...params,
                ContinuationToken: NextContinuationToken,
            }
        }

        return {
            keys: data.Contents?.map((Content) => Content.Key),
            data: {
                ContinuationToken,
                KeyCount,
                MaxKeys,
            },
            keyCount: KeyCount,
            isTruncated: IsTruncated,
            nextParams,
        }
    })
}

export async function stream(s3: S3Client, bucket: string, key: string) {
    const params = {
        Bucket: bucket,
        Key: key,
    }
    const data = await s3.send(new GetObjectCommand(params))
    return data.Body
}

export function upload(s3: S3Client, bucket: string, key: string, file: any, options = {}) {
    const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: file,
        //ACL: 'private',
        ContentDisposition: 'inline',
        ...options,
    }
    return s3.send(new PutObjectCommand(params))
}

export function signedURL(s3: S3Client, bucket: string, key: string, expiresIn = 900) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    })
    return getSignedUrl(s3, command, { expiresIn })
}
