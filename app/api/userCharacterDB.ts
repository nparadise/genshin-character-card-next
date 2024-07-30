'use client';

import { DB_NAME, DB_VERSION } from '@/db-config';
import Database from './database';
import { DBUserCharacterData } from './types';

const OBJECT_STORE_NAME: string = 'character';

const dbInstance = Database.getInstance();

export async function addUserCharacter(data: DBUserCharacterData) {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  dbInstance.add<DBUserCharacterData>(OBJECT_STORE_NAME, data).catch((e) => {
    return e;
  });
}

export async function updateUserCharacter(data: DBUserCharacterData) {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  dbInstance
    .update<DBUserCharacterData>(OBJECT_STORE_NAME, data)
    .then(() => {
      console.log('success');
    })
    .catch((e) => {
      console.log(e);
      return e;
    });
}

export async function getAllUserCharacter(): Promise<DBUserCharacterData[]> {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  return dbInstance.getAll<DBUserCharacterData>(OBJECT_STORE_NAME);
}

export async function getUserCharacter(
  name: string,
): Promise<DBUserCharacterData> {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  return dbInstance.get<DBUserCharacterData>(OBJECT_STORE_NAME, name);
}

export async function deleteUserCharacter(name: string) {
  await dbInstance.openDB(DB_NAME, DB_VERSION);
  dbInstance.delete(OBJECT_STORE_NAME, name).catch((e) => {
    return e;
  });
}
