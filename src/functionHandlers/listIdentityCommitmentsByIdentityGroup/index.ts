import { APIGatewayEvent } from "aws-lambda";
import { publicRequestHandler } from "../../middlewares/handlers";
import { listIdentityCommitmentEntries } from "../../models/identityCommitment";

const handleListIdentityCommitmentsByIdentityGroup = async (event: APIGatewayEvent) => {
  const { identityGroup } = event.pathParameters;
  const identityCommitments = await listIdentityCommitmentEntries({ identityGroup });
  return identityCommitments;
};

export const handler = publicRequestHandler(handleListIdentityCommitmentsByIdentityGroup);
