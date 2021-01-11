import { transformIdentityGroupToEntry, transformEntryToIdentityGroup } from "./identityGroup";

describe("transformIdentityGroupToEntry", () => {
  it("should transform correctly", () => {
    const idg = {
      identityGroup: "idg1",
      name: "IDG #1"
    };
    expect(transformIdentityGroupToEntry(idg)).toMatchInlineSnapshot(`
      Object {
        "PK": "IDENTITY_GROUP#idg1",
        "SK": "#CONFIG",
        "data": Object {
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
        name: "IDG #1"
      }
    };
    expect(transformEntryToIdentityGroup(entry)).toMatchInlineSnapshot(`
      Object {
        "identityGroup": "idg1",
        "name": "IDG #1",
      }
    `);
  });
});
