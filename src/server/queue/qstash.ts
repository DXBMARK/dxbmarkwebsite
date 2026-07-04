import { env } from "../env";

if (typeof window !== "undefined") {
  throw new Error("Queue publisher can only be used on the server side.");
}

export interface QueuePayload {
  eventId: string;
  type: string;
  objectId: string | null;
  receivedAt: string;
}

/**
 * Publishes verified event metadata asynchronously to the QStash message queue.
 * Does not send raw payload or PII.
 *
 * @param payload Event metadata payload.
 * @returns boolean indicating successful dispatch queueing.
 */
export async function publishToQueue(payload: QueuePayload): Promise<boolean> {
  const token = env.QSTASH_TOKEN;
  if (!token) {
    console.warn("[QSTASH QUEUE] QSTASH_TOKEN is missing. Skipping async dispatch.");
    return false;
  }

  const targetUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/stripe/process-event`;
  const qstashUrl = env.QSTASH_URL.replace(/\/$/, ""); // Strip trailing slash if present

  try {
    const response = await fetch(`${qstashUrl}/v2/publish/${targetUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[QSTASH QUEUE] Failed to publish: ${response.status} - ${errText}`);
      return false;
    }

    console.log(`[QSTASH QUEUE] Event successfully published to queue: ${payload.eventId}`);
    return true;
  } catch (error: unknown) {
    const internalMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[QSTASH QUEUE] Dispatch network/internal error: ${internalMessage}`);
    return false;
  }
}
