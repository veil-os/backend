// Test running without Jest as proof cannot be generated in Jest environment
import axios from "axios"; // eslint-disable-line import/no-extraneous-dependencies
import {
  genIdentityCommitment,
  unSerialiseIdentity
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} from "libsemaphore";
import { getLogger } from "../src/common/logger";
import identities from "./fixtures/identities.json";

const URL = "http://localhost:3000";
const { info, error } = getLogger(`E2E-TEST`);

const runTest = async () => {
  info("Creating new identity group");
  const createdIdentityGroupRes = await axios.post(`${URL}/identityGroup`, { name: `DEMO` });
  const { identityGroup, key } = createdIdentityGroupRes.data;
  info(`Created identity group: ${identityGroup}`);
  info(`Identity group key: ${key}`);
  const headers = { "x-api-key": key };

  for (let i = 0; i < identities.length; i += 1) {
    const serializedId = identities[i];
    info(`Loading identity ${i}`);
    const id = unSerialiseIdentity(serializedId);
    const idc = genIdentityCommitment(id);
    info(`Registering beneficiary identity commitment: ${idc}`);
    // eslint-disable-next-line no-await-in-loop
    await axios.post(
      `${URL}/identityCommitment`,
      {
        identityGroup,
        identityCommitment: idc.toString()
      },
      { headers }
    );
  }

  info(`[Summary]`);
  info(`Identity group: ${identityGroup}`);
  info(`Identity group key: ${key}`);
  info(`Inserted identities: ${identities.length}`);
};

runTest()
  .catch(error)
  .finally(() => {
    process.exit(0);
  });
