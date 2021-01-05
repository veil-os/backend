import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpSecurityHeaders from "@middy/http-security-headers";
import { withBoundary } from "../withBoundary";

export const publicRequestHandler = (handler: any) =>
  middy(handler)
    .use(cors())
    .use(httpSecurityHeaders())
    .use(withBoundary());
