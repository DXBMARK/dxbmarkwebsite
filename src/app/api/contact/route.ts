import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema to validate contact payloads server-side
const contactSchema = z.object({
  messageType: z.string().min(1, "Message type is required"),
  contact: z.object({
    fullName: z.string().min(1, "Full name is required").max(100),
    company: z.string().max(100).optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    countryCode: z.string().length(2),
    countryName: z.string().min(1),
    callingCode: z.string().min(1),
    phoneE164: z.string().optional(),
    phoneValidationType: z.string().optional(),
    preferredContactMethod: z.string().min(1),
    preferredLanguage: z.string().min(1),
  }),
  routingTarget: z.string().email(),
  projectDetails: z.object({
    hasWebsite: z.string().nullable().optional(),
    businessAge: z.string().nullable().optional(),
    selectedServices: z.array(z.string()).optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    attribution: z.string().optional(),
    websiteUrl: z.string().url().or(z.literal("")).optional(),
    instagramHandle: z.string().optional(),
    projectMessage: z.string().max(2000).optional(),
    businessChallenge: z.string().optional(),
  }).optional(),
  supportDetails: z.object({
    isExistingClient: z.string().nullable().optional(),
    priority: z.string().optional(),
  }).optional(),
  privacyDetails: z.object({
    privacyRequestType: z.string().optional(),
  }).optional(),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: "Consent must be accepted",
  }),
  submittedAt: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();
  try {
    const body = await request.json();

    // 1. Validate the payload using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      // Log only safe validation metadata (issue count) and return generic error
      console.warn("[LEAD INGESTION VALIDATION FAILED]", {
        issueCount: result.error.issues.length,
        receivedAt,
      });

      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const payload = result.data;

    // 2. Sanitize and log metadata securely (No PII, no messages, no emails, no names, no routingTarget)
    const emailDomain = payload.contact.email.split("@")[1] || "unknown";
    console.log("[LEAD INGESTION RECEIVED]", {
      messageType: payload.messageType,
      hasCompany: !!payload.contact.company,
      emailDomain,
      countryCode: payload.contact.countryCode,
      preferredLanguage: payload.contact.preferredLanguage,
      receivedAt,
    });

    // 3. Fast 200 Response
    return NextResponse.json({
      success: true,
      message: "Lead received successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Lead Ingestion Error:", msg);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
