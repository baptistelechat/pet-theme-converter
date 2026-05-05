# Graph Report - .  (2026-05-05)

## Corpus Check
- Corpus is ~19,153 words - fits in a single context window. You may not need a graph.

## Summary
- 82 nodes · 174 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Architecture & APNG Pipeline|Core Architecture & APNG Pipeline]]
- [[_COMMUNITY_Distribution & CI Infrastructure|Distribution & CI Infrastructure]]
- [[_COMMUNITY_Key Design Decisions|Key Design Decisions]]
- [[_COMMUNITY_Domain Knowledge & Learnings|Domain Knowledge & Learnings]]
- [[_COMMUNITY_Blockers & Problem Space|Blockers & Problem Space]]
- [[_COMMUNITY_CI Strategy & Readiness|CI Strategy & Readiness]]
- [[_COMMUNITY_Project Evaluations|Project Evaluations]]
- [[_COMMUNITY_Sprint Planning & PRD|Sprint Planning & PRD]]
- [[_COMMUNITY_Architecture Artifact|Architecture Artifact]]
- [[_COMMUNITY_Agent Config|Agent Config]]

## God Nodes (most connected - your core abstractions)
1. `Architecture Decision Document — pet-theme-converter` - 17 edges
2. `pet-theme-converter RFC & Roadmap` - 16 edges
3. `Core Pipeline — Pure functional image processing pipeline` - 12 edges
4. `Decisions Memory Index` - 11 edges
5. `OutputAdapter Interface — Public contract for theme packaging modules` - 11 edges
6. `Learnings Register Index` - 10 edges
7. `Agent Session Journal` - 9 edges
8. `Product Requirements Document — pet-theme-converter` - 8 edges
9. `Epic Breakdown — pet-theme-converter` - 8 edges
10. `Implementation Readiness Assessment Report 2026-05-04` - 8 edges

## Surprising Connections (you probably didn't know these)
- `BMAD Epic Coverage Map` --conceptually_related_to--> `Implementation Readiness Assessment Report 2026-05-04`  [INFERRED]
  .claude/memory/learnings/LRN-010.md → _bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md
- `SpriteManifest — Intermediate format describing spritesheet grid` --semantically_similar_to--> `STATE_MAPPING — Centralized Petdex-to-Clawd state mapping constant`  [INFERRED] [semantically similar]
  docs/pet-theme-converter-RFC.md → _bmad-output/planning-artifacts/architecture.md
- `Implementation Readiness Assessment Report 2026-05-04` --references--> `Epics & Stories Document (epics.md)`  [INFERRED]
  _bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md → .claude/memory/journal.md
- `Implementation Readiness Assessment Report 2026-05-04` --references--> `PRD pet-theme-converter v1.0`  [INFERRED]
  _bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md → .claude/memory/evals/EVAL-004.md
- `BDR-006 — 100% interactive CLI, no config file in v0.1` --rationale_for--> `@clack/prompts — Interactive CLI prompt library`  [INFERRED]
  .claude/memory/decisions/BDR-006.md → docs/pet-theme-converter-RFC.md

## Hyperedges (group relationships)
- **Core Conversion Pipeline: spritesheet → frames → APNG → adapter output** — concept_core_pipeline, concept_sharp, concept_apngasm_bin, concept_output_adapter [EXTRACTED 0.95]
- **CLI UX Layer: prompts + progress + messages** — concept_clack_prompts, concept_progress_callback, concept_typed_errors [EXTRACTED 0.95]
- **Ecosystem Bridge: Petdex/Codex spritesheet format → Clawd APNG theme** — concept_petdex, concept_spritesheet_format, concept_clawd_on_desk, concept_apng_output [EXTRACTED 0.95]
- **Complete Planning Chain: RFC → Brief → PRD → Architecture → Epics → Readiness** — product_brief_document, prd_document, architecture_document, epics_md_document, implementation_readiness_report [EXTRACTED 1.00]
- **BMAD Workflow Adaptation Learnings** — lrn004_bmad_shortcircuit, lrn006_bmad_scope_duplication, lrn007_bmad_category_filter, lrn008_language_check [INFERRED 0.85]
- **Petdex to Clawd State Mapping System** — petdex_spritesheet_format, lrn002_state_mapping, lrn003_provisional_mapping, clawd_on_desk_states [EXTRACTED 0.95]

## Communities (10 total, 2 thin omitted)

### Community 0 - "Core Architecture & APNG Pipeline"
Cohesion: 0.26
Nodes (16): Architecture Decision Document — pet-theme-converter, BDR-001 — APNG output format instead of animated SVG, APNG Output — Animated PNG format for Clawd theme states, apngasm-bin — APNG animation assembly binary, @clack/prompts — Interactive CLI prompt library, Codex Desktop — OpenAI AI agent with animated pet companions, Core Pipeline — Pure functional image processing pipeline, ProgressCallback — Optional progress injection into Core pipeline functions (+8 more)

### Community 1 - "Distribution & CI Infrastructure"
Cohesion: 0.29
Nodes (12): archiver — ZIP creation library for clawd adapter, CI Matrix — 3 OS × Node 18/20 GitHub Actions workflow, CONTRIBUTING.md — Adapter writing and submission guide, Direct Install Mode — Auto-copy to Clawd on Desk themes folder, Epic 1 — Project Foundation & Contribution Architecture, Epic 2 — Core Conversion Pipeline, Epic 3 — CLI Experience & Clawd Theme Delivery, Epic 4 — CI, Documentation & npm Publication (+4 more)

### Community 2 - "Key Design Decisions"
Cohesion: 0.35
Nodes (11): BDR-002 — Independent npm package + mini doc PRs distribution, BDR-003 — Core + interchangeable Output Adapters architecture, BDR-004 — Non-standard spritesheet handling: warning + default 9×8 grid, BDR-005 — Accept all Codex-compatible sources, not just Petdex, BDR-006 — 100% interactive CLI, no config file in v0.1, BDR-007 — Network fetch timeout = 30 seconds, BDR-008 — Pure functional pipeline + onProgress callbacks, BDR-009 — OutputAdapter interface: AdapterInput receives pre-encoded APNGs (+3 more)

### Community 3 - "Domain Knowledge & Learnings"
Cohesion: 0.29
Nodes (11): BMAD Workflow Adaptation Pattern, Clawd on Desk Animation States, Learnings Register Index, LRN-001: Petdex Standardized Format 8×9 Grid 192×208px 9 States, LRN-002: Petdex→Clawd State Mapping (6 of 9 states mapped), LRN-003: Petdex→Clawd Mapping is Provisional and Adjustable, LRN-004: bmad-product-brief Short-Circuitable When RFC + Memory Present, LRN-005: resolve_customization.py Unusable on Windows Without Python - Manual Fallback Sufficient (+3 more)

### Community 4 - "Blockers & Problem Space"
Cohesion: 0.33
Nodes (10): BLK-001 — No bridge between Petdex/Codex and Claude Code apps, BLK-002 — resolve_customization.py not executable on Windows, Blockers Memory Index, Incompatible Ecosystem Formats — Petdex WebP spritesheet vs Clawd APNG states, Clawd on Desk — Electron desktop pet app for Claude Code, Clyde — Tauri 2 + Svelte 5 desktop pet app, Petdex — Open-source pet gallery for Codex Desktop, Implementation Readiness Assessment Report 2026-05-04 (+2 more)

### Community 5 - "CI Strategy & Readiness"
Cohesion: 0.32
Nodes (8): BDR-011: CI GitHub Actions 3 OS × Node 18/20, CI Matrix Strategy: windows/macos/ubuntu × node18/20, BMAD Epic Coverage Map, EVAL-007: Implementation Readiness READY WITH CONDITIONS + 3 Amendments, FR18: Manual Clawd Path UX Flow, Agent Session Journal, LRN-009: CLI Tool Core Epic Without End-User Value is Acceptable Derogation, LRN-010: Coverage Map ≠ UX AC Coverage - Verify WHEN/HOW Not Just WHAT

### Community 6 - "Project Evaluations"
Cohesion: 0.4
Nodes (6): EVAL-001: Distribution Strategy npm vs PR, EVAL-002: Brainstorming as RFC Alignment Check, EVAL-003: Product Brief from RFC + Agent Memory, Evals Register Index, npm Independent Package Distribution Strategy, Product Brief Document

### Community 7 - "Sprint Planning & PRD"
Cohesion: 0.4
Nodes (5): Epics & Stories Document (epics.md), EVAL-004: PRD pet-theme-converter v1.0 Complete, EVAL-006: Epics & Stories v1.0 - 4 epics, 14 stories, LRN-008: Check document_output_language Before bmad-epics-and-stories Step-03, PRD pet-theme-converter v1.0

## Knowledge Gaps
- **10 isolated node(s):** `CLAUDE.md — Agent Memory Protocol`, `tsup — ESM CLI bundle tool for npm publishing`, `tsx — Direct TypeScript execution for local development`, `CI Matrix Strategy: windows/macos/ubuntu × node18/20`, `Clawd on Desk Animation States` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Implementation Readiness Assessment Report 2026-05-04` connect `Blockers & Problem Space` to `Core Architecture & APNG Pipeline`, `Distribution & CI Infrastructure`, `CI Strategy & Readiness`, `Sprint Planning & PRD`?**
  _High betweenness centrality (0.478) - this node is a cross-community bridge._
- **Why does `EVAL-007: Implementation Readiness READY WITH CONDITIONS + 3 Amendments` connect `CI Strategy & Readiness` to `Blockers & Problem Space`, `Project Evaluations`, `Sprint Planning & PRD`?**
  _High betweenness centrality (0.332) - this node is a cross-community bridge._
- **Why does `Architecture Decision Document — pet-theme-converter` connect `Core Architecture & APNG Pipeline` to `Distribution & CI Infrastructure`, `Blockers & Problem Space`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **What connects `CLAUDE.md — Agent Memory Protocol`, `tsup — ESM CLI bundle tool for npm publishing`, `tsx — Direct TypeScript execution for local development` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._