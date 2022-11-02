import * as AWS from 'aws-sdk';
import {ProductRepository} from "./ProductRepository";
import {StockRepository} from "./StockRepository";

const client = new AWS.DynamoDB.DocumentClient();

const productRepository = new ProductRepository(client);
const stockRepository = new StockRepository(client);
export { productRepository, stockRepository };
