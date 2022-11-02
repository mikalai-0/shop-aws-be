import {Stock} from "../../types/api-types";
import AWS from 'aws-sdk';

export class StockRepository {
    constructor(
        private client: AWS.DynamoDB.DocumentClient,
        private table: string = 'Stocks',
    ) {}

    async GetStocks(): Promise<Stock[]> {
        const result = await this.client
            .scan({
                TableName: this.table,
            })
            .promise();
        return result.Items as Stock[];
    }

    async GetStockByProductId(productId: string): Promise<Stock | undefined> {
        const result = await this.client
            .get({
                TableName: this.table,
                Key: { productId },
            })
            .promise();

        return result.Item as Stock;
    }
}
