import {
  onlyIdentityGroupManagerFromPathHandler,
  APIGatewayEventWithIdentityGroupContext
} from "../../middlewares/handlers";
import { listInvitationByIdentityGroup } from "../../models/invitation";

const handleListInvitations = async (event: APIGatewayEventWithIdentityGroupContext) => {
  if (!event.applicationContext) throw new Error("Not using onlyIdentityGroupManagerFromBodyHandler");
  const { identityGroup } = event.applicationContext.identityGroup;

  const invitations = await listInvitationByIdentityGroup({ identityGroup });
  return invitations;
};

export const handler = onlyIdentityGroupManagerFromPathHandler(handleListInvitations);
