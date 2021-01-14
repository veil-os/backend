// Test running without Jest as proof cannot be generated in Jest environment
import axios from "axios";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { getLogger } from "../src/common/logger";
import { snarkProofBigInt } from "../src/common/snarkProof";
import { genIdentity, genCircuit, genProof, genWitness, genIdentityCommitment, genPublicSignals } from "libsemaphore";
import { BigNumber, utils } from "ethers";
import { readFileSync } from "fs";

const URL = "http://localhost:3000";
const TEST_ID = uuid();
const { info, debug } = getLogger(`E2E-TEST`);

const runTest = async () => {
  info("[Setup] Generating circuit");
  const circuitJson = JSON.parse(readFileSync("src/crypto/circuit/circuit.json").toString());
  const circuit = genCircuit(circuitJson);
  const provingKeyJson = readFileSync("src/crypto/circuit/proving_key.bin");

  info("[Admin] Creating new identity group");
  const createdIdentityGroupRes = await axios.post(`${URL}/identityGroup`, { name: `TESTING-GROUP-${TEST_ID}` });
  debug(createdIdentityGroupRes.data);
  const { identityGroup } = createdIdentityGroupRes.data;
  info(`[Admin] Identity group created: ${identityGroup}`);

  info("[Beneficiary 1] Generating identity");
  const id1 = genIdentity();
  debug(id1);
  info(`[Beneficiary 1] Generating identity commitment`);
  const idc1 = genIdentityCommitment(id1);
  info(`[Beneficiary 1] Identity commitment: ${idc1}`);

  info("[Beneficiary 2] Generating identity");
  const id2 = genIdentity();
  debug(id2);
  info(`[Beneficiary 2] Generating identity commitment`);
  const idc2 = genIdentityCommitment(id2);
  info(`[Beneficiary 2] Identity commitment: ${idc2}`);

  info("[Admin] Registering beneficiary 1 identity commitment");
  const registration1Res = await axios.post(`${URL}/identityCommitment`, {
    identityGroup,
    identityCommitment: idc1.toString()
  });
  debug(registration1Res.data);

  info("[Admin] Registering beneficiary 2 identity commitment");
  const registration2Res = await axios.post(`${URL}/identityCommitment`, {
    identityGroup,
    identityCommitment: idc2.toString()
  });
  debug(registration2Res.data);

  const externalNullifierStr = `FOOD_COLLECTION-${format(new Date(), "yyyyMMdd")}`;
  info(`[Program Owner] Using external nullifier: ${externalNullifierStr}`);
  const externalNullifier = BigNumber.from(utils.toUtf8Bytes(externalNullifierStr));
  debug(externalNullifier);

  info(`[Beneficiary 1] Generating claim for given program`);
  info(`[Beneficiary 1] Fetching identity commitment list`);
  const idcList = await axios.get(`${URL}/identityCommitment/${identityGroup}`);
  debug(idcList.data);
  info(`[Beneficiary 1] Building local identity commitment tree`);
  const leaves = idcList.data.map((idc: { identityCommitment: string }) => BigNumber.from(idc.identityCommitment));
  debug(leaves);
  info(`[Beneficiary 1] Generating witness`);
  const message = "ABC PTE LTD";
  const { witness } = await genWitness(message, circuit, id1, leaves, 20, externalNullifier);
  info(`[Beneficiary 1] Generating proof`);
  const proof = await genProof(witness, provingKeyJson);
  debug(proof);
  info(`[Beneficiary 1] Generating public signal`);
  const publicSignal = genPublicSignals(witness, circuit);
  debug(publicSignal);
  const [merkleRoot, nullifierHash] = publicSignal;
  info(`[Beneficiary 1] Constructing claim payload`);
  const claimPayload = {
    proof: {
      snarkProof: snarkProofBigInt(proof),
      merkleRoot: merkleRoot.toString()
    },
    nullifier: nullifierHash.toString(),
    identityGroup,
    externalNullifier: externalNullifierStr,
    message
  };
  debug(claimPayload);
  info(`[Beneficiary 1] Submitting Claim`);
  const claimSubmissionRes = await axios.post(`${URL}/claim`, claimPayload);
  info(claimSubmissionRes.data);

  info(`[Program Owner] Checking Claims`);
  // TBD
};

runTest()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
