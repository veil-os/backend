import { APIGatewayEvent } from "aws-lambda";
import { Record, String } from "runtypes";
import { BadRequest } from "http-errors";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getLogger } from "../../common/logger";
import { verifyClaimSignals, getMerkleRoot } from "../../crypto";
import { getIdentityGroupEntry } from "../../models/identityGroup";
import { listIdentityCommitmentEntries } from "../../models/identityCommitment";
import { getClaim, insertClaimEntry } from "../../models/claim";
import { SnarkProofRT, bigIntSnarkProof } from "../../common/snarkProof";

const { info } = getLogger("create claim");

const RequestRT = Record({
  proof: Record({
    snarkProof: SnarkProofRT,
    merkleRoot: String
  }),
  nullifier: String,
  identityGroup: String,
  externalNullifier: String,
  message: String
});

const handleCreateClaim = async (event: APIGatewayEvent) => {
  if (!event.body) throw new BadRequest("No body");
  const body = RequestRT.check(JSON.parse(event.body));

  info(`Claim: ${JSON.stringify(body)}`);

  const proof = bigIntSnarkProof(body.proof.snarkProof);
  const claim = {
    ...body,
    proof: {
      merkleRoot: body.proof.merkleRoot,
      snarkProof: proof
    },
    timestamp: Date.now()
  };
  const { identityGroup } = body;

  const checkIdentityGroup = async () => {
    // Check if identity group exists
    const savedIdentityGroup = await getIdentityGroupEntry({ identityGroup });
    if (!savedIdentityGroup) throw new BadRequest(`Identity group ${identityGroup} does not exist`);
  };

  const checkMerkleRoot = async () => {
    // Check that identity group's merkle root is same as claim's merkle root
    const identityCommitments = await listIdentityCommitmentEntries({ identityGroup });
    const merkleRoot = await getMerkleRoot(identityCommitments);
    info(`Merkle root of ${identityGroup}: ${merkleRoot}`);
    if (merkleRoot !== claim.proof.merkleRoot)
      throw new Error(`Merkle root is different. Expect ${merkleRoot}, obtained ${claim.proof.merkleRoot}`);
  };

  const checkNullifierDoesNotExist = async () => {
    // Check that claim with the same nullifier does not exist
    const claimed = await getClaim({
      identityGroup,
      externalNullifier: claim.externalNullifier,
      nullifier: claim.nullifier
    });
    if (claimed) throw new BadRequest(`User may not submit another claim, nullifer exist ${claim.nullifier}`);
  };

  const checkSnarkProof = async () => {
    // Check snark proof
    const verified = await verifyClaimSignals(claim);
    if (!verified) throw new BadRequest(`Snark proof is not verified`);
  };

  const deferredChecks = [checkSnarkProof(), checkNullifierDoesNotExist(), checkMerkleRoot(), checkIdentityGroup()];
  await Promise.all(deferredChecks);

  // Insert claim entry
  const insertedClaim = await insertClaimEntry(claim);

  return insertedClaim;
};

export const handler = publicRequestHandler(handleCreateClaim);
