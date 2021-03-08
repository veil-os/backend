// Test running without Jest as proof cannot be generated in Jest environment
import axios from "axios"; // eslint-disable-line import/no-extraneous-dependencies
import {
  genIdentityCommitment,
  unSerialiseIdentity
  // @ts-ignore
} from "libsemaphore";
import { getLogger } from "../src/common/logger";
import identities from "./fixtures/identities.json";

const URL = "https://api.veilos.io";
const { info, error } = getLogger(`E2E-TEST`);

const runTest = async () => {
  info("Creating new identity group");
  const createdIdentityGroupRes = await axios.post(`${URL}/identityGroup`, { name: `DEMO` });
  const { identityGroup } = createdIdentityGroupRes.data;
  info(`Created identity group: ${identityGroup}`);

  for (let i = 0; i < identities.length; i++) {
    const serializedId = identities[i];
    info(`Loading identity ${i}`);
    const id = unSerialiseIdentity(serializedId);
    const idc = genIdentityCommitment(id);
    info(`Registering beneficiary identity commitment: ${idc}`);
    await axios.post(`${URL}/identityCommitment`, {
      identityGroup,
      identityCommitment: idc.toString()
    });
  }

  info(`[Summary]`);
  info(`Identity group: ${identityGroup}`);
  info(`Inserted identities: ${identities.length}`);
};

runTest()
  .catch(error)
  .finally(() => {
    process.exit(0);
  });
