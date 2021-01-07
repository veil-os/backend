import { String, Record } from "runtypes";
import { put, query, deleteItem } from "../../services/dynamoDb";
import { IdentityCommitment, DbEntry } from "../../types";
import { config } from "../../config";

const PK_PREFIX = `IDENTITY_GROUP#`;
const SK_PREFIX = `#IDENTITY_COMMITMENT#`;

export const IdentityCommitmentEntryRT = Record({
  PK: String.withConstraint(s => s.startsWith(PK_PREFIX)),
  SK: String.withConstraint(s => s.startsWith(SK_PREFIX))
});

export const transformEntryToIdentityCommitment = (raw: DbEntry): IdentityCommitment => {
  const entry = IdentityCommitmentEntryRT.check(raw);
  return {
    identityGroup: entry.PK.substring(PK_PREFIX.length),
    identityCommitment: entry.SK.substring(SK_PREFIX.length)
  };
};

export const transformIdentityCommitmentToEntry = ({ identityGroup, identityCommitment }: IdentityCommitment) => {
  return {
    PK: `${PK_PREFIX}${identityGroup}`,
    SK: `${SK_PREFIX}${identityCommitment}`
  };
};

export const insertIdentityCommitmentEntry = async (idc: IdentityCommitment) => {
  const param = {
    TableName: config.dynamodb.table,
    Item: transformIdentityCommitmentToEntry(idc)
  };
  await put(param);
  return param.Item;
};

export const listIdentityCommitmentEntries = async ({ identityGroup }: Pick<IdentityCommitment, "identityGroup">) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: config.dynamodb.table,
    KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `${PK_PREFIX}${identityGroup}`,
      ":SK": `${SK_PREFIX}`
    }
  };
  const { Items } = await query(params);
  return Items.map(transformEntryToIdentityCommitment);
};

export const deleteIdentityCommitmentEntry = async (idc: IdentityCommitment) => {
  const param = {
    TableName: config.dynamodb.table,
    Key: transformIdentityCommitmentToEntry(idc)
  };
  return deleteItem(param);
};
