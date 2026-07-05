#!/usr/bin/env node
// SpecKit DB connectivity check — uses @neondatabase/serverless
// Run from project root: node .specify/scripts/check-db.js
// Exit 0 = connected, Exit 1 = failed

"use strict";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    const result = await sql`SELECT 1 AS ok`;
    if (result && result[0] && result[0].ok === 1) {
      console.log("ok");
      process.exit(0);
    } else {
      console.error("unexpected result");
      process.exit(1);
    }
  } catch (err) {
    console.error("fail:", err.message);
    process.exit(1);
  }
}

main();
