import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "entrag_guard";

let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoDb() {
  if (!uri) return null;

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  return client.db(dbName);
}

export async function checkMongoHealth() {
  const db = await getMongoDb();
  if (!db) {
    return {
      configured: false,
      connected: false,
      database: dbName,
      message: "MONGODB_URI is not configured."
    };
  }

  await db.command({ ping: 1 });

  return {
    configured: true,
    connected: true,
    database: db.databaseName,
    message: "MongoDB connection is healthy."
  };
}
