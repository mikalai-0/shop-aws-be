import {SQSEvent} from 'aws-lambda';
import {catalogBatchProcessHandler} from './catalogBatchProcess';
import {Product} from '../../types/api-types';
import {productRepository} from '../../lib/repositories';
import {notificationService} from '../../lib';

const mockedProduct: Product = {
    id: '1',
    title: 'title1',
    description: 'description1',
    price: 1,
    count: 1,
};

const mockedProducts: Omit<Product, 'id'>[] = [
    {
        title: 'title1',
        description: 'description1',
        price: 1,
        count: 1,
    },
    {
        title: 'title2',
        description: 'description2',
        price: 2,
        count: 2,
    }
];

const Records = mockedProducts.map((product) => {
    return {
        body: JSON.stringify(product),
    };
});

const InvalidRecords = mockedProducts.map((product) => {
    const { title, ...rest } = product;
    return {
        body: JSON.stringify(rest),
    };
});

jest.mock('../../lib/index', () => {
    return {
        __esModule: true,
        notificationService: {
            publish: jest.fn()
        },
    };
});

jest.mock('../../lib/repositories/index', () => {
    const originalModule = jest.requireActual('../../lib/repositories/index');

    return {
        __esModule: true,
        ...originalModule,
        productRepository: {
            CreateProduct: jest.fn()
                .mockImplementation(() => Promise.resolve(mockedProduct))
        },
    };
});

describe('catalogBatchProcess', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create and publish products from SQS event', async () => {
        const productSpy = jest.spyOn(productRepository, 'CreateProduct');
        const notificationSpy = jest.spyOn(notificationService, 'publish');

        await catalogBatchProcessHandler({
            Records,
        } as SQSEvent);

        expect(productSpy).toBeCalledTimes(
            mockedProducts.length
        );
        expect(notificationSpy).toBeCalledTimes(1);
    });

    it('should not create and publish products when events invalid', async () => {
        const productSpy = jest.spyOn(productRepository, 'CreateProduct');
        const notificationSpy = jest.spyOn(notificationService, 'publish');

        await catalogBatchProcessHandler({
            Records: InvalidRecords,
        } as SQSEvent);

        expect(productSpy).not.toBeCalled();
        expect(notificationSpy).not.toBeCalled();
    });

    it('should create and publish only valid products from SQS event', async () => {
        const productSpy = jest.spyOn(productRepository, 'CreateProduct');
        const notificationSpy = jest.spyOn(notificationService, 'publish');

        await catalogBatchProcessHandler({
            Records: [...InvalidRecords, ...Records],
        } as SQSEvent);

        expect(productSpy).toBeCalledTimes(
            mockedProducts.length
        );
        expect(notificationSpy).toBeCalledWith(
            mockedProducts,
            'New products have been created',
            'Products created',
            {
                price: {
                    DataType: 'Number',
                    StringValue: '1',
                }
            },
        );
    });
});