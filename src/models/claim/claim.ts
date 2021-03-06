import { String, Record, Number } from "runtypes";
import { SnarkProofRT, snarkProofBigInt } from "../../common/snarkProof";

import { get, put, query, deleteItem } from "../../services/dynamoDb";
import { Claim, DbEntry } from "../../types";
import { config } from "../../config";

const PK_PREFIX = `IDENTITY_GROUP#`;
const SK_PREFIX = `#EXTERNAL_NULLIFIER#`;

export const ClaimEntryRT = Record({
  PK: String.withConstraint(s => s.startsWith(PK_PREFIX)),
  SK: String.withConstraint(s => s.startsWith(SK_PREFIX) && s.split("#").length === 4),
  data: Record({
    message: String,
    proof: Record({
      merkleRoot: String,
      snarkProof: SnarkProofRT
    }),
    timestamp: Number
  })
});

export const transformEntryToClaim = (raw: DbEntry): Claim => {
  const entry = ClaimEntryRT.check(raw);
  const [externalNullifier, nullifier] = entry.SK.substring(SK_PREFIX.length).split("#");
  return {
    identityGroup: entry.PK.substring(PK_PREFIX.length),
    externalNullifier,
    nullifier,
    message: entry.data.message,
    proof: {
      merkleRoot: entry.data.proof.merkleRoot,
      snarkProof: snarkProofBigInt(entry.data.proof.snarkProof)
    },
    timestamp: entry.data.timestamp
  };
};

export const transformClaimToEntry = ({
  identityGroup,
  externalNullifier,
  nullifier,
  message,
  proof,
  timestamp
}: Claim) => {
  return {
    PK: `${PK_PREFIX}${identityGroup}`,
    SK: `${SK_PREFIX}${externalNullifier}#${nullifier}`,
    data: {
      message,
      proof: {
        merkleRoot: proof.merkleRoot,
        snarkProof: snarkProofBigInt(proof.snarkProof)
      },
      timestamp
    }
  };
};

export const insertClaimEntry = async (claim: Claim) => {
  const param = {
    TableName: config.dynamodb.table,
    Item: transformClaimToEntry(claim)
  };
  await put(param);
  return transformEntryToClaim(param.Item);
};

export const getClaim = async ({
  identityGroup,
  externalNullifier,
  nullifier
}: Pick<Claim, "externalNullifier" | "identityGroup" | "nullifier">) => {
  const param = {
    TableName: config.dynamodb.table,
    Key: {
      PK: `${PK_PREFIX}${identityGroup}`,
      SK: `${SK_PREFIX}${externalNullifier}#${nullifier}`
    }
  };
  const { Item } = await get(param);
  return Item ? transformEntryToClaim(Item as any) : undefined;
};

export const listClaimByIdentityGroup = async ({ identityGroup }: Pick<Claim, "identityGroup">) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: config.dynamodb.table,
    KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `${PK_PREFIX}${identityGroup}`,
      ":SK": `${SK_PREFIX}`
    }
  };
  const { Items } = await query(params);
  return Items.map(transformEntryToClaim);
};

export const listClaimByExternalNullifier = async ({
  identityGroup,
  externalNullifier
}: Pick<Claim, "externalNullifier" | "identityGroup">): Promise<Claim[]> => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: config.dynamodb.table,
    KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `${PK_PREFIX}${identityGroup}`,
      ":SK": `${SK_PREFIX}${externalNullifier}`
    }
  };
  const { Items } = await query(params);
  return Items.map(transformEntryToClaim);
};

export const deleteClaim = async ({
  externalNullifier,
  nullifier,
  identityGroup
}: Pick<Claim, "externalNullifier" | "nullifier" | "identityGroup">) => {
  const param = {
    TableName: config.dynamodb.table,
    Key: {
      PK: `${PK_PREFIX}${identityGroup}`,
      SK: `${SK_PREFIX}${externalNullifier}#${nullifier}`
    }
  };
  return deleteItem(param);
};
