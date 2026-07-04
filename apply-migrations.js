const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const databaseUrl = "postgresql://neondb_owner:npg_XP7bRy6wxTLF@ep-summer-math-ahuw2ik4.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

function stripComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/--.*$/gm, "")           // Remove line comments
    .trim();
}

async function main() {
  const sql = neon(databaseUrl);
  const migrationsDir = path.join(__dirname, "src/db/migrations");
  
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  console.log("Found migrations:", files);

  for (const file of files) {
    console.log(`\n=== Applying migration: ${file} ===`);
    const filePath = path.join(migrationsDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const cleanContent = stripComments(rawContent);

    // Split SQL by semicolon, filtering out empty statements
    const statements = cleanContent
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      console.log(`Executing statement:\n${stmt.substring(0, 100)}...`);
      try {
        await sql.query(stmt);
      } catch (err) {
        console.error(`Error:`, err.message);
      }
    }
  }

  console.log("\nAll migrations executed!");
}

main();
