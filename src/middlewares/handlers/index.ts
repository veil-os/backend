import middy from "@middy/core";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";
import { onlyIdentityGroupManagerFromPath, onlyIdentityGroupManagerFromBody } from "../onlyIdentityGroupManager";

export const publicRequestHandler = (handler: any) =>
  middy(handler)
    .use(httpSecurityHeaders())
    .use(withBoundary());

export const onlyIdentityGroupManagerFromBodyHandler = (handler: any) =>
  middy(handler)
    .use(onlyIdentityGroupManagerFromBody())
    .use(httpSecurityHeaders())
    .use(withBoundary());

export const onlyIdentityGroupManagerFromPathHandler = (handler: any) =>
  middy(handler)
    .use(onlyIdentityGroupManagerFromPath())
    .use(httpSecurityHeaders())
    .use(withBoundary());

export { APIGatewayEventWithIdentityGroupContext } from "../onlyIdentityGroupManager";
