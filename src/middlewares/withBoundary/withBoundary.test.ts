import createHttpError from "http-errors";
import { withBoundary } from "./withBoundary";

const context = { awsRequestId: "request-id" };

describe("withBoundary", () => {
  describe("after", () => {
    it("should return data from handler correctly", async () => {
      const handler = { response: { foo: "bar" } } as any;
      await withBoundary().after(handler, undefined as any);
      expect(handler).toMatchInlineSnapshot(`
        Object {
          "response": Object {
            "body": "{\\"foo\\":\\"bar\\"}",
            "headers": Object {
              "Access-Control-Allow-Credentials": true,
              "Access-Control-Allow-Origin": "*",
            },
            "statusCode": 200,
          },
        }
      `);
    });

    it("should return generic message if handler did not return data", async () => {
      const handler = { response: undefined } as any;
      await withBoundary().after(handler, undefined as any);
      expect(handler).toMatchInlineSnapshot(`
        Object {
          "response": Object {
            "headers": Object {
              "Access-Control-Allow-Credentials": true,
              "Access-Control-Allow-Origin": "*",
            },
            "statusCode": 200,
          },
        }
      `);
    });
  });

  describe("onError", () => {
    it("should return correct error codes for unexpected errors", async () => {
      const handler = { error: new Error("Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toMatchInlineSnapshot(`
        Object {
          "body": "{\\"requestId\\":\\"request-id\\"}",
          "headers": Object {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
          },
          "statusCode": 500,
        }
      `);
    });

    it("should return correct error codes for expected errors", async () => {
      const handler = { error: createHttpError(500, "Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toMatchInlineSnapshot(`
        Object {
          "body": "{\\"requestId\\":\\"request-id\\"}",
          "headers": Object {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
          },
          "statusCode": 500,
        }
      `);
    });

    it("should return correct error codes for exposed expected errors", async () => {
      const handler = { error: createHttpError(400, "Boom!"), context } as any;
      await withBoundary().onError(handler, undefined as any);
      expect(handler.response).toMatchInlineSnapshot(`
        Object {
          "body": "{\\"requestId\\":\\"request-id\\",\\"message\\":\\"Boom!\\"}",
          "headers": Object {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
          },
          "statusCode": 400,
        }
      `);
    });
  });
});
