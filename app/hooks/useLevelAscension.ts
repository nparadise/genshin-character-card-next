import { useCallback, useState } from 'react';
import {
  ascensionLevel,
  isValidLevelAscension,
  MAX_LEVEL,
  MIN_LEVEL,
} from '@/app/api/levelAscensionHelper';
import { LevelAscension } from '@/app/api/types';

export default function useLevelAscension(
  defaultLevelAscension?: LevelAscension,
): [LevelAscension, () => void, () => void, (v: LevelAscension) => void] {
  const [levelAscension, setLevelAscension] = useState<LevelAscension>({
    level: 1,
    ascension: 0,
    isAscended: false,
  });

  const increase = (): void => {
    setLevelAscension((prev) => {
      if (prev.level === MAX_LEVEL) return prev;
      if (ascensionLevel.includes(prev.level)) {
        if (
          prev.ascension === ascensionLevel.findIndex((lv) => lv === prev.level)
        ) {
          return {
            ...prev,
            ascension: prev.ascension + 1,
            isAscended: true,
          };
        }
      }
      return {
        ...prev,
        level: prev.level + 1,
        isAscended: false,
      };
    });
  };

  const decrease = (): void => {
    setLevelAscension((prev) => {
      if (prev.level === MIN_LEVEL) return prev;
      if (ascensionLevel.includes(prev.level)) {
        if (
          prev.ascension ===
          ascensionLevel.findIndex((lv) => lv === prev.level) + 1
        ) {
          return {
            ...prev,
            ascension: prev.ascension - 1,
            isAscended: false,
          };
        }
      }

      return {
        ...prev,
        level: prev.level - 1,
        isAscended: ascensionLevel.includes(prev.level - 1),
      };
    });
  };

  const setter = useCallback((v: LevelAscension): void => {
    if (!isValidLevelAscension(v)) {
      throw new Error(`Invalid LevelAscension Value: ${v}`);
    }
    setLevelAscension(v);
  }, []);

  return [levelAscension, increase, decrease, setter];
}
