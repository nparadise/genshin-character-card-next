import { LevelAscension } from './types';

const ascensionLevel: number[] = [20, 40, 50, 60, 70, 80];
const MIN_LEVEL: number = 1;
const MAX_LEVEL: number = 90;

function isValidLevelAscension(v: LevelAscension): boolean;
function isValidLevelAscension(level: number, ascension: number): boolean;
function isValidLevelAscension(x: LevelAscension | number, y?: number) {
  let level: number, ascension: number;
  if (!y) {
    level = (x as LevelAscension).level;
    ascension = (x as LevelAscension).ascension;
  } else {
    level = x as number;
    ascension = y;
  }

  if (level < 1 || level > 90) return false;
  if (ascension < 0 || ascension > 6) return false;

  ascensionLevel.forEach((v, i) => {
    if (level < v && ascension > i) return false;
    if (level > v && ascension < i + 1) return false;
  });

  return true;
}

/**
 *
 * @param level
 * @param ascension
 * @returns
 */
function isAscended(level: number, ascension: number): boolean {
  const ascensionLevel: number[] = [20, 40, 50, 60, 70, 80];

  if (!ascensionLevel.includes(level)) {
    return false;
  }

  if (ascensionLevel.findIndex((v) => v === level) === ascension) {
    return false;
  } else return true;
}

function createLevelAscension(): LevelAscension;
function createLevelAscension(level: number): LevelAscension;
function createLevelAscension(level: number, ascension: number): LevelAscension;
function createLevelAscension(
  level?: number,
  ascension?: number,
): LevelAscension {
  if (!level) {
    return { level: 1, ascension: 0, isAscended: false };
  }

  if (!ascension) {
    ascension = ascensionLevel.findIndex((v) => level <= v);
    ascension = ascension === -1 ? ascensionLevel.length : ascension;
    return { level: level, ascension: ascension, isAscended: false };
  }

  if (!isValidLevelAscension(level, ascension))
    return { level: 1, ascension: 0, isAscended: false };

  return {
    level: level,
    ascension: ascension,
    isAscended: isAscended(level, ascension),
  };
}

export {
  ascensionLevel,
  MIN_LEVEL,
  MAX_LEVEL,
  createLevelAscension,
  isValidLevelAscension,
  isAscended,
};
