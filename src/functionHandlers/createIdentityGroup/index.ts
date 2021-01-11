import { APIGatewayEvent } from "aws-lambda";
import { Record, String } from "runtypes";
import { v4 as uuid } from "uuid";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getLogger } from "../../common/logger";
import { insertIdentityGroupEntry } from "../../models/identityGroup";

const { info } = getLogger("createIdentityGroup");

const RequestRT = Record({
  name: String
});

const handleCreateIdentityGroup = async (event: APIGatewayEvent) => {
  if (!event.body) throw new Error("No body");
  const { name } = RequestRT.check(JSON.parse(event.body));
  const id = uuid();
  const identityGroup = { identityGroup: id, name };
  info(`Inserting ${JSON.stringify(identityGroup)}`);
  const inserted = await insertIdentityGroupEntry(identityGroup);
  return inserted;
};

export const handler = publicRequestHandler(handleCreateIdentityGroup);
