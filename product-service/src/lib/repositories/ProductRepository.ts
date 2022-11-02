import * as uuid from 'uuid';
import AWS from 'aws-sdk';
import {Product} from "../../types/api-types";

export class ProductRepository {
    constructor(
        private client: AWS.DynamoDB.DocumentClient,
        private table: string = 'Products',
        private stockTable: string = 'Stocks',
    ) {}

    private getProductPutRequest(product: Product) {
        return {
            Put: {
                Item: {
                    ...product,
                },
                TableName: this.table,
            },
        };
    }

    private getStockPutRequest(stockId: string, productId: string, count: number = 0) {
        return {
            Put: {
                Item: {
                    id: stockId,
                    productId,
                    count,
                },
                TableName: this.stockTable,
            },
        };
    }

    async GetProducts(): Promise<Product[]> {
        const result = await this.client
            .scan({
                TableName: this.table,
            })
            .promise();
        return result.Items as Product[];
    }

    async GetProduct(id: string): Promise<Product | undefined> {
        const result = await this.client
            .get({
                TableName: this.table,
                Key: { id },
            })
            .promise();

        return result.Item as Product;
    }

    async CreateProduct(product: Omit<Product, 'id'>, count: number = 0): Promise<Product> {
        const productId = uuid.v4();
        const stockId = uuid.v4();

        const productTransactItem = this.getProductPutRequest({...product, id: productId});
        const stockTransactItem = this.getStockPutRequest(stockId, productId, count);

        await this.client
            .transactWrite({
                TransactItems: [productTransactItem, stockTransactItem]
            })
            .promise();

        return {...product, id: productId, count: count};
    }
}
