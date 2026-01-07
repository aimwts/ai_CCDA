import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db";
import { sql } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Gemini embedding model
const MODEL = "text-embedding-004";

// Ensures the embedding is a clean float[] of length 768
function normalizeEmbedding(raw: any): number[] {
  if (!raw) throw new Error("Empty embedding response");

  // Gemini returns: { embedding: { values: number[] } }
  if (raw.embedding?.values) return raw.embedding.values;

  // Fallback: if the SDK changes shape
  if (Array.isArray(raw)) return raw;

  throw new Error("Unknown embedding format from Gemini");
}

// Generate embeddings for text
export async function embedText(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.embedContent(text);

    return normalizeEmbedding(result);
  } catch (err) {
    console.error("❌ embedText error:", err);
    throw err;
  }
}

// Store a message embedding in DB
export async function storeMessageEmbedding(
  messageId: string,
  text: string
) {
  const embedding = await embedText(text);

  await db.execute(
    sql`
      INSERT INTO message_embeddings (message_id, embedding)
      VALUES (${messageId}, ${embedding})
    `
  );

  return embedding;
}

// Store a knowledge base embedding
export async function storeKnowledgeEmbedding(
  id: string,
  text: string
) {
  const embedding = await embedText(text);

  await db.execute(
    sql`
      INSERT INTO knowledge_embeddings (id, embedding)
      VALUES (${id}, ${embedding})
      ON CONFLICT (id)
      DO UPDATE SET embedding = EXCLUDED.embedding
    `
  );

  return embedding;
}

// Retrieve similar knowledge base entries
export async function getRelevantKnowledge(
  query: string,
  limit = 5
) {
  const queryEmbedding = await embedText(query);

  const rows = await db.execute(
    sql`
      SELECT
        id,
        content,
        1 - (embedding <=> ${queryEmbedding}) AS similarity
      FROM knowledge_embeddings
      ORDER BY embedding <=> ${queryEmbedding}
      LIMIT ${limit}
    `
  );

  return rows;
}

// Retrieve similar messages
export async function getSimilarMessages(
  query: string,
  limit = 5
) {
  const queryEmbedding = await embedText(query);

  const rows = await db.execute(
    sql`
      SELECT
        message_id,
        1 - (embedding <=> ${queryEmbedding}) AS similarity
      FROM message_embeddings
      ORDER BY embedding <=> ${queryEmbedding}
      LIMIT ${limit}
    `
  );

  return rows;
}
