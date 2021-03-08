/* eslint-disable no-param-reassign */
import { HttpError } from "http-errors";
import middy from "@middy/core";
import { getLogger } from "../../common/logger";

interface OnlyAuthorizedOperatorSessionMiddleware<T, R> extends middy.MiddlewareObject<T, R> {
  after: middy.MiddlewareFunction<T, R>;
  onError: middy.MiddlewareFunction<T, R>;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

export const withBoundary = (): OnlyAuthorizedOperatorSessionMiddleware<any, any> => ({
  after: async handler => {
    const { response } = handler;

    if (response !== undefined) {
      handler.response = {
        headers,
        statusCode: 200,
        body: JSON.stringify(response)
      };
    } else {
      handler.response = {
        headers,
        statusCode: 200
      };
    }
  },
  onError: async handler => {
    const { context, event } = handler;

    // Using Partial below in case something other than Error object is thrown (should not happen)
    const thrownError = handler.error as Partial<HttpError>;

    const { name, message, stack, statusCode } = thrownError;

    // Setting expected if it's a http-error so we can filter out unexpected exceptions
    // Similar to how middy's httpErrorHandler does it: https://github.com/middyjs/middy/blob/master/src/middlewares/httpErrorHandler.js
    const expected = !!(thrownError.statusCode && thrownError.message);
    const exposed = thrownError.expose || false;

    const { functionName } = context;
    const requestId = context.awsRequestId;
    const sourceIp = event?.requestContext?.identity?.sourceIp;
    const { error } = getLogger(functionName);
    error(
      JSON.stringify({
        name,
        message,
        exposed,
        stack,
        functionName,
        requestId,
        sourceIp,
        expected
      })
    );

    // Returning Internal Server error if error is not thrown by us
    // For known errors, we send 400 and error message if error message is to be exposed
    switch (true) {
      case expected && exposed:
        handler.response = {
          statusCode,
          body: JSON.stringify({
            requestId,
            message
          }),
          headers
        };
        break;
      case expected && !exposed:
        handler.response = {
          statusCode,
          body: JSON.stringify({
            requestId
          }),
          headers
        };
        break;
      default:
        handler.response = {
          statusCode: 500,
          body: JSON.stringify({
            requestId
          }),
          headers
        };
    }
  }
});
