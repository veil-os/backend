import { transformEntryToIdentityCommitment, transformIdentityCommitmentToEntry } from "./identityCommitment";

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
