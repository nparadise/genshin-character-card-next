import {
  UserCharacterData,
  DBUserCharacterData,
  DBCharacterData,
} from '@/app/api/types';
import { createLevelAscension, isAscended } from './levelAscensionHelper';

export function getDefaultDBCharacterData(): DBCharacterData {
  return {
    name: 'Albedo',
    element: 'Geo',
    title: 'Kreideprinz',
  };
}

export function getDefaultUserCharacterData(): UserCharacterData {
  return {
    name: 'Albedo',
    levelAscension: createLevelAscension(),
    atk: 0,
    def: 0,
    critRate: 0,
    critDmg: 0,
    elem: 0,
    energy: 0,
    dmgBonus: 0,
    hp: 0,
  };
}

export const characterDataList = [
  ['atk', 'Attack', 'number'],
  ['def', 'Defence', 'number'],
  ['critRate', 'Critical Rate', 'percent'],
  ['critDmg', 'Critical Damage', 'percent'],
  ['elem', 'Elemental Mastery', 'percent'],
  ['energy', 'Energy Recharge', 'percent'],
  ['dmgBonus', 'DMG Bonus', 'percent'],
  ['hp', 'HP', 'number'],
] as const;

export function characterDataType2DBType(
  data: UserCharacterData,
): DBUserCharacterData {
  const ret = {
    ...data,
    ...data.levelAscension,
  } as object;

  if ('levelAscension' in ret) delete ret.levelAscension;
  if ('isAscended' in ret) delete ret.isAscended;

  if (ret as DBUserCharacterData) {
    return ret as DBUserCharacterData;
  } else {
    console.error(ret);
    throw new Error('wrong object type');
  }
}

export function DBCharacterDataType2CharacterDataType(
  data: DBUserCharacterData,
): UserCharacterData {
  const ret = {
    ...data,
    levelAscension: {
      level: data.level,
      ascension: data.ascension,
      isAscended: isAscended(data.level, data.ascension),
    },
  } as object;

  if ('level' in ret) delete ret.level;
  if ('ascension' in ret) delete ret.ascension;

  if (ret as UserCharacterData) {
    return ret as UserCharacterData;
  } else {
    console.error(ret);
    throw new Error('wrong object');
  }
}

const elem2ColorObject: {
  [key: string]: string;
} = {
  geo: 'yellow',
  pyro: 'red',
  cryo: 'cyan',
  electro: 'purple',
  hydro: 'blue',
  dendro: 'green',
  anemo: 'emerald',
};

export function element2Color(element: string): string {
  if (!Object.keys(elem2ColorObject).includes(element)) return '';
  return elem2ColorObject[element];
}
