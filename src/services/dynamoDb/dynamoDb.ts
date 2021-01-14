import * as AWSTypes from "aws-sdk";
import { AWS } from "../awsSdk";
import { config } from "../../config";

const dynamoClient = new AWS.DynamoDB.DocumentClient(config.dynamodb.client) as AWSTypes.DynamoDB.DocumentClient;

export const put = (params: AWS.DynamoDB.DocumentClient.PutItemInput) => dynamoClient.put(params).promise();
export const query = (params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<any> =>
  dynamoClient.query(params).promise();
export const get = (params: AWS.DynamoDB.DocumentClient.GetItemInput) => dynamoClient.get(params).promise();
export const deleteItem = (params: AWS.DynamoDB.DocumentClient.GetItemInput) => dynamoClient.delete(params).promise();
export const putItems = (a: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput) =>
  dynamoClient.transactWrite(a).promise();
export const scan = (params: AWS.DynamoDB.DocumentClient.ScanInput) => dynamoClient.scan(params).promise();
