import { OBJECT_STORES } from '@/db-config';

export interface UserCharacterData {
  name: string;
  levelAscension: LevelAscension;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  elem: number;
  energy: number;
  dmgBonus: number;
  hp: number;
}

export interface DBUserCharacterData {
  name: string;
  level: number;
  ascension: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  elem: number;
  energy: number;
  dmgBonus: number;
  hp: number;
}

const basicDataKeys = [...OBJECT_STORES.basicData, 'name'] as const;
export type DBCharacterData = {
  [key in (typeof basicDataKeys)[number]]: string;
};

export interface LevelAscension {
  level: number;
  ascension: number;
  isAscended: boolean;
}
