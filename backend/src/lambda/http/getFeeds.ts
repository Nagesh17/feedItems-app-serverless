import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getJwtToken } from '../../auth/utils'
import { getFeedList } from '../../businessLogic/feedService'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getFeeds')
export const handler=middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all feed items for a current user
  logger.info('Get all feed items for current user')
  const token= getJwtToken(event)
  const feedList = await getFeedList(token); 

  logger.info(`List of item: ${feedList}`);

  return {
        statusCode: 200,
        body: JSON.stringify({
            items: feedList
        })
  }
  
});

handler.use(
  cors({ credentials: true})
)
