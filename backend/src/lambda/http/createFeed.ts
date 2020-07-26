import 'source-map-support/register'

import { APIGatewayProxyEvent,  APIGatewayProxyResult } from 'aws-lambda'

import { CreateFeedRequest } from '../../requests/CreateFeedRequest'
import { createLogger } from '../../utils/logger'
import { getJwtToken } from '../../auth/utils'
import { createFeed } from '../../businessLogic/feedService'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createFeed')
export const handler=middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newFeed: CreateFeedRequest = JSON.parse(event.body)
  logger.info(`Creating new feed item- ${newFeed}`)
  
  const jwtToken = getJwtToken(event)
  const newItem = await createFeed(newFeed, jwtToken)
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
});

handler.use(
  cors({ credentials: true})
)