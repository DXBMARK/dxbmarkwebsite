# DXBMARK Design & Implementation Constitution v1

## Preamble
This constitution strictly governs the design, implementation, and architectural decisions for the DXBMARK LLC website. It serves to enforce a unified, premium visual identity and a maintainable, high-performance codebase. All future pages, components, and updates must comply with these directives without exception.

## 1. Single Source of Truth
- The **Homepage Hero Section** (`src/components/home/hero/HeroSection.tsx`) and the **Reference Design Document** (`DESIGN.md`) are the absolute benchmarks for visual layout, typography, and atmospheric styling.
- Template-derived UI that does not match the DXBMARK brand identity is strictly forbidden. The project is not a generic template, nor an Automatix clone with a logo swap.

## 2. Design Token Strictness
- **No Ad-Hoc Styling**: All styling must map back to central design tokens.
- **No Hardcoded Values**: Raw hex values (e.g., `bg-[#0f172a]`, `text-[#f97e1a]`) or hardcoded arbitrary spacing values are strictly prohibited.
- Developers must use predefined CSS variables from `globals.css` (e.g., `var(--color-bg-primary)`, `var(--color-accent-primary)`) or their equivalent centralized Tailwind classes.

## 3. Component Reusability & Standardization
- **Inconsistent Systems Forbidden**: Do not recreate buttons, badges, cards, or inputs for new pages.
- **Badges**: All badges must use the animated double-border gradient spinner class structure defined in `HeroBadge.tsx`. Static mock representations are not allowed.
- **Buttons**: The centralized `<Button>` component must be used exclusively. Inline `<button>` tags are banned.
- **Inputs and Forms**: Ad-hoc classes like `.contact-input` must be replaced by standard layout tokens. Forms must share the same foundational styling across the entire site.
- **Unnecessary Components**: Avoid creating new UI primitives if an existing component can be generalized or reused.

## 4. Content & Copy Standards
- **No Fake Content**: "Lorem Ipsum", generic placeholders, or irrelevant template copy are prohibited. Real DXBMARK data and messaging must be used.
- **No Public Implementation Notes**: Customer-facing pages must never display technical notes, development progress, routing info, or internal database architectures (e.g., MySQL, Zoho integrations).

## 5. Animation & Motion Behavior
- **Unified Engine**: Animations must be driven by **GSAP** (GreenSock) or standard CSS transitions. The introduction of other animation libraries (e.g., Framer Motion) without explicit approval is a violation.
- **Consistency**: Animation timelines should follow a consistent duration (typically `0.6s - 0.8s`) and easing (`power3.out`).
- **Reduced Motion**: All animations must respect user system preferences (`prefers-reduced-motion`), primarily by disabling infinite marquees or removing large positional translations.

## 6. Dependency & Architecture Strictness
- **No Unnecessary Dependencies**: External packages, libraries, or CDNs (e.g., `d3`, `topojson-client`) must be verified and approved before inclusion. 
- Avoid bloated dependencies. Leverage the existing Next.js and React ecosystem native to the project.
- **No Repeated Redesign Cycles**: Follow the "Understand, Analyze, Propose, Approve, Implement" cycle. Do not unilaterally alter the visual direction or architecture.

## 7. Development Enforcement
Before implementing any new page or modifying an existing one, the developer must:
1. Consult this Constitution.
2. Run a comparative audit against the `HeroSection`.
3. Stop and request explicit approval from the supervising developer if the task involves hard design decisions, architectural shifts, or new dependencies.

---
Built with ❤️ by [DXBMARK LLC](https://dxbmark.com/)
