import { transformIdentityGroupToEntry, transformEntryToIdentityGroup, sanitizeIdentityGroup } from "./identityGroup";

describe("transformIdentityGroupToEntry", () => {
  it("should transform correctly", () => {
    const idg = {
      identityGroup: "idg1",
      name: "IDG #1",
      key: "key"
    };
    expect(transformIdentityGroupToEntry(idg)).toMatchInlineSnapshot(`
      Object {
        "PK": "IDENTITY_GROUP#idg1",
        "SK": "#CONFIG",
        "data": Object {
          "key": "key",
          "name": "IDG #1",
        },
      }
    `);
  });
});

describe("transformEntryToIdentityGroup", () => {
  it("should transform correctly", () => {
    const entry = {
      PK: "IDENTITY_GROUP#idg1",
      SK: "#CONFIG",
      data: {
        name: "IDG #1",
        key: "key"
      }
    };
    expect(transformEntryToIdentityGroup(entry)).toMatchInlineSnapshot(`
      Object {
        "identityGroup": "idg1",
        "key": "key",
        "name": "IDG #1",
      }
    `);
  });
});

describe("sanitizeIdentityGroup", () => {
  it("should remove sensitive info", () => {
    const idg = {
      identityGroup: "idg1",
      key: "key",
      name: "IDG #1"
    };
    const sanitized = sanitizeIdentityGroup(idg);
    expect(sanitized).toMatchInlineSnapshot(`
      Object {
        "identityGroup": "idg1",
        "name": "IDG #1",
      }
    `);
  });
});
