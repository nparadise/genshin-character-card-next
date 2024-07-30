'use client';

import { OBJECT_STORES } from '@/db-config';

type dbStatus = 'not opened' | 'opening' | 'opened';

export default class Database {
  private static instance: Database;
  private db: IDBDatabase | undefined;
  private status: dbStatus = 'not opened';

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async openDB(dbName: string, version: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!!this.db && this.db.name === dbName && this.db.version === version) {
        resolve();
        return;
      }
      if (!!this.db) {
        this.db.close();
      }

      this.status = 'opening';
      const openReq = indexedDB.open(dbName, version);

      openReq.onsuccess = (ev: Event) => {
        this.db = (ev.target as IDBOpenDBRequest).result;
        this.status = 'opened';
        resolve();
      };

      openReq.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        const req = ev.target as IDBOpenDBRequest;
        this.db = req.result;

        if (!req.transaction) {
          reject('Version Change Transaction Error');
          return;
        }

        let objectStore: IDBObjectStore;
        Object.entries(OBJECT_STORES).forEach(([osName, indexes]) => {
          if (!req.transaction) {
            reject('Version Change Transaction Error');
            return;
          }
          if (!this.db) {
            reject('DB Error');
            return;
          }

          if (req.transaction.objectStoreNames.contains(osName)) {
            objectStore = req.transaction.objectStore(osName);
          } else {
            objectStore = this.db.createObjectStore(osName, {
              keyPath: 'name',
            });
          }

          for (const index of indexes) {
            if (objectStore.indexNames.contains(index)) continue;
            objectStore.createIndex(index, index);
          }
        });

        this.status = 'opened';
        resolve();
      };

      openReq.onerror = () => {
        this.status = 'not opened';
        console.error(openReq.error);
        reject(openReq.error);
      };
    });
  }

  private async waitForDBReady(): Promise<void> {
    let breakLoopFlag: boolean = false;

    function breakLoop() {
      breakLoopFlag = true;
    }

    let t = 0;
    while (!this.db || this.status !== 'opened') {
      if (breakLoopFlag) break;
      console.log(`Waiting for DB init. s=${t}`);
      setTimeout(() => {
        breakLoop;
      }, 5000);
      await new Promise((resolve) => setTimeout(resolve, 100));
      t += 0.1;
    }
    console.log('DB init complete.');
  }

  private async getObjectStore(
    objectStoreName: string,
    mode: IDBTransactionMode,
  ): Promise<IDBObjectStore> {
    if (this.status === 'not opened') {
      throw new Error('db not opened');
    }

    await this.waitForDBReady();
    if (!this.db) throw new Error('DB Init Error');
    return this.db
      .transaction(objectStoreName, mode)
      .objectStore(objectStoreName);
  }

  public async add<T>(objectStoreName: string, data: T): Promise<void> {
    const objectStore = await this.getObjectStore(objectStoreName, 'readwrite');
    const addReq = objectStore.add(data);

    return new Promise<void>((resolve, reject) => {
      addReq.onsuccess = () => {
        resolve();
      };

      addReq.onerror = (ev: Event) => {
        console.error(ev);
        reject(ev);
      };
    });
  }

  public async getAll<T>(objectStoreName: string): Promise<T[]> {
    const objectStore = await this.getObjectStore(objectStoreName, 'readonly');
    const getAllReq = objectStore.getAll();

    return new Promise<T[]>((resolve, reject) => {
      getAllReq.onsuccess = (ev: Event) => {
        resolve((ev.target as IDBRequest).result);
      };

      getAllReq.onerror = (ev: Event) => {
        console.error(ev);
        reject(ev);
      };
    });
  }

  public async get<T>(objectStoreName: string, target: string): Promise<T> {
    const objectStore = await this.getObjectStore(objectStoreName, 'readonly');
    const getReq = objectStore.get(target);

    return new Promise<T>((resolve, reject) => {
      getReq.onsuccess = (ev: Event) => {
        const res = (ev.target as IDBRequest).result;
        if (!res as T) {
          reject('Wrong Data Type');
          return;
        }

        resolve(res as T);
      };

      getReq.onerror = (ev: Event) => {
        console.error(ev);
        reject(ev);
      };
    });
  }

  public async update<T>(
    objectStoreName: string,
    data: T,
  ): Promise<void> {
    const objectStore = await this.getObjectStore(objectStoreName, 'readwrite');
    const putReq = objectStore.put(data);

    return new Promise<void>((resolve, reject) => {
      putReq.onsuccess = (ev: Event) => {
        console.log(ev);
        resolve();
      };

      putReq.onerror = (ev: Event) => {
        console.error(ev);
        objectStore.transaction.abort();
        reject();
      };
    });
  }

  public async delete(objectStoreName: string, key: string): Promise<void> {
    const objectStore = await this.getObjectStore(objectStoreName, 'readwrite');
    const deleteReq = objectStore.delete(key);

    return new Promise<void>((resolve, reject) => {
      deleteReq.onsuccess = () => {
        console.log(deleteReq.result);
        resolve();
      };

      deleteReq.onerror = () => {
        console.log(deleteReq.error);
        reject(deleteReq.error);
      };
    });
  }
}
