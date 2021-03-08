import middy from "@middy/core";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";

export const publicRequestHandler = (handler: any) =>
  middy(handler)
    .use(httpSecurityHeaders())
    .use(withBoundary());
