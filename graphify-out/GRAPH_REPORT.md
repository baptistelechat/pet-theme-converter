# Graph Report - .  (2026-05-05)

## Corpus Check
- Corpus is ~20,700 words - fits in a single context window. You may not need a graph.

## Summary
- 46 nodes · 95 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09d9945c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Requirements & Target Apps|Requirements & Target Apps]]
- [[_COMMUNITY_Project Planning & Sprints|Project Planning & Sprints]]
- [[_COMMUNITY_RFC & Distribution Strategy|RFC & Distribution Strategy]]
- [[_COMMUNITY_Architecture & CLI Design Principles|Architecture & CLI Design Principles]]
- [[_COMMUNITY_Core Implementation Modules|Core Implementation Modules]]
- [[_COMMUNITY_APNG Encoding|APNG Encoding]]
- [[_COMMUNITY_Build Toolchain|Build Toolchain]]
- [[_COMMUNITY_State Mapping Pipeline|State Mapping Pipeline]]
- [[_COMMUNITY_CLI Prompts Layer|CLI Prompts Layer]]
- [[_COMMUNITY_Image Processing|Image Processing]]

## God Nodes (most connected - your core abstractions)
1. `Architecture Decision Document` - 28 edges
2. `pet-theme-converter RFC & Roadmap` - 14 edges
3. `Epic Breakdown Document` - 8 edges
4. `Product Requirements Document (PRD)` - 8 edges
5. `src/types.ts (Public Types & Error Classes)` - 8 edges
6. `Story 1.1: Initialisation du projet et configuration du build` - 6 edges
7. `Product Brief` - 6 edges
8. `src/adapters/clawd.ts (Clawd on Desk Output Adapter)` - 6 edges
9. `Sprint Status YAML` - 5 edges
10. `Clawd on Desk (Primary Target App)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `pet-theme-converter RFC & Roadmap` --semantically_similar_to--> `Product Requirements Document (PRD)`  [INFERRED] [semantically similar]
  docs/pet-theme-converter-RFC.md → _bmad-output/planning-artifacts/prd.md
- `SpriteManifest Interface` --semantically_similar_to--> `STATE_MAPPING: Petdex to Clawd State Translation`  [INFERRED] [semantically similar]
  docs/pet-theme-converter-RFC.md → _bmad-output/planning-artifacts/architecture.md
- `Agent Memory System (CLAUDE.md)` --references--> `pet-theme-converter RFC & Roadmap`  [INFERRED]
  CLAUDE.md → docs/pet-theme-converter-RFC.md
- `pet-theme-converter RFC & Roadmap` --references--> `Core + Output Adapters Architecture Pattern`  [EXTRACTED]
  docs/pet-theme-converter-RFC.md → _bmad-output/planning-artifacts/architecture.md
- `Architecture Decision Document` --references--> `pet-theme-converter RFC & Roadmap`  [EXTRACTED]
  _bmad-output/planning-artifacts/architecture.md → docs/pet-theme-converter-RFC.md

## Hyperedges (group relationships)
- **Core Conversion Pipeline Data Flow** — module_core_fetch_spritesheet, module_core_detect_grid, module_core_slice_frames, module_core_encode_apngs, module_adapters_clawd [EXTRACTED 1.00]
- **Strict Architectural Layer Isolation (types -> core -> adapters -> cli)** — module_src_types, module_core_state_mapping, module_adapters_clawd, module_cli_index, concept_clack_prompts_isolation [EXTRACTED 1.00]
- **Planning Artifacts Triad (PRD + Architecture + Epics)** — prd_doc, architecture_doc, epics_doc, readiness_report [EXTRACTED 1.00]

## Communities (10 total, 2 thin omitted)

### Community 0 - "Requirements & Target Apps"
Cohesion: 0.39
Nodes (8): Core + Output Adapters Architecture Pattern, OutputAdapter Interface (Public Contract), theme.json (Clawd on Desk Theme Manifest), Clawd on Desk (Primary Target App), Petdex Gallery (External), Product Requirements Document (PRD), Product Brief, Implementation Readiness Assessment Report

### Community 1 - "Project Planning & Sprints"
Cohesion: 0.67
Nodes (7): Epic 1: Fondation du Projet & Architecture de Contribution, Epic 2: Pipeline de Conversion Core, Epic 3: Experience CLI & Livraison du Theme Clawd, Epic 4: CI, Documentation & Publication npm, Epic Breakdown Document, Sprint Status YAML, Story 1.1: Initialisation du projet et configuration du build

### Community 2 - "RFC & Distribution Strategy"
Cohesion: 0.33
Nodes (6): Agent Memory System (CLAUDE.md), Independent npm Package Distribution Strategy, SpriteManifest Interface, Clyde (Secondary Target App), Codex Desktop (OpenAI), pet-theme-converter RFC & Roadmap

### Community 3 - "Architecture & CLI Design Principles"
Cohesion: 0.47
Nodes (6): Typed Error Classes with exitCode, archiver (ZIP Creation Library), src/adapters/clawd.ts (Clawd on Desk Output Adapter), src/cli/index.ts (Entry Point), src/core/fetch-spritesheet.ts, src/types.ts (Public Types & Error Classes)

### Community 4 - "Core Implementation Modules"
Cohesion: 0.5
Nodes (5): Architecture Decision Document, CI GitHub Actions Matrix (3 OS x Node 18/20), @clack/prompts CLI Isolation Rule, onProgress Callback Pattern, src/cli/messages.ts

### Community 5 - "APNG Encoding"
Cohesion: 0.5
Nodes (4): Manual Minimal Setup (No CLI Framework), Zero Persistent State Design, tsup (ESM Bundler), tsx (TypeScript Dev Runner)

### Community 6 - "Build Toolchain"
Cohesion: 0.67
Nodes (3): APNG Output Format Decision, apngasm-bin (APNG Assembly Library), src/core/encode-apngs.ts

### Community 7 - "State Mapping Pipeline"
Cohesion: 0.67
Nodes (3): STATE_MAPPING: Petdex to Clawd State Translation, src/core/slice-frames.ts, src/core/state-mapping.ts

## Knowledge Gaps
- **6 isolated node(s):** `Agent Memory System (CLAUDE.md)`, `Independent npm Package Distribution Strategy`, `Clyde (Secondary Target App)`, `Codex Desktop (OpenAI)`, `src/cli/messages.ts` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Architecture Decision Document` connect `Core Implementation Modules` to `Requirements & Target Apps`, `Project Planning & Sprints`, `RFC & Distribution Strategy`, `Architecture & CLI Design Principles`, `APNG Encoding`, `Build Toolchain`, `State Mapping Pipeline`, `CLI Prompts Layer`, `Image Processing`?**
  _High betweenness centrality (0.688) - this node is a cross-community bridge._
- **Why does `pet-theme-converter RFC & Roadmap` connect `RFC & Distribution Strategy` to `Requirements & Target Apps`, `Core Implementation Modules`, `Build Toolchain`, `CLI Prompts Layer`, `Image Processing`?**
  _High betweenness centrality (0.315) - this node is a cross-community bridge._
- **Why does `Epic Breakdown Document` connect `Project Planning & Sprints` to `Requirements & Target Apps`, `Core Implementation Modules`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `pet-theme-converter RFC & Roadmap` (e.g. with `Agent Memory System (CLAUDE.md)` and `Product Requirements Document (PRD)`) actually correct?**
  _`pet-theme-converter RFC & Roadmap` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Product Requirements Document (PRD)` (e.g. with `pet-theme-converter RFC & Roadmap` and `Product Brief`) actually correct?**
  _`Product Requirements Document (PRD)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Agent Memory System (CLAUDE.md)`, `Independent npm Package Distribution Strategy`, `Clyde (Secondary Target App)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._