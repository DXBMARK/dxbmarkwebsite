# DXBMARK AI Agent Entry Point

---

## 1. Authority

This file is the root entry point for all AI coding agents working in this repository.

The full **DXBMARK GLOBAL AI ENGINEERING CONSTITUTION v4** is located in:

```
GEMINI.md
```

All agents must read both `AGENTS.md` and `GEMINI.md` before beginning meaningful work.

`AGENTS.md` takes precedence as the portable root context file. `GEMINI.md` contains the complete rules, platform policies, legal protections, design system rules, and subagent governance.

---

## 2. Applies To

This entry point applies to all AI-assisted development tools used in this repository, including:

- Antigravity
- Gemini
- GitHub Copilot
- Claude
- Codex
- ChatGPT
- SpecKit
- Any other AI coding assistant or IDE agent

No tool, model, or subagent is exempt from the constitution.

---

## 3. Required Reading Order

Before performing meaningful work, agents must read the following files in order, where present:

1. `AGENTS.md` ← this file
2. `GEMINI.md` ← full constitution (mandatory)
3. `docs/ai/rules/GLOBAL_AI_ENGINEERING_RULES.md` if present
4. `docs/ai/rules/PROJECT_PROFILE_DXBMARK.md` if present
5. `docs/ai/rules/ACTIVE_WORKFLOW_RULES.md` if present
6. The relevant subagent profile in `docs/ai/subagents/` if present

---

## 4. Project Classification

Agents must classify the active project before significant work begins.

Possible classifications:

- DXBMARK website
- DXBMARK application
- DXBMARK internal project
- DXBMARK operational system
- Client project
- Unknown project

If the project type is unclear, **ask before proceeding**.

Client projects must not inherit DXBMARK-specific branding, legal, domain, or platform assumptions. A dedicated Project Profile is required for client work.

---

## 5. Non-Negotiable Protected Actions

The following actions require **explicit user approval** before execution:

- Deleting files or folders
- Running destructive commands
- Installing dependencies
- Changing or upgrading dependencies
- Changing Cloudflare settings (DNS, SSL, WAF, redirects, workers, caching)
- Changing Vercel settings (deployment, environment variables, build config, domains)
- Changing GitHub workflows, secrets, or protected branches
- Changing Stripe settings (products, prices, webhooks, live-mode configuration)
- Changing Zoho data or settings (Books, CRM, Desk, Mail, Forms, Social)
- Changing `.env` files or environment variables
- Changing legal, payment, billing, privacy, or security logic
- Production deployment
- Any irreversible action

These restrictions apply equally to the main agent and all subagents.

---

## 6. DXBMARK Identity

| Field | Value |
|---|---|
| Legal company name | **DXBMARK LLC** |
| Commercial names | DXBMark, DXBMark Technology (where appropriate) |
| Canonical website | https://www.dxbmark.com |
| Primary domain | dxbmark.com |
| Tagline | **Build. Scale. Run.** |
| Company type | Technology and digital systems company |

DXBMARK must not be positioned as a marketing agency, design agency, branding studio, creative agency, advertising company, or media production company.

Use **DXBMARK LLC** for all legal, billing, compliance, privacy, and formal business contexts.

Use **DXBMark** only for brand-facing copy where that casing is intentionally selected.

Do not invent or use unapproved company names.

---

## 7. Current Stack

The official DXBMARK website currently uses:

- **Next.js** with App Router
- **TypeScript**
- **TailwindCSS**
- **DESIGN.md** (design system reference — must be read before UI changes)
- **Vercel** (deployment)
- **Cloudflare** (DNS, CDN, SSL, security)
- **GitHub** (version control)

Agents must inspect actual project files before making implementation decisions.

Do not assume build commands, folder structure, routing patterns, deployment settings, or environment variables without checking the repository.

---

## 8. Subagents

Subagent profiles are located in `docs/ai/subagents/` when present.

Available profiles include:

- `project-profiler-agent.md`
- `frontend-implementation-agent.md`
- `ui-ux-review-agent.md`
- `performance-agent.md`
- `security-compliance-agent.md`
- `devops-platform-agent.md`
- `prompt-engineering-agent.md`

Governance rules:

- No two subagents may modify the same file in parallel.
- Each subagent must declare expected files before editing.
- All subagents inherit this constitution, the active Project Profile, and all platform protection rules.
- The main agent remains responsible for final review, validation, and reporting.
- Subagents must not perform destructive, production-impacting, payment-impacting, legal-impacting, or security-impacting actions without explicit approval.

---

## 9. Validation

Agents must inspect `package.json` before assuming available commands.

Common commands may include `npm run lint`, `npm run typecheck`, `npm run build` — but use only what exists in the project.

Do not claim validation passed unless it was actually run.

After implementation, run or request validation appropriate to the task (TypeScript check, lint, build, browser verification where UI changes are made).

---

## 10. Final Rule

> Every decision must serve the active project goal while respecting the full DXBMARK GLOBAL AI ENGINEERING CONSTITUTION v4 in `GEMINI.md`.

- No random design decisions.
- No hidden dependencies.
- No uncontrolled styling.
- No copied third-party creative work.
- No unverified claims.
- No protected-file edits without approval.
- No destructive commands without approval.
- No production-impacting platform changes without approval.
- No payment, billing, banking, privacy, legal, or security changes without approval.
- No deviation from the constitution.

---

*For the full constitution, read [`GEMINI.md`](./GEMINI.md).*

*Built with ❤️ by DXBMARK LLC*
