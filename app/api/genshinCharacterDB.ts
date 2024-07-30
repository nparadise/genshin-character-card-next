'use client';

import { DB_NAME, DB_VERSION, OBJECT_STORES } from '@/db-config';
import Database from './database';
import { DBCharacterData } from './types';
import {
  getAllCharacterNameList,
  getCharacterData as getAPICharacterData,
} from './genshinData';

const OBJECT_STORE_NAME: string = 'basicData';
const dbInstance = Database.getInstance();

if (!(OBJECT_STORE_NAME in OBJECT_STORES))
  throw new Error(`Wrong Object Store Name: ${OBJECT_STORE_NAME}`);

async function addCharacterData(data: DBCharacterData) {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  return new Promise<void>((resolve, reject) => {
    dbInstance
      .add<DBCharacterData>(OBJECT_STORE_NAME, data)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}

export async function getCharacterData(character: string) {
  await updateCharacterData();
  return new Promise<DBCharacterData>((resolve, reject) => {
    dbInstance
      .get<DBCharacterData>(OBJECT_STORE_NAME, character)
      .then((characterData) => {
        resolve(characterData);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

async function getCharacterNameListNoUpdate(): Promise<string[]> {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  return new Promise<string[]>((resolve, reject) => {
    dbInstance
      .getAll<DBCharacterData>(OBJECT_STORE_NAME)
      .then((list) => {
        const ret = list.map((data) => data.name);
        resolve(ret);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export async function getCharacterNameList(): Promise<string[]> {
  await updateCharacterData();
  return new Promise<string[]>((resolve, reject) => {
    dbInstance
      .getAll<DBCharacterData>(OBJECT_STORE_NAME)
      .then((list) => {
        const ret = list.map((data) => data.name);
        resolve(ret);
      })
      .catch((e) => reject(e));
  });
}

async function updateCharacterData() {
  // api와 indexedDB의 캐릭터 목록 받아옴
  const [apiList, dbList] = await Promise.all([
    getAllCharacterNameList(),
    getCharacterNameListNoUpdate(),
  ]);

  // api와 indexedDB의 캐릭터 목록 비교
  const dbSet = new Set(dbList);
  const characterUpdateList = apiList.filter((v) => !dbSet.has(v));

  // 다른점이 없으면 종료
  if (characterUpdateList.length === 0)
    return Promise.resolve('Update Complete: No Difference');

  const promiseList: Promise<void>[] = [];
  const task = async (character: string) => {
    const res = (await getAPICharacterData(character)) as object;
    if ('name' in res && 'title' in res && 'elementText' in res) {
      return addCharacterData({
        name: res.name as string,
        title: res.title as string,
        element: res.elementText as string,
      });
    } else {
      throw new Error('Wrong Response');
    }
  };
  for (const character of characterUpdateList) {
    promiseList.push(task(character));
  }

  return Promise.all(promiseList).then(() =>
    Promise.resolve(
      `Update Complete: ${characterUpdateList.length} character(s).`,
    ),
  );
}
