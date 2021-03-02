const generateDynamoDb = () => ({
  table: process.env.TABLE_NAME || "veilos",
  client: process.env.IS_OFFLINE
    ? {
        region: "localhost",
        endpoint: "http://localhost:8000",
        accessKeyId: "DEFAULT_ACCESS_KEY",
        secretAccessKey: "DEFAULT_SECRET"
      }
    : {}
});

const generateConfig = () => ({
  appName: "veilos",
  dynamodb: generateDynamoDb(),
  semaphore: {
    treeDepth: 10
  }
});

export const config = generateConfig();
