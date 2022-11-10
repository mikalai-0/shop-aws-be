import { errorResponse, successResponse } from "../../utils/apiResponseBuilder";
import {s3Client, BUCKET, s3Folders} from '../../utils/S3';
import csv from 'csv-parser';

export const importFileParserHandler = async (event, _context) => {
    try {
        const { key } = event.Records[0].s3.object;

        const params = {
            Bucket: BUCKET,
            Key: key,
        };

        const csvStream = await s3Client.getObject(params).createReadStream();

        await new Promise((resolve, reject) => {
            csvStream.pipe(csv())
                .on('data', (chunk) => console.log(chunk))
                .on('error', reject)
                .on('end', resolve);
        });

        const copyParams = {
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: key.replace(s3Folders.UPLOADED, s3Folders.PARSED),
        };

        await s3Client.copyObject(copyParams).promise();
        await s3Client.deleteObject(params).promise();

        return successResponse( null, 202 );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}