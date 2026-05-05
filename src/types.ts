export type ClawdState =
  | "idle"
  | "thinking"
  | "working"
  | "error"
  | "happy"
  | "notification"
  | "sleeping"
  | "waking";

export interface ThemeManifest {
  name: string;
  /** Format attendu : `"clawd-on-desk@1.x"` */
  compatibleWith: string;
  version: string;
}

export interface AdapterInput {
  /** Each Buffer must be non-empty — a zero-length buffer will produce a corrupt APNG. */
  apngs: Record<ClawdState, Buffer>;
  manifest: ThemeManifest;
  outputDir: string;
}

export interface AdapterOutput {
  mode: "zip" | "install";
  /** Must be an absolute filesystem path. */
  path: string;
  warnings?: string[];
}

export interface OutputAdapter {
  generate(input: AdapterInput): Promise<AdapterOutput>;
}

/**
 * @param step  Human-readable label for the current pipeline step.
 * @param progress  Optional progress ratio in the range 0–1 (0 = started, 1 = complete).
 */
export type ProgressCallback = (step: string, progress?: number) => void;

export class FetchError extends Error {
  exitCode = 1 as const;
}

export class ValidationError extends Error {
  exitCode = 2 as const;
}

export class InstallError extends Error {
  exitCode = 3 as const;
}
