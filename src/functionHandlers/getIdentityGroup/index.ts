import { APIGatewayEvent } from "aws-lambda";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getIdentityGroupEntry } from "../../models/identityGroup";

const handleGetIdentityGroup = async (event: APIGatewayEvent) => {
  const identityGroup = event.pathParameters?.identityGroup;
  if (!identityGroup) throw new Error("Identity group not defined");

  const fetchedIdentityGroup = await getIdentityGroupEntry({ identityGroup });

  return fetchedIdentityGroup;
};

export const handler = publicRequestHandler(handleGetIdentityGroup);
