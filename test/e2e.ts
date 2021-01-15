// Test running without Jest as proof cannot be generated in Jest environment
import axios from "axios"; // eslint-disable-line import/no-extraneous-dependencies
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { genIdentity, genCircuit, genProof, genWitness, genIdentityCommitment, genPublicSignals } from "libsemaphore";
import { BigNumber, utils } from "ethers";
import { readFileSync } from "fs";
import { snarkProofBigInt } from "../src/common/snarkProof";
import { getLogger } from "../src/common/logger";

const URL = "http://localhost:3000";
const TEST_ID = uuid();
const { info, debug, error } = getLogger(`E2E-TEST`);

/*

Test Scenario

This test simulate a case where there are two beneficiaries (beneficiary 1 & beneficiary 2)
who are mean tested by a government agency to be in an underprivileged group. The group is
used by a NGO ran food distribution program. 

The script demonstrate that the identity of the claimant is fully concealed from both the 
admin from the government who maintains the identity group as well as the program owner who
runs the food distribution program. Multiple independently ran program can use use a common 
external nullifier (ie FOOD_DISTRIBUTION-20210115) to prevent double dipping across different
distribution sites while maintaining full privacy of the individuals. 

The group membership is maintained by the government (admin).

All records on the database are public and can be audited.

Full description of the scenario available at https://geek.sg/blog/decentralized-food-distribution-organisation

*/

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
  const claimsRes = await axios.get(`${URL}/claim/${identityGroup}`);
  debug(claimsRes.data);
  const claimData = claimsRes.data[0];

  info(`[Public Info]`);
  info(`Identity Group: ${claimData.identityGroup}`);
  info(`Identity Group Merkle Root: ${claimData.proof.merkleRoot}`);
  info(`External Nullifier: ${claimData.externalNullifier}`);
  info(`Nullifier: ${claimData.nullifier}`);
  info(`Message: ${claimData.message}`);

  info(`[Private Info]`);
  info(`Beneficiary 1 Private Key: ${id1.keypair.privKey.toString("hex")}`);
  info(`Beneficiary 1 Public Key: ${id1.keypair.pubKey[0].toString()}${id1.keypair.pubKey[1].toString()}`);
  info(`Beneficiary 1 Identity Nullifier: ${id1.identityNullifier.toString()}`);
  info(`Beneficiary 1 Identity Trapdoor: ${id1.identityTrapdoor.toString()}`);
};

runTest()
  .catch(error)
  .finally(() => {
    process.exit(0);
  });
