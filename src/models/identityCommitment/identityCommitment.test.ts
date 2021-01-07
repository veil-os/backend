import {
  // insertIdentityCommitmentEntry,
  // listIdentityCommitmentEntries,
  // deleteIdentityCommitmentEntry,
  transformEntryToIdentityCommitment,
  transformIdentityCommitmentToEntry
} from "./identityCommitment";

// it("works", async () => {
//   await insertIdentityCommitmentEntry({ identityCommitment: "testIdc2", identityGroup: "testIdg" });
//   const commitments = await listIdentityCommitmentEntries({ identityGroup: "testIdg" });
//   console.log(commitments);
//   await deleteIdentityCommitmentEntry({ identityCommitment: "testIdc2", identityGroup: "testIdg" });
//   const commitments2 = await listIdentityCommitmentEntries({ identityGroup: "testIdg" });
//   console.log(commitments2);
// });

describe("transformIdentityCommitmentToEntry", () => {
  it("should transform correctly", () => {
    const idc = {
      identityGroup: "idg1",
      identityCommitment: "idc1"
    };
    expect(transformIdentityCommitmentToEntry(idc)).toMatchInlineSnapshot(`
      Object {
        "PK": "IDENTITY_GROUP#idg1",
        "SK": "#IDENTITY_COMMITMENT#idc1",
      }
    `);
  });
});

describe("transformEntryToIdentityCommitment", () => {
  it("should transform correctly", () => {
    const entry = {
      PK: "IDENTITY_GROUP#idg1",
      SK: "#IDENTITY_COMMITMENT#idc1"
    };
    expect(transformEntryToIdentityCommitment(entry)).toMatchInlineSnapshot(`
      Object {
        "identityCommitment": "idc1",
        "identityGroup": "idg1",
      }
    `);
  });
});
