import { Record, String } from "runtypes";
import { BadRequest } from "http-errors";
import { onlyIdentityGroupManagerHandler, APIGatewayEventWithIdentityGroupContext } from "../../middlewares/handlers";
import { insertIdentityCommitmentEntry, getIdentityCommitmentEntry } from "../../models/identityCommitment";

const RequestRT = Record({
  identityGroup: String,
  identityCommitment: String
});

const handleCreateIdentityCommitment = async (event: APIGatewayEventWithIdentityGroupContext) => {
  if (!event.body) throw new BadRequest("No body");
  if (!event.applicationContext) throw new Error("Not using onlyIdentityGroupManagerHandler");
  const { identityGroup } = event.applicationContext.identityGroup;
  const { identityCommitment } = RequestRT.check(JSON.parse(event.body));

  // Check that identity commitment has not already been inserted
  const existingIdentityCommitment = await getIdentityCommitmentEntry({ identityGroup, identityCommitment });
  if (existingIdentityCommitment) throw new BadRequest("Identity commitment already in identity group");

  // Insert new record
  // TODO validate the identity commitment entry (length and number)
  const inserted = await insertIdentityCommitmentEntry({ identityGroup, identityCommitment });
  return inserted;
};

export const handler = onlyIdentityGroupManagerHandler(handleCreateIdentityCommitment);
