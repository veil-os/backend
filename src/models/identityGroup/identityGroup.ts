import { String, Record } from "runtypes";
import { put, get, query, deleteItem } from "../../services/dynamoDb";
import { IdentityGroup, DbEntry } from "../../types";
import { config } from "../../config";

const PK_PREFIX = `IDENTITY_GROUP#`;
const SK_PREFIX = `#CONFIG`;

export const IdentityGroupEntryRT = Record({
  PK: String.withConstraint(s => s.startsWith(PK_PREFIX)),
  SK: String.withConstraint(s => s.startsWith(SK_PREFIX)),
  data: Record({
    name: String
  })
});

export const transformEntryToIdentityGroup = (raw: DbEntry): IdentityGroup => {
  const entry = IdentityGroupEntryRT.check(raw);
  return {
    identityGroup: entry.PK.substring(PK_PREFIX.length),
    name: entry.data.name
  };
};

export const transformIdentityGroupToEntry = ({ identityGroup, name }: IdentityGroup) => {
  return {
    PK: `${PK_PREFIX}${identityGroup}`,
    SK: `${SK_PREFIX}`,
    data: { name }
  };
};

export const insertIdentityGroupEntry = async (idg: IdentityGroup) => {
  const param = {
    TableName: config.dynamodb.table,
    Item: transformIdentityGroupToEntry(idg)
  };
  await put(param);
  return param.Item;
};

export const getIdentityGroupEntry = async ({ identityGroup }: Pick<IdentityGroup, "identityGroup">) => {
  const param = {
    TableName: config.dynamodb.table,
    Key: {
      PK: `${PK_PREFIX}${identityGroup}`,
      SK: `${SK_PREFIX}`
    }
  };
  const { Item } = await get(param);
  return Item ? transformEntryToIdentityGroup(Item as any) : undefined;
};

export const deleteIdentityGroupEntry = async ({ identityGroup }: Pick<IdentityGroup, "identityGroup">) => {
  const param = {
    TableName: config.dynamodb.table,
    Key: {
      PK: `${PK_PREFIX}${identityGroup}`,
      SK: `${SK_PREFIX}`
    }
  };
  return deleteItem(param);
};

export const listIdentityGroup = async (): Promise<IdentityGroup[]> => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: config.dynamodb.table,
    IndexName: "inverted",
    KeyConditionExpression: "SK = :SK AND begins_with(PK, :PK)",
    ExpressionAttributeValues: {
      ":SK": `${SK_PREFIX}`,
      ":PK": `${PK_PREFIX}`
    }
  };
  const { Items } = await query(params);
  return Items.map(transformEntryToIdentityGroup);
};
