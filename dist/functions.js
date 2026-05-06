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
exports.copy = copy;
exports.deleteObject = deleteObject;
exports.exists = exists;
exports.get = get;
exports.head = head;
exports.list = list;
exports.list1K = list1K;
exports.stream = stream;
exports.upload = upload;
exports.signedURL = signedURL;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
function copy(s3, bucket, source, target) {
    const params = {
        Bucket: bucket,
        CopySource: `/${bucket}/${source}`,
        Key: target,
    };
    return s3.send(new client_s3_1.CopyObjectCommand(params));
}
function deleteObject(s3, bucket, key) {
    return __awaiter(this, void 0, void 0, function* () {
        yield copy(s3, bucket, key, 'deleted/' + key);
        const params = {
            Bucket: bucket,
            Key: key,
        };
        return s3.send(new client_s3_1.DeleteObjectCommand(params));
    });
}
function exists(s3, bucket, key) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const params = {
            Bucket: bucket,
            Key: key,
        };
        try {
            yield s3.send(new client_s3_1.HeadObjectCommand(params));
            return true;
        }
        catch (err) {
            if (((_a = err === null || err === void 0 ? void 0 : err.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 404 || (err === null || err === void 0 ? void 0 : err.name) === 'NotFound') {
                return false;
            }
            throw err;
        }
    });
}
function get(s3, bucket, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const data = yield s3.send(new client_s3_1.GetObjectCommand(params));
        return data.Body;
    });
}
function head(s3, bucket, key) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const params = {
            Bucket: bucket,
            Key: key,
        };
        try {
            return yield s3.send(new client_s3_1.HeadObjectCommand(params));
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.name) === 'NotFound' || ((_a = err === null || err === void 0 ? void 0 : err.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 404) {
                return null;
            }
            throw err;
        }
    });
}
function list(s3_1, bucket_1, prefix_1) {
    return __awaiter(this, arguments, void 0, function* (s3, bucket, prefix, options = {}) {
        let state = {
            keys: [],
            isTruncated: true,
            nextParams: null,
        };
        while (state.isTruncated) {
            const opts = Object.assign({}, options, state.nextParams);
            const res = (yield list1K(s3, bucket, prefix, opts));
            state.keys = state.keys
                .concat(res.keys)
                .filter((e, i, arr) => arr.indexOf(e) === i);
            state.isTruncated = res.isTruncated;
            state.nextParams = res.nextParams;
        }
        return state.keys;
    });
}
function list1K(s3, bucket, prefix, options = {}) {
    const params = Object.assign({
        Bucket: bucket,
        Prefix: prefix,
    }, options);
    return s3.send(new client_s3_1.ListObjectsV2Command(params)).then((data) => {
        var _a;
        const { ContinuationToken, KeyCount, IsTruncated, MaxKeys, NextContinuationToken } = data;
        let nextParams = null;
        if (IsTruncated) {
            nextParams = Object.assign(Object.assign({}, params), { ContinuationToken: NextContinuationToken });
        }
        return {
            keys: (_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map((Content) => Content.Key),
            data: {
                ContinuationToken,
                KeyCount,
                MaxKeys,
            },
            keyCount: KeyCount,
            isTruncated: IsTruncated,
            nextParams,
        };
    });
}
function stream(s3, bucket, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const data = yield s3.send(new client_s3_1.GetObjectCommand(params));
        return data.Body;
    });
}
function upload(s3, bucket, key, file, options = {}) {
    const params = Object.assign({ Bucket: bucket, Key: key, Body: file, 
        //ACL: 'private',
        ContentDisposition: 'inline' }, options);
    return s3.send(new client_s3_1.PutObjectCommand(params));
}
function signedURL(s3, bucket, key, expiresIn = 900) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    return (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn });
}
//# sourceMappingURL=functions.js.map