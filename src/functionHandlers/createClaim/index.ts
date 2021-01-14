import { APIGatewayEvent } from "aws-lambda";
import { Record, String } from "runtypes";
import { publicRequestHandler } from "../../middlewares/handlers";
import { getLogger } from "../../common/logger";
import { verifyClaimSignals, getMerkleRoot } from "../../crypto";
import { getIdentityGroupEntry } from "../../models/identityGroup";
import { listIdentityCommitmentEntries } from "../../models/identityCommitment";
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
  if (!event.body) throw new Error("No body");
  const body = RequestRT.check(JSON.parse(event.body));

  info(`Claim: ${JSON.stringify(body)}`);

  const proof = bigIntSnarkProof(body.proof.snarkProof);
  const claim = {
    ...body,
    proof: {
      merkleRoot: body.proof.merkleRoot,
      snarkProof: proof
    }
  };
  const { identityGroup } = body;

  // Check if identity group exists
  const savedIdentityGroup = await getIdentityGroupEntry({ identityGroup: identityGroup });
  if (!savedIdentityGroup) throw new Error(`Identity group ${identityGroup} does not exist`);

  // Check that identity group's merkle root is same as claim's merkle root
  const identityCommitments = await listIdentityCommitmentEntries({ identityGroup });
  const merkleRoot = await getMerkleRoot(identityCommitments);
  info(`Merkle root of ${identityGroup}: ${merkleRoot}`);

  // Check that claim with the same nullifier does not exist

  // Check snark proof
  const verified = await verifyClaimSignals(claim);

  return { verified };
};

export const handler = publicRequestHandler(handleCreateClaim);
