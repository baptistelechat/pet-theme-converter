import sharp from "sharp";
import { ValidationError } from "../types";
import type { ClawdState, ProgressCallback } from "../types";
import type { GridInfo } from "./detect-grid";
import { STATE_MAPPING } from "./state-mapping";

/**
 * Slice a spritesheet buffer into individual frames grouped by Clawd state.
 * @param buffer - Raw image data returned by `fetchSpritesheet`.
 * @param grid - Grid metadata returned by `detectGrid`.
 * @param onProgress - Optional callback invoked once per state with a human-readable label.
 * @returns A record mapping each ClawdState to its extracted PNG frames.
 * @throws {ValidationError} If the buffer is empty or sharp fails to extract a frame.
 */
export const sliceFrames = async (
  buffer: Buffer,
  grid: GridInfo,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer[]>> => {
  if (!buffer || buffer.length === 0)
    throw new ValidationError("Empty buffer: no spritesheet data to slice.");

  const result = {} as Record<ClawdState, Buffer[]>;
  const stateEntries = Object.entries(STATE_MAPPING) as [
    ClawdState,
    { row: number; frames: number },
  ][];
  const sharpBase = sharp(buffer);

  for (let stateIndex = 0; stateIndex < stateEntries.length; stateIndex++) {
    const [state, { row, frames }] = stateEntries[stateIndex];
    onProgress?.(`Slicing frames: ${state}`, stateIndex / stateEntries.length);

    result[state] = await Promise.all(
      Array.from({ length: frames }, (_, frameIndex) => {
        const left = frameIndex * grid.cellWidth;
        const top = row * grid.cellHeight;
        return sharpBase
          .clone()
          .extract({
            left,
            top,
            width: grid.cellWidth,
            height: grid.cellHeight,
          })
          .png() // conversion explicite en PNG, obligatoire pour apngasm-bin (Story 2.4)
          .toBuffer()
          .catch((err) => {
            if (err instanceof ValidationError) throw err;
            throw new ValidationError(
              `Cannot slice state "${state}" (frame ${frameIndex + 1}/${frames}): ${err instanceof Error ? err.message : String(err)}`,
            );
          });
      }),
    );
  }

  return result;
};
