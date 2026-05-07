import type { ClawdState } from "../types";

// 8 frames per state: the standard Codex spritesheet has 8 columns (horizontal axis = animation frames)
export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 8 },
  thinking: { row: 1, frames: 8 },
  working: { row: 2, frames: 8 },
  error: { row: 3, frames: 8 },
  happy: { row: 4, frames: 8 },
  notification: { row: 5, frames: 8 },
  sleeping: { row: 6, frames: 8 },
  waking: { row: 7, frames: 8 },
};
