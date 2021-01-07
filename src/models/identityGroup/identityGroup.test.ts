import {
  // getIdentityGroupEntry,
  // insertIdentityGroupEntry,
  // deleteIdentityGroupEntry,
  // listIdentityGroup,
  transformIdentityGroupToEntry,
  transformEntryToIdentityGroup
} from "./identityGroup";

// it("works", async () => {
//   const res1 = await deleteIdentityGroupEntry({ identityGroup: "testGroup" });
//   // console.log(res1);
//   const g1 = await getIdentityGroupEntry({ identityGroup: "testGroup" });
//   // console.log(g1);
//   await insertIdentityGroupEntry({ identityGroup: "testGroup", name: "Test Group" });
//   const g2 = await getIdentityGroupEntry({ identityGroup: "testGroup" });
//   console.log(g2);
//   const listed = await listIdentityGroup();
//   console.log(listed);
// });

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
