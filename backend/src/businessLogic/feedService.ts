import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { CreateFeedRequest } from '../requests/CreateFeedRequest'
import { FeeedItem } from '../models/FeedItem'
import { parseUserId } from '../auth/utils' // get userId from jwt token
import { FeedDao } from '../dataLayer/feedDao'
import { UpdateFeedRequest } from '../requests/UpdateFeedRequest'


const logger = createLogger('feedService')
const bucketName= process.env.FEED_S3_BUCKET

// initialize new object from FeedAcces class: 
const feedDao = new FeedDao()

// find feed list by userId from JwtToken
export async function getFeedList(jwtToken: string): Promise<FeeedItem[]> {
    logger.info('FeedService: Processing Get FeedList')
    const userId = parseUserId(jwtToken); 
    return feedDao.getFeeds(userId);
}

// create feed with corresponding userId: 
export async function createFeed(
    newFeed: CreateFeedRequest, 
    jwtToken: string
): Promise<FeeedItem> {

    const itemId = uuid.v4() // generate unique feed id: 
    const userId = parseUserId(jwtToken) // return userId

    logger.info(`Service: Create Feed for user ${userId}`)
    const imageUrl= `https://${bucketName}.s3.amazonaws.com/${itemId}`
    
    // const dateString = new Date().toDateString();
    return await feedDao.createFeed({
        userId, 
        feedId: itemId,
        createdAt: new Date().toDateString(),
        ...newFeed, // name and dueDate
        attachmentUrl: imageUrl
    }) as FeeedItem
}

// update Feed Item with userId and feedId: 
export async function updateFeedItem(
    jwtToken: string, 
    feedId: string,
    updateFeedItem: UpdateFeedRequest,
) {
    await feedDao.updateFeed(parseUserId(jwtToken), feedId, updateFeedItem);
}

// delete feed item with userId and feedid:
export async function deleteFeedItem(
    jwtToken: string,
    feedId: string,
) {
    await feedDao.deleteFeed(parseUserId(jwtToken), feedId);
}

export function getUploadUrl(feedId: string){
    logger.info(`Generating s3 signed url for FeedItemId - ${feedId}`)
    return feedDao.getUploadUrl(feedId)
}