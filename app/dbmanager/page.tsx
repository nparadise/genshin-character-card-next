'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import DataAdder from '@/app/components/dbmanager/DataAdder';
import DBDataTable from '@/app/components/dbmanager/DBDataTable';
import { DBUserCharacterData } from '@/app/api/types';
import { getAllUserCharacter } from '@/app/api/userCharacterDB';

export default function Page() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const [data, setData] = useState<DBUserCharacterData[]>([]);

  useEffect(() => {
    getAllUserCharacter().then((value) => setData(value));
  }, []);

  const onDataUpdate = () => {
    getAllUserCharacter().then((value) => setData(value));
  };

  return (
    <main className="flex h-dvh w-dvw">
      <div className="h-dvh shrink-0 grow bg-black text-white">
        <DBDataTable data={data} onDataUpdate={onDataUpdate} />
      </div>
      <div className="h-full w-1/4 shrink-0 grow-0 bg-blue-900 px-2 pt-2 text-black">
        <DataAdder onDataUpdate={onDataUpdate} />
      </div>
    </main>
  );
}
