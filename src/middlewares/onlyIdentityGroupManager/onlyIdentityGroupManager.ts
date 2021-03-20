/* eslint-disable no-param-reassign */
import { APIGatewayEvent } from "aws-lambda";
import { Unauthorized, BadRequest } from "http-errors";
import middy from "@middy/core";
import { IdentityGroup } from "src/types";
import { getLogger } from "../../common/logger";
import { getIdentityGroupEntryDangerous } from "../../models/identityGroup";

const { info } = getLogger("onlyIdentityGroupManager");

export interface APIGatewayEventWithIdentityGroupContext extends APIGatewayEvent {
  // Using nullable to make sure dependents check that the application context is populated
  applicationContext?: {
    identityGroup: IdentityGroup;
  };
}

interface OnlyIdentityGroupManager<T, R> extends middy.MiddlewareObject<T, R> {
  before: middy.MiddlewareFunction<T, R>;
}

export const onlyIdentityGroupManager = (): OnlyIdentityGroupManager<any, any> => ({
  before: async handler => {
    const { event } = handler;

    const apiKeyFromRequest = event.headers["x-api-key"] || event.headers["X-API-KEY"];
    info(`x-api-key: ${apiKeyFromRequest}`);
    if (!apiKeyFromRequest) throw new Unauthorized("Unauthorized: x-api-key must be present");

    const requestBody = JSON.parse(event.body);
    if (!requestBody.identityGroup) throw new BadRequest("`identityGroup` is not found in request body");
    const identityGroupId = requestBody.identityGroup;

    const identityGroup = await getIdentityGroupEntryDangerous({ identityGroup: identityGroupId });
    info(`Identity Group ${identityGroupId}: ${JSON.stringify(identityGroup)}`);
    if (!identityGroup) throw new BadRequest(`Identity group ${identityGroupId} does not exist`);
    if (identityGroup.key !== apiKeyFromRequest)
      throw new Unauthorized(`User not allowed to manage identity group ${identityGroupId}`);

    handler.event = { ...handler.event, applicationContext: { identityGroup } };
  }
});
