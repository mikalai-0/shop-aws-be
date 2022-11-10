import {S3} from 'aws-sdk';

export const s3Client = new S3();
export const BUCKET = 'cloudx-import';
export enum s3Folders {
    UPLOADED = 'uploaded',
    PARSED = 'parsed',
}
