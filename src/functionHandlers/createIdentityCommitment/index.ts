import { APIGatewayEvent } from "aws-lambda";
import { Record, String } from "runtypes";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getIdentityGroupEntry } from "../../models/identityGroup";
import { insertIdentityCommitmentEntry } from "../../models/identityCommitment";

const RequestRT = Record({
  identityGroup: String,
  identityCommitment: String
});

const handleCreateIdentityCommitment = async (event: APIGatewayEvent) => {
  if (!event.body) throw new Error("No body");
  const { identityGroup, identityCommitment } = RequestRT.check(JSON.parse(event.body));

  // Check if identity group exists
  const savedIdentityGroup = await getIdentityGroupEntry({ identityGroup });
  if (!savedIdentityGroup) throw new Error(`Identity group ${identityGroup} does not exist`);

  // Insert new record
  const inserted = await insertIdentityCommitmentEntry({ identityGroup, identityCommitment });
  return inserted;
};

export const handler = publicRequestHandler(handleCreateIdentityCommitment);
