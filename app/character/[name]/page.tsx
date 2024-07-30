'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserCharacter } from '@/app/api/userCharacterDB';
import { UserCharacterData } from '@/app/api/types';
import {
  DBCharacterDataType2CharacterDataType,
  getDefaultUserCharacterData,
} from '@/app/api/utils';
import Card from '@/app/components/Card';

export default function Page({ params }: { params: { name: string } }) {
  const [data, setData] = useState<UserCharacterData>(
    getDefaultUserCharacterData(),
  );

  useEffect(() => {
    const decodedName = decodeURIComponent(params.name);
    getUserCharacter(decodedName).then((value) => {
      setData(DBCharacterDataType2CharacterDataType(value));
    });
  }, [params.name]);

  return (
    <>
      <Card characterData={data} />
      <Link
        href={`/edit/${params.name}`}
        className="absolute bottom-3 right-3 rounded-sm bg-blue-800 px-4 py-2 text-white"
      >
        편집
      </Link>
    </>
  );
}
