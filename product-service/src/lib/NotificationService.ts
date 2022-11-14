import { Product } from '../types/api-types';

export class NotificationService {
    constructor(
        private client: AWS.SNS,
        private TopicArn = process.env.SNS_ARN,
    ) {}

    async publish<T = Product>(
        items: T[],
        Subject: string,
        message: string,
        MessageAttributes?: AWS.SNS.MessageAttributeMap,
    ) {
        return new Promise((resolve, reject) => {
            this.client.publish({
                Subject,
                MessageAttributes,
                Message: `${message}: ${JSON.stringify(items)}`,
                TopicArn: this.TopicArn,
            },
            (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

// MessageAttributes: {
//     price: {
//         DataType: "Number",
//             StringValue: `${minPrice}`
//     }
// },
