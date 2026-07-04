# Component Structure Audit & File Mapping

This document details the audit of existing components and folder structures compared against referenced paths in the tasks list, establishing reusable file patterns for User Story 1 (US1) and User Story 2 (US2).

---

## 1. Audit Summary

| Referenced Path in `tasks.md` | Actual Workspace Path | Status | Recommendation / Action |
| :--- | :--- | :--- | :--- |
| `src/components/layout/footer.tsx` | `src/components/layout/footer.tsx` | **Exists** | Reuse and modify for watermark styling and footer compliance blocks. |
| `src/components/home/Services.tsx` | `src/components/home/services/ServicesSection.tsx` | **Missing** (Structured under subdirectory) | **Do not create new file.** Reuse/modify `src/components/home/services/ServicesSection.tsx`. |
| `src/components/contact/ContactForm.tsx` | `src/components/contact/ContactSection.tsx` | **Missing** (Inline in Section) | **Do not create new file.** Re-use and modify the existing form layout in `src/components/contact/ContactSection.tsx`. |
| `src/components/common/CookieConsent.tsx` | `src/components/layout/CookieConsent.tsx` | **Missing** | Create as new component under layout: `src/components/layout/CookieConsent.tsx`. |
| `src/app/metadata.ts` | `src/app/layout.tsx` | **Missing** (Defined inline) | **Do not create new file.** Reuse and modify the metadata definition in `src/app/layout.tsx`. |
| `src/content/legal-documents/` | `src/content/legal-documents/` | **Exists** | Contains 12 compliant legal Markdown files. Reuse as is. |
| `src/app/api/contact/route.ts` | — | **Missing** | Create as a new Next.js App Router route for lead ingestion. |

---

## 2. Reusability & Duplicate Prevention Rules

- **Form Components**: `ContactSection.tsx` is a large, high-fidelity component (line counts ~1100+) containing validation and option selection states. Do not isolate a separate `ContactForm.tsx` component to avoid duplicating form state validation and UI rendering.
- **Services Presentation**: Services are modeled using `ServicesSection.tsx` (the wrapper container) and `ServiceCard.tsx` (individual items). Do not add a root-level `Services.tsx` component.
- **Metadata Management**: Global website SEO values (OpenGraph, canonical links, description headers) are exported directly from `src/app/layout.tsx`. Do not create a separate `src/app/metadata.ts`.
- **Cookie Consent**: The project features a `CookieSettingsButton.tsx` inside the `src/components/layout/` directory. Keep cookie consent logic unified by creating the new `CookieConsent.tsx` component inside the same folder: `src/components/layout/CookieConsent.tsx`.
