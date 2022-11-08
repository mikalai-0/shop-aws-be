import {importProductsFileHandler} from './importProductsFile';

const INVALID_EVENT = {
    queryStringParameters: {},
};

const VALID_EVENT = {
    queryStringParameters: {
        name: 'test.csv',
    },
};

const testUrl = 'https://test.test';

jest.mock('../../utils/S3', () => {
    const originalModule = jest.requireActual('../../utils/S3');

    return {
        __esModule: true,
        ...originalModule,
        s3Client: {
            getSignedUrl: jest.fn()
                .mockImplementationOnce(() => {throw new Error()})
                .mockImplementationOnce(() => testUrl)
        },
    };
});

describe('importProductsFile', () => {
    it('should return 400 status when incorrect params', async () => {
        const result = await importProductsFileHandler(INVALID_EVENT);

        expect(result.statusCode).toBe(400);
    });

    it('should return 500 status when error occurred', async () => {
        const result = await importProductsFileHandler(VALID_EVENT);

        expect(result.statusCode).toBe(500);
    });

    it('should return 200 status and signed url', async () => {
        const result = await importProductsFileHandler(VALID_EVENT);

        expect(result.statusCode).toBe(200);
        expect(result.body.replace(/"/g, '')).toEqual(testUrl);
    });
});
