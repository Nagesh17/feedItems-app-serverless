import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {deleteFeedItem } from '../../businessLogic/feedService'
import { getJwtToken } from '../../auth/utils'

const logger = createLogger('deleteFeed')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const feedId = event.pathParameters.feedId
  logger.info(`Deleting FEED item with itemId - ${feedId}`)
  const token= getJwtToken(event)

  await deleteFeedItem(token, feedId); 
  return {
    statusCode: 200, 
    body: 'Sucessfully deleted!'
}

});

handler.use(
  cors({ credentials: true})
)
