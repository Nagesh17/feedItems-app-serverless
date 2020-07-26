import 'source-map-support/register'
import { updateFeedItem } from '../../businessLogic/feedService'
import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { UpdateFeedRequest } from '../../requests/UpdateFeedRequest'
import { getJwtToken } from '../../auth/utils'

const logger = createLogger('UpdateFeed');
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const feedId = event.pathParameters.feedId
  const updatedFeed: UpdateFeedRequest = JSON.parse(event.body)
  // TODO: Update a FEED item with the provided id using values in the "updatedFeed" object
  logger.info(`Update Feed Item- ${updatedFeed}`);
  const jwtToken = getJwtToken(event)
  // update feed item from business logic layer: 
  await updateFeedItem(jwtToken, feedId, updatedFeed)

  return {
      statusCode: 200, 
      body: 'Sucessfully updated!'
  }
});

handler.use(
  cors({ credentials: true})
)