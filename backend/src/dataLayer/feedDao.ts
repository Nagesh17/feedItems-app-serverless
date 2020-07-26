import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { FeeedItem } from '../models/FeedItem'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import { FeedUpdate } from '../models/FeedUpdate'
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

const logger = createLogger('feedDao')
const bucketName= process.env.FEED_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
export class FeedDao {

    constructor(
      // document client work with DynamoDB locally: 
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      // name of table to store /groups
      private readonly feedsTable = process.env.FEED_TABLE,
      private readonly indexTable = process.env.USER_ID_INDEX
    ) {}

    // get feeds list based on userId
    // feeds list is an array so return FeedItem[]
    async getFeeds(userId: string): Promise<FeeedItem[]> {
        logger.info(`Fetching Feed item from user ${userId}`);

        // use query() instead of scan(): 
        const result = await this.docClient.query({
            TableName: this.feedsTable, 
            IndexName: this.indexTable, 
            KeyConditionExpression: 'userId = :userId', 
            ExpressionAttributeValues: { ':userId': userId },
            ScanIndexForward: false 
        }).promise()

        // return feeds as array of objects
        const feeds = result.Items;
        return feeds as FeeedItem[]
    }
    
    // insert new item into Feeds talbe:
    // match with FeedItem model:  
    async createFeed(feed: FeeedItem): Promise<FeeedItem> {
        logger.info(`feedDao: Saving new ${feed.name} into ${this.feedsTable}`)

        await this.docClient.put({
            TableName: this.feedsTable,
            Item: feed
        }).promise()

        return feed as FeeedItem
    }

    // update feed item based on userId and feedId
    async updateFeed(userId: string, feedId: string, feedItem: FeedUpdate) {
        logger.info(`Update feed with name ${feedItem.name} of user ${userId}`);

        await this.docClient.update({
            TableName: this.feedsTable, 
            // Update with key: 
            Key: {
                userId, 
                feedId: feedId, 
            }, 
            UpdateExpression: 
                'set #name = :name, #description = :description',
            ExpressionAttributeValues: {
                ':name': feedItem.name,
                ':description': feedItem.description
            }, 
            ExpressionAttributeNames: {
                '#name': 'name', 
                '#description': 'description' 
            }
        }).promise()
    }

    // delete feed item created by userId with feedId: 
    async deleteFeed(userId: string, feedId: string) {
        logger.info(`Delete item with id ${feedId}`); 

        await this.docClient.delete({
            TableName: this.feedsTable, 
            // delete based on Key: userId and feedId: 
            Key: { "userId": userId, "feedId": feedId }
        }).promise()
    }

    getUploadUrl(feedId: string){
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: feedId, 
            Expires: urlExpiration
        })
    }
}