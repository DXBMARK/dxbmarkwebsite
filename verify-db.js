const { neon } = require("@neondatabase/serverless");

const databaseUrl = "postgresql://neondb_owner:npg_XP7bRy6wxTLF@ep-summer-math-ahuw2ik4.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const sql = neon(databaseUrl);
  console.log("Querying stripe_webhook_events...");
  try {
    const rows = await sql`
      SELECT stripe_event_id, event_type, processing_status, webhook_status, db_status, queue_status, retry_count
      FROM stripe_webhook_events
      ORDER BY id DESC
      LIMIT 5;
    `;
    console.log("Latest events in database:");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error("Query failed:", err);
  }
}

main();
