import { Filter } from "mongodb";
import { documents as seedDocuments, evaluations as seedEvaluations, users as seedUsers } from "./data";
import { getMongoDb } from "./mongodb";
import { DocumentRecord, EvaluationResult, User } from "./types";

async function ensureSeedData() {
  const db = await getMongoDb();
  if (!db) return null;

  const usersCount = await db.collection<User>("users").countDocuments();
  if (usersCount === 0) await db.collection<User>("users").insertMany(seedUsers);

  const docsCount = await db.collection<DocumentRecord>("documents").countDocuments();
  if (docsCount === 0) await db.collection<DocumentRecord>("documents").insertMany(seedDocuments);

  const evalCount = await db.collection<EvaluationResult>("evaluations").countDocuments();
  if (evalCount === 0) await db.collection<EvaluationResult>("evaluations").insertMany(seedEvaluations);

  return db;
}

export async function getUsers() {
  const db = await ensureSeedData();
  if (!db) return seedUsers;
  return db.collection<User>("users").find({}, { projection: { _id: 0 } }).toArray();
}

export async function getUserById(id: string) {
  const users = await getUsers();
  return users.find((user) => user.id === id) || null;
}

export async function getUserByEmail(email: string) {
  const users = await getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getDocumentsForRole(role: User["role"]) {
  const db = await ensureSeedData();
  if (!db) {
    return seedDocuments.filter((doc) => role === "admin" || doc.sensitivity !== "confidential");
  }

  const query: Filter<DocumentRecord> = role === "admin" ? {} : { sensitivity: { $ne: "confidential" } };
  return db
    .collection<DocumentRecord>("documents")
    .find(query, { projection: { _id: 0 } })
    .sort({ uploadedAt: -1 })
    .toArray();
}

export async function insertDocument(document: DocumentRecord) {
  const db = await ensureSeedData();
  if (!db) return document;
  await db.collection<DocumentRecord>("documents").insertOne(document);
  return document;
}

export async function getEvaluations() {
  const db = await ensureSeedData();
  if (!db) return seedEvaluations;
  return db.collection<EvaluationResult>("evaluations").find({}, { projection: { _id: 0 } }).sort({ id: -1 }).toArray();
}

export async function insertEvaluation(evaluation: EvaluationResult) {
  const db = await ensureSeedData();
  if (!db) return evaluation;
  await db.collection<EvaluationResult>("evaluations").insertOne(evaluation);
  return evaluation;
}
