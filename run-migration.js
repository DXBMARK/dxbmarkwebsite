const { neon } = require("@neondatabase/serverless");

const databaseUrl = "postgresql://neondb_owner:npg_XP7bRy6wxTLF@ep-summer-math-ahuw2ik4.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const sql = neon(databaseUrl);
  console.log("Running migration queries...");
  try {
    await sql`
      ALTER TABLE stripe_webhook_events
        ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;
    `;
    await sql`
      ALTER TABLE stripe_webhook_events
        ADD COLUMN IF NOT EXISTS webhook_status VARCHAR(50) NOT NULL DEFAULT 'received';
    `;
    await sql`
      ALTER TABLE stripe_webhook_events
        ADD COLUMN IF NOT EXISTS db_status VARCHAR(50) NOT NULL DEFAULT 'pending';
    `;
    await sql`
      ALTER TABLE stripe_webhook_events
        ADD COLUMN IF NOT EXISTS queue_status VARCHAR(50) NOT NULL DEFAULT 'pending';
    `;
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

main();
