import { transformEntryToClaim, transformClaimToEntry } from "./claim";

describe("transformEntryToClaim", () => {
  it("should transform correctly", () => {
    const entry = {
      PK: "IDENTITY_GROUP#idg1",
      SK: "#EXTERNAL_NULLIFIER#ext_null_1#null_1",
      data: {
        message: "test message",
        proof: { foo: "bar" }
      }
    };
    expect(transformEntryToClaim(entry)).toMatchInlineSnapshot(`
      Object {
        "externalNullifier": "ext_null_1",
        "identityGroup": "idg1",
        "message": "test message",
        "nullifier": "null_1",
        "proof": Object {
          "foo": "bar",
        },
      }
    `);
  });
});

describe("transformClaimToEntry", () => {
  it("should transform correctly", () => {
    const idc = {
      externalNullifier: "ext_null_1",
      identityGroup: "idg1",
      message: "hello world",
      nullifier: "null_1",
      proof: { foo: "bar" }
    };
    expect(transformClaimToEntry(idc)).toMatchInlineSnapshot(`
      Object {
        "PK": "IDENTITY_GROUP#idg1",
        "SK": "#EXTERNAL_NULLIFIER#ext_null_1#null_1",
        "data": Object {
          "message": "hello world",
          "proof": Object {
            "foo": "bar",
          },
        },
      }
    `);
  });
});
