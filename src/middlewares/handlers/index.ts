import middy from "@middy/core";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";
import { onlyIdentityGroupManager } from "../onlyIdentityGroupManager";

export const publicRequestHandler = (handler: any) =>
  middy(handler)
    .use(httpSecurityHeaders())
    .use(withBoundary());

export const onlyIdentityGroupManagerHandler = (handler: any) =>
  middy(handler)
    .use(onlyIdentityGroupManager())
    .use(httpSecurityHeaders())
    .use(withBoundary());

export { APIGatewayEventWithIdentityGroupContext } from "../onlyIdentityGroupManager";
