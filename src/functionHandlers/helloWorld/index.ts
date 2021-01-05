import { APIGatewayEvent } from "aws-lambda";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getLogger } from "../../common/logger";

const logger = getLogger("helloWorld");

const handleHelloWorld = async (event: APIGatewayEvent) => {
  logger.info(event);
  return { foo: "bar" };
};

export const handler = publicRequestHandler(handleHelloWorld);
