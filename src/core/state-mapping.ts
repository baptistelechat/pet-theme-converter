import type { ClawdState } from "../types";

export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 9 },
  thinking: { row: 1, frames: 9 },
  working: { row: 2, frames: 9 },
  error: { row: 3, frames: 9 },
  happy: { row: 4, frames: 9 },
  notification: { row: 5, frames: 9 },
  sleeping: { row: 6, frames: 9 },
  waking: { row: 7, frames: 9 },
};
