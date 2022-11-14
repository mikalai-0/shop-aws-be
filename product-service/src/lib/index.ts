import AWS from 'aws-sdk';
import { NotificationService } from './NotificationService';

const SNSClient = new AWS.SNS();

export const notificationService = new NotificationService(SNSClient);
