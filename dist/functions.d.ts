import { S3Client, HeadObjectOutput } from '@aws-sdk/client-s3';
export declare function copy(s3: S3Client, bucket: string, source: string, target: string): Promise<import("@aws-sdk/client-s3").CopyObjectCommandOutput>;
export declare function deleteObject(s3: S3Client, bucket: string, key: string): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
export declare function exists(s3: S3Client, bucket: string, key: string): Promise<boolean>;
export declare function get(s3: S3Client, bucket: string, key: string): Promise<import("@smithy/types").StreamingBlobPayloadOutputTypes | undefined>;
export declare function head(s3: S3Client, bucket: string, key: string): Promise<HeadObjectOutput | null>;
export declare function list(s3: S3Client, bucket: string, prefix: string, options?: {}): Promise<string[]>;
export declare function list1K(s3: S3Client, bucket: string, prefix: string, options?: {}): Promise<{
    keys: (string | undefined)[] | undefined;
    data: {
        ContinuationToken: string | undefined;
        KeyCount: number | undefined;
        MaxKeys: number | undefined;
    };
    keyCount: number | undefined;
    isTruncated: boolean | undefined;
    nextParams: {
        ContinuationToken: string | undefined;
        Bucket: string;
        Prefix: string;
    } | null;
}>;
export declare function stream(s3: S3Client, bucket: string, key: string): Promise<import("@smithy/types").StreamingBlobPayloadOutputTypes | undefined>;
export declare function upload(s3: S3Client, bucket: string, key: string, file: any, options?: {}): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
//# sourceMappingURL=functions.d.ts.map