import { insertClaimEntry, listClaimByExternalNullifier, listClaimByIdentityGroup, deleteClaim } from "./claim";
import {
  insertIdentityGroupEntry,
  listIdentityGroup,
  getIdentityGroupEntry,
  deleteIdentityGroupEntry
} from "./identityGroup";
import {
  insertIdentityCommitmentEntry,
  listIdentityCommitmentEntries,
  deleteIdentityCommitmentEntry
} from "./identityCommitment";

describe("e2e flow", () => {
  it("works", async () => {
    // Create identity groups
    await insertIdentityGroupEntry({
      identityGroup: "idg1",
      name: "Identity Group 1"
    });
    await insertIdentityGroupEntry({
      identityGroup: "idg2",
      name: "Identity Group 2"
    });
    const idgs = await listIdentityGroup();
    console.log("Identity Groups:", idgs);

    // Create identity commitments
    await insertIdentityCommitmentEntry({
      identityGroup: "idg1",
      identityCommitment: "idc11"
    });
    await insertIdentityCommitmentEntry({
      identityGroup: "idg1",
      identityCommitment: "idc12"
    });
    await insertIdentityCommitmentEntry({
      identityGroup: "idg2",
      identityCommitment: "idc21"
    });
    const idcs1 = await listIdentityCommitmentEntries({ identityGroup: "idg1" });
    console.log("Identity Commitments (group 1):", idcs1);
    const idcs2 = await listIdentityCommitmentEntries({ identityGroup: "idg2" });
    console.log("Identity Commitments (group 2):", idcs2);

    // Create claims
    const externalNullifier = "ext_null_1";
    await insertClaimEntry({
      identityGroup: "idg1",
      nullifier: "null1",
      externalNullifier,
      message: "claim 1",
      proof: { foo: "bar" }
    });
    await insertClaimEntry({
      identityGroup: "idg1",
      nullifier: "null2",
      externalNullifier,
      message: "claim 2",
      proof: { foo: "bar" }
    });
    await insertClaimEntry({
      identityGroup: "idg2",
      nullifier: "null3",
      externalNullifier,
      message: "claim 3",
      proof: { foo: "bar" }
    });
    await insertClaimEntry({
      identityGroup: "idg2",
      nullifier: "null4",
      externalNullifier: "ext_null_2",
      message: "claim 4",
      proof: { foo: "bar" }
    });

    const claims1 = await listClaimByIdentityGroup({ identityGroup: "idg1" });
    console.log("Claims (Group 1)", claims1);
    const claims2 = await listClaimByIdentityGroup({ identityGroup: "idg2" });
    console.log("Claims (Group 2)", claims2);

    const claimsByExtNull = await listClaimByExternalNullifier({
      identityGroup: "idg2",
      externalNullifier: "ext_null_2"
    });
    console.log("Claims (ext_null_2)", claimsByExtNull);

  });
});
