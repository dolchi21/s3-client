import { S3Client } from '@aws-sdk/client-s3';
import * as Functions from './functions';
type S3Config = {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
};
export declare class Bucket {
    bucket: string;
    s3: S3Client;
    constructor(s3: S3Client | S3Config, bucket: string);
    delete(key: string): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    exists(key: string): Promise<boolean>;
    copy(key: string, target: string): Promise<import("@aws-sdk/client-s3").CopyObjectCommandOutput>;
    get(key: string): Promise<import("@smithy/types").StreamingBlobPayloadOutputTypes | undefined>;
    head(key: string): Promise<import("@aws-sdk/client-s3").HeadObjectOutput | null>;
    list(prefix: string, options?: {}): Promise<string[]>;
    upload(key: string, file: any, options?: {}): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    signedURL(key: string): any;
    stream(key: string): Promise<import("@smithy/types").StreamingBlobPayloadOutputTypes | undefined>;
}
export declare const S3: typeof Functions;
export {};
//# sourceMappingURL=index.d.ts.map