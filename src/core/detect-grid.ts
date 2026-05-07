import sharp from "sharp";
import { ValidationError } from "../types";

export interface GridInfo {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  isStandard: boolean; // true if cellWidth === 192 && cellHeight === 208
  expectedWidth?: number; // only present when isStandard: false — always 192
  expectedHeight?: number; // only present when isStandard: false — always 208
}

const STANDARD_COLS = 8;
// 9 rows total in the Petdex spritesheet (0-indexed); all 9 rows are mapped in STATE_MAPPING
const STANDARD_ROWS = 9;
const STANDARD_CELL_WIDTH = 192;
const STANDARD_CELL_HEIGHT = 208;

export const detectGrid = async (buffer: Buffer): Promise<GridInfo> => {
  if (!buffer || buffer.length === 0)
    throw new ValidationError("Empty buffer: no spritesheet data to read.");

  let width: number;
  let height: number;

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new ValidationError(
        "Cannot read spritesheet dimensions: metadata is missing.",
      );
    }
    width = metadata.width;
    height = metadata.height;
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError(
      `Cannot read spritesheet: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const cellWidth = Math.round(width / STANDARD_COLS);
  const cellHeight = Math.round(height / STANDARD_ROWS);
  const isStandard =
    cellWidth === STANDARD_CELL_WIDTH && cellHeight === STANDARD_CELL_HEIGHT;

  return {
    cols: STANDARD_COLS,
    rows: STANDARD_ROWS,
    cellWidth,
    cellHeight,
    isStandard,
    ...(isStandard
      ? {}
      : {
          expectedWidth: STANDARD_CELL_WIDTH,
          expectedHeight: STANDARD_CELL_HEIGHT,
        }),
  };
};
