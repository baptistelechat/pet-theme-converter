import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import apngasm from "apngasm-bin";
import { ValidationError } from "../types";
import type { ClawdState, ProgressCallback } from "../types";
import { STATE_MAPPING } from "./state-mapping";

const execFileAsync = promisify(execFile);

/**
 * Encode per-state PNG frames into animated APNG buffers using apngasm-bin.
 * @param frames - Per-state PNG frame buffers returned by `sliceFrames`.
 * @param onProgress - Optional callback invoked once per state with a readable label.
 * @returns A record mapping each ClawdState to its encoded APNG buffer.
 * @throws {ValidationError} If a state has no frames or if apngasm-bin fails.
 */
export const encodeAPNGs = async (
  frames: Record<ClawdState, Buffer[]>,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer>> => {
  const result = {} as Record<ClawdState, Buffer>;
  const stateEntries = Object.entries(STATE_MAPPING) as [
    ClawdState,
    { row: number; frames: number },
  ][];

  for (let stateIndex = 0; stateIndex < stateEntries.length; stateIndex++) {
    const [state] = stateEntries[stateIndex];

    const stateFrames = frames[state];
    if (!stateFrames || stateFrames.length === 0) {
      throw new ValidationError(
        `No frames for state "${state}": cannot encode APNG.`,
      );
    }

    let tempDir: string | undefined;
    try {
      tempDir = await mkdtemp(join(tmpdir(), `pet-theme-${state}-`));
      const outputPath = join(tempDir, "output.apng");

      // Write PNG frames to disk (apngasm-bin cannot read from buffers directly)
      const framePaths = await Promise.all(
        stateFrames.map(async (frameBuffer, i) => {
          const framePath = join(
            tempDir as string,
            `frame_${String(i).padStart(4, "0")}.png`,
          );
          await writeFile(framePath, frameBuffer);
          return framePath;
        }),
      );

      // Build args: each frame followed by its per-frame delay (1/10s = 100ms)
      const frameArgs: string[] = [];
      for (const framePath of framePaths) {
        frameArgs.push(framePath, "1", "10");
      }

      await execFileAsync(apngasm, [outputPath, ...frameArgs, "-l0"]);

      result[state] = await readFile(outputPath);
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      throw new ValidationError(
        `APNG encoding failed for state "${state}": ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      if (tempDir) await rm(tempDir, { recursive: true, force: true });
    }

    onProgress?.(
      `Encoding APNG: ${state}`,
      (stateIndex + 1) / stateEntries.length,
    );
  }

  return result;
};
