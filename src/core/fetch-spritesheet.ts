import { readFile } from "node:fs/promises";
import { FetchError, ValidationError } from "../types";
import type { ProgressCallback } from "../types";

const DEFAULT_TIMEOUT = 30_000;

export interface FetchOptions {
  timeout?: number;
  onProgress?: ProgressCallback;
}

const isUrl = (source: string): boolean => {
  try {
    const url = new URL(source);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const fetchFromUrl = async (
  url: string,
  timeout: number,
  onProgress?: ProgressCallback,
): Promise<Buffer> => {
  onProgress?.("Téléchargement de la spritesheet");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new FetchError(
        `URL inaccessible (HTTP ${response.status}) : ${url}`,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) {
      throw new ValidationError(
        `Content-Type non supporté : "${contentType}". Une image est attendue.`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    if (err instanceof FetchError || err instanceof ValidationError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchError(
        `Timeout dépassé (${timeout / 1000}s) lors du téléchargement de ${url}`,
      );
    }
    throw new FetchError(
      `Impossible d'accéder à l'URL : ${url}. ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }
};

const fetchFromLocal = async (
  filePath: string,
  onProgress?: ProgressCallback,
): Promise<Buffer> => {
  onProgress?.("Lecture de la spritesheet locale");

  try {
    return await readFile(filePath);
  } catch (err) {
    throw new FetchError(
      `Erreur d'accès au fichier : ${filePath}. ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};

export const fetchSpritesheet = async (
  source: string,
  options: FetchOptions = {},
): Promise<Buffer> => {
  const { timeout = DEFAULT_TIMEOUT, onProgress } = options;

  if (isUrl(source)) {
    return fetchFromUrl(source, timeout, onProgress);
  }
  return fetchFromLocal(source, onProgress);
};
