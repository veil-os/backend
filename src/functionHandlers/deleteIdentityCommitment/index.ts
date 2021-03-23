import { Record, String } from "runtypes";
import { BadRequest } from "http-errors";
import { onlyIdentityGroupManagerHandler, APIGatewayEventWithIdentityGroupContext } from "../../middlewares/handlers";
import { deleteIdentityCommitmentEntry } from "../../models/identityCommitment";

const RequestRT = Record({
  identityGroup: String,
  identityCommitment: String
});

const handleDeleteIdentityCommitment = async (event: APIGatewayEventWithIdentityGroupContext) => {
  if (!event.body) throw new BadRequest("No body");
  if (!event.applicationContext) throw new Error("Not using onlyIdentityGroupManagerHandler");
  const { identityGroup } = event.applicationContext.identityGroup;
  const { identityCommitment } = RequestRT.check(JSON.parse(event.body));

  // Delete identity commitment
  await deleteIdentityCommitmentEntry({ identityGroup, identityCommitment });
  return { success: true };
};

export const handler = onlyIdentityGroupManagerHandler(handleDeleteIdentityCommitment);
