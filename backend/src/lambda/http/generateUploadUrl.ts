import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUploadUrl } from '../../businessLogic/feedService'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const feedId = event.pathParameters.feedId
  logger.info(`Generating s3 signed url for upload - ${feedId}`)
  // get the pre-signed url from S3 by feedId:
  const url = getUploadUrl(feedId);   

  return {
      statusCode: 200,
      body: JSON.stringify({
          uploadUrl: url, 
      })
  }
});

handler.use(
  cors({ credentials: true})
)
