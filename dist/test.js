"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const bucketName = process.env.BUCKET_NAME;
const objectKey = process.env.TEST_OBJECT_KEY || 'test-object.txt';
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!bucketName) {
            console.error('Error: set BUCKET_NAME environment variable');
            process.exit(1);
        }
        if (!accessKeyId || !secretAccessKey) {
            console.error('Error: set AWS_ACCESS_KEY_ID/AWS_KEY and AWS_SECRET_ACCESS_KEY/AWS_SECRET environment variables');
            process.exit(1);
        }
        const bucket = new index_1.Bucket({ accessKeyId, secretAccessKey, region }, bucketName);
        const metadata = yield bucket.head(objectKey);
        if (!metadata) {
            console.log(`Bucket.head: object \"${objectKey}\" not found in bucket \"${bucketName}\"`);
            process.exit(1);
        }
        console.log(`Bucket.head: object \"${objectKey}\" exists in bucket \"${bucketName}\"`);
        console.log('Metadata:');
        console.log('  LastModified:', metadata.LastModified);
        console.log('  ContentLength:', metadata.ContentLength);
        console.log('  ETag:', metadata.ETag);
    });
}
run().catch((error) => {
    console.error('Bucket.head test failed:');
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=test.js.map