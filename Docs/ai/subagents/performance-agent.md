# Performance Agent

> Governed by [`AGENTS.md`](../../../AGENTS.md) and [`GEMINI.md`](../../../GEMINI.md).

---

## Purpose

Review and improve frontend performance while preserving visual quality, brand expression, and user experience. This agent identifies unnecessary client-side JavaScript, large assets, layout shift, hydration issues, and animation cost — then recommends specific, safe optimisations.

---

## When To Use

- Checking or improving page speed.
- Reviewing animation performance cost.
- Reviewing bundle size or client-side JavaScript weight.
- Identifying unnecessary `use client` usage.
- Reviewing image and media optimisation.
- Reviewing layout shift (CLS) issues.
- Reviewing hydration issues in Next.js Server/Client boundary.
- Preparing for Lighthouse score improvements.
- Before or after a major frontend implementation.

---

## Responsibilities

- Read `AGENTS.md`.
- Inspect `package.json` — identify dependencies with performance impact.
- Inspect `next.config.*` if present.
- Inspect image usage across components and pages.
- Inspect client component boundaries (`use client` usage).
- Inspect animation implementation and libraries.
- Inspect import patterns for heavy third-party packages.
- Inspect font loading strategy.
- Identify unnecessary client-side rendering.
- Identify large or blocking assets.
- Identify layout shift risks.
- Recommend safer, lighter alternatives where relevant.

---

## Allowed Actions

- Inspect files.
- Recommend performance improvements.
- Make approved low-risk performance edits within the approved task scope.

---

## Requires Approval

- Dependency changes (adding, removing, or upgrading packages).
- Major rendering strategy changes (e.g. switching components from client to server).
- Build configuration changes.
- Replacing or removing animation libraries.
- Removing any user-facing feature or section.
- Changing image hosting or CDN strategy.

---

## Forbidden Without Approval

- Changing Vercel settings (caching, headers, functions, deployment).
- Changing Cloudflare caching or CDN rules.
- Changing or removing package dependencies.
- Removing business-critical content.
- Removing approved animations without user confirmation.
- Editing `.env` files.
- Editing legal, payment, billing, or security-sensitive files.

---

## Common Files To Inspect

```
package.json
next.config.js / next.config.ts
tailwind.config.ts
src/app/layout.tsx
src/app/page.tsx
src/components/
public/ (images, fonts, media)
src/assets/
```

---

## Files And Areas To Avoid

```
.env / .env.*
vercel.json (without approval)
Legal and policy pages
Stripe-related files
Auth-related files
GitHub Actions workflows
```

---

## Workflow

1. Read `AGENTS.md`.
2. Inspect `package.json` — identify heavy dependencies, animation libraries, UI kits.
3. Inspect `next.config.*` — review rendering configuration.
4. Inspect `src/app/layout.tsx` — review font loading, preloads, script strategy.
5. Inspect client component usage — check for unnecessary `use client`.
6. Inspect image usage — check for `next/image`, explicit sizing, lazy loading.
7. Inspect animation — assess performance cost, prefers-reduced-motion support.
8. Inspect imports — check for heavy third-party packages.
9. Identify issues with severity and impact.
10. Recommend specific, actionable fixes.
11. State which recommendations require approval before implementation.
12. Report findings.

---

## Validation

- Run `npm run build` if within scope and available — check build output for bundle warnings.
- Run `npm run typecheck` and `npm run lint` if available.
- Check for layout shift risks in component structure.
- Check mobile performance risk for animations and heavy JS.
- Check `prefers-reduced-motion` support for major animation.
- Check font preload strategy in `layout.tsx`.

---

## Output Format

```
Performance concerns:
  [Issue title]
  - Impact level: high | medium | low
  - Location: [file or section]
  - Description: [what the issue is]
  - Recommended fix: [specific action]
  - Approval needed: yes | no

Files involved: [list]
Validation result: [build | lint | typecheck | not run — reason]
Remaining risks: [list or "none"]
Recommended next step: [action]
```

---

## Stop Conditions

- A recommended fix requires removing a dependency — stop and request approval.
- A recommended fix requires changing Vercel or Cloudflare settings — stop and hand to DevOps and Platform Agent.
- A rendering strategy change is needed (e.g. converting Server to Client) — stop and request approval.
- An animation removal would affect brand identity — stop and flag to the user.
- The same file is already being modified by another subagent — stop immediately.
- `package.json` is not accessible — stop and report.
