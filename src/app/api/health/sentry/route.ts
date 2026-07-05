// SpecKit Sentry Connectivity Verification Route
// src/app/api/health/sentry/route.ts

import { NextResponse } from "next/server";
import { captureWebhookException } from "@/server/observability/sentry";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function GET() {
  const isEnabled = process.env.SENTRY_TEST_ENABLED === "true";

  if (!isEnabled) {
    console.log("[SENTRY CONNECTIVITY TEST] Endpoint accessed but SENTRY_TEST_ENABLED is not 'true'. Returning 403 Forbidden.");
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    console.log("[SENTRY CONNECTIVITY TEST] Triggering test exception...");
    
    // Trigger exception with harmless payload
    captureWebhookException(new Error("DXBMARK Sentry connectivity test"), {
      route: "/api/health/sentry",
      stage: "test",
    });

    // Give Sentry up to 2 seconds to flush events to the network
    await Sentry.flush(2000);

    return NextResponse.json({
      ok: true,
      sentryTest: true,
      message: "Test Sentry event triggered successfully",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[SENTRY CONNECTIVITY TEST] Failed to trigger test Sentry event:", msg);
    return NextResponse.json({
      ok: false,
      error: msg,
    }, { status: 500 });
  }
}
