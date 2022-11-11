import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { productRepository } from "../../lib/repositories";
import { notificationService } from '../../lib';

export const catalogBatchProcessHandler = async (event: SQSEvent) => {
    try {
        const products = event.Records
            .map(({ body }) => {
                return JSON.parse(body);
            })
            .filter((product) => {
                if (!product.title || !product.price) {
                    console.log('Product is invalid', product);
                    return false;
                }
                return true;
            });

        if (!products.length) {
            console.log('No valid products');
            return;
        }

        for (const item of products) {
            const { title, description, count, price } = item;
            const product = { title, description, price: Number(price) };
            await productRepository.CreateProduct(product, Number(count) || undefined);
        }

        console.log('New products', products);

        try {
            const minPrice = Math.min(...products.map(item => item.price));
            const MessageAttributes = {
                    price: {
                        DataType: 'Number',
                        StringValue: minPrice.toString(),
                    }
                };

            const result = await notificationService.publish(
                products,
                'New products have been created',
                'Products created',
                MessageAttributes,
            );
            console.log('Topic published SUCCESS', result);
        } catch (error) {
            console.log('Topic published ERROR', error);
        }
    } catch (error) {
        console.log(`something went wrong: ${error}`);
    }
};
