"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = exports.Bucket = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const Functions = __importStar(require("./functions"));
class Bucket {
    constructor(s3, bucket) {
        if (typeof s3 === 'object' && 'accessKeyId' in s3) {
            this.s3 = new client_s3_1.S3Client(s3);
        }
        else {
            this.s3 = s3;
        }
        this.bucket = bucket;
    }
    delete(key) {
        return Functions.deleteObject(this.s3, this.bucket, key);
    }
    get(key) {
        return Functions.get(this.s3, this.bucket, key);
    }
    head(key) {
        return Functions.head(this.s3, this.bucket, key);
    }
    list(prefix, options) {
        return Functions.list(this.s3, this.bucket, prefix, options);
    }
    upload(key, file) {
        return Functions.upload(this.s3, this.bucket, key, file);
    }
}
exports.Bucket = Bucket;
exports.S3 = Functions;
//# sourceMappingURL=index.js.map