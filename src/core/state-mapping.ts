import type { ClawdState } from "../types";

// Codex spritesheet row layout (9 rows × 8 columns max, 0-indexed):
//   row 0 — idle       (6 frames)  → Clawd: idle
//   row 1 — run right  (8 frames)  → unmapped (potential DnD event in future Clawd versions)
//   row 2 — run left   (8 frames)  → unmapped (potential DnD event in future Clawd versions)
//   row 3 — waving     (4 frames)  → Clawd: notification + waking (shared animation)
//   row 4 — jumping    (5 frames)  → Clawd: happy
//   row 5 — failed     (8 frames)  → Clawd: error
//   row 6 — waiting    (6 frames)  → Clawd: sleeping
//   row 7 — running    (6 frames)  → Clawd: working
//   row 8 — review     (6 frames)  → Clawd: thinking
// Source: BDR-022 — validated by Baptiste on real Petdex spritesheets (2026-05-07)
export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 6 }, // Codex: idle
  thinking: { row: 8, frames: 6 }, // Codex: review
  working: { row: 7, frames: 6 }, // Codex: running
  error: { row: 5, frames: 8 }, // Codex: failed
  happy: { row: 4, frames: 5 }, // Codex: jumping
  notification: { row: 3, frames: 4 }, // Codex: waving
  sleeping: { row: 6, frames: 6 }, // Codex: waiting
  waking: { row: 3, frames: 4 }, // Codex: waving (same row as notification)
};
