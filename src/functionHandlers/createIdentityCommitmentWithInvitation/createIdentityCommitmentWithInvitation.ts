import { Record, String } from "runtypes";
import { BadRequest } from "http-errors";
import { publicRequestHandler, APIGatewayEventWithIdentityGroupContext } from "../../middlewares/handlers";
import { getInvitation, insertInvitationEntry } from "../../models/invitation";
import { ConsumedInvitation } from "../../types";
import { insertIdentityCommitmentEntry, getIdentityCommitmentEntry } from "../../models/identityCommitment";

const RequestRT = Record({
  identityCommitment: String,
  code: String
});

const handleCreateIdentityCommitmentWithInvitation = async (event: APIGatewayEventWithIdentityGroupContext) => {
  const identityGroup = event.pathParameters?.identityGroup;
  if (!identityGroup) throw new BadRequest("No identity group found in path");
  if (!event.body) throw new BadRequest("No body");

  const { identityCommitment, code } = RequestRT.check(JSON.parse(event.body));

  // Check if code exist & not been consumed
  const existingInvitation = await getInvitation({ identityGroup, code });
  if (!existingInvitation) throw new BadRequest("Invitation code is invalid");
  if (existingInvitation.state !== "UNCONSUMED") throw new BadRequest("Invitation code has been used");

  // Invalidate code
  const consumedInvitation: ConsumedInvitation = {
    ...existingInvitation,
    state: "CONSUMED",
    consumedBy: identityCommitment
  };
  await insertInvitationEntry(consumedInvitation);

  // Check that identity commitment has not been inserted to group
  const existingIdentityCommitment = await getIdentityCommitmentEntry({ identityGroup, identityCommitment });
  if (existingIdentityCommitment) throw new BadRequest("Identity commitment already in identity group");

  // Insert identity commitment into group
  const inserted = await insertIdentityCommitmentEntry({ identityGroup, identityCommitment });

  return inserted;
};

export const handler = publicRequestHandler(handleCreateIdentityCommitmentWithInvitation);
