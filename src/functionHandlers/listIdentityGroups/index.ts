import { publicRequestHandler } from "../../middlewares/handlers";
import { listIdentityGroup } from "../../models/identityGroup";

const handleListIdentityGroups = async () => {
  const identityGroups = await listIdentityGroup();
  return identityGroups;
};

export const handler = publicRequestHandler(handleListIdentityGroups);
