import { errorResponse, successResponse } from "../../utils/apiResponseBuilder";
import {s3Client, BUCKET} from '../../utils/S3';

export const importProductsFileHandler = async (event) => {
    try {
        const { name } = event.queryStringParameters;

        if (!name) {
            return errorResponse( { name: 'Bad Request', message: `No name provided` }, 400 );
        }

        const uploadParams = {
            Bucket: BUCKET,
            Key: `uploaded/${name}`,
        };
        const signedUrl = await s3Client.getSignedUrl('putObject', uploadParams);

        return successResponse( signedUrl );
    }
    catch ( err ) {
        return errorResponse( err );
    }
};
