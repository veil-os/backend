import { Record, String, Array } from "runtypes";
import { BadRequest } from "http-errors";
import { v4 as uuid } from "uuid";
import {
  onlyIdentityGroupManagerFromBodyHandler,
  APIGatewayEventWithIdentityGroupContext
} from "../../middlewares/handlers";
import { putMultipleInvitationEntries } from "../../models/invitation";
import { Invitation } from "../../types";

const InvitationRT = Record({
  name: String,
  email: String
});

const RequestRT = Record({
  invitations: Array(InvitationRT)
});

const handleCreateInvitations = async (event: APIGatewayEventWithIdentityGroupContext) => {
  if (!event.body) throw new BadRequest("No body");
  if (!event.applicationContext) throw new Error("Not using onlyIdentityGroupManagerFromBodyHandler");
  const { identityGroup } = event.applicationContext.identityGroup;
  const { invitations } = RequestRT.check(JSON.parse(event.body));

  if (invitations.length > 25) throw new BadRequest("Cannot bulk insert more than 25 entries");

  const created = Date.now();
  const payload: Invitation[] = invitations.map(({ name, email }) => ({
    identityGroup,
    code: uuid(),
    name,
    email,
    created,
    state: "UNCONSUMED"
  }));

  // Insert invitations to db
  const inserted = await putMultipleInvitationEntries(payload);

  // TODO Send email to all invited recipients
  payload.forEach(console.log);

  return inserted;
};

export const handler = onlyIdentityGroupManagerFromBodyHandler(handleCreateInvitations);
