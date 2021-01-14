import { APIGatewayEvent } from "aws-lambda";
import { publicRequestHandler } from "../../middlewares/handlers";
import { listClaimByExternalNullifier } from "../../models/claim";

const handleListClaims = async (event: APIGatewayEvent) => {
  const identityGroup = event.pathParameters?.identityGroup;
  const externalNullifier = event.pathParameters?.externalNullifier;

  if (!identityGroup) throw new Error("No identity group provided");

  const claims = await listClaimByExternalNullifier({ identityGroup, externalNullifier: externalNullifier || "" });

  return claims;
};

export const handler = publicRequestHandler(handleListClaims);
