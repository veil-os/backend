import { verifyProof, parseVerifyingKeyJson, genSignalHash, genTree, unstringifyBigInts } from "libsemaphore";
import { BigNumber, utils } from "ethers";
import verificationKeyRaw from "./circuit/verification_key.json";
import { Claim, IdentityCommitment } from "../types";
import { config } from "../config";

export const verificationKey = parseVerifyingKeyJson(JSON.stringify(verificationKeyRaw));

export const getMerkleRoot = async (identityCommitments: IdentityCommitment[]) => {
  const leaves = identityCommitments.map(idc => BigNumber.from(idc.identityCommitment));
  const tree = await genTree(config.semaphore.treeDepth, leaves);
  return tree.root() as string;
};

export const verifyClaimSignals = async (claim: Claim) => {
  // Note that this function does not do the following checks:
  // Check merkle root of claim === identityCommitments merkle root
  // Check nullifier hash don't exist
  const signalHash = genSignalHash(utils.toUtf8Bytes(claim.message));
  const externalNullifier = BigNumber.from(utils.toUtf8Bytes(claim.externalNullifier));
  const signal = [
    unstringifyBigInts(claim.proof.merkleRoot as any),
    unstringifyBigInts(claim.nullifier as any),
    unstringifyBigInts(signalHash as any),
    unstringifyBigInts(externalNullifier as any)
  ];
  const verified = await verifyProof(verificationKey, claim.proof.snarkProof, signal);
  return verified;
};
