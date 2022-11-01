const products = require('./assets/products.json');
const stocks = require('./assets/stocks.json');

let AWS = require('aws-sdk');

const productsRequest = products.map(({ id, title, description, price }) => ({
    PutRequest: {
        Item: {
            id: { S: id },
            title: { S: title },
            description: { S: description },
            price: { N: price.toString() }
        }
    }
}));

const stocksRequest = stocks.map(({ id, productId, count }) => ({
    PutRequest: {
        Item: {
            id: { S: id },
            productId: { S: productId },
            count: { N: count.toString() }
        }
    }
}));

AWS.config.update({ region: "eu-west-1" });
const DynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const handler = function (err, data) {
    if (err) {
        console.log("Import Error", err)
    }
    else {
        console.log("Import Success", data)
    }
};

DynamoDB.batchWriteItem({
    RequestItems: {
        Products: [...productsRequest]
    }
}, handler);

DynamoDB.batchWriteItem({
    RequestItems: {
        Stocks: [...stocksRequest]
    }
}, handler);
