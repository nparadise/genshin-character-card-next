'use client';

import Card from '@/app/components/Card';
import {
  characterDataType2DBType,
  getDefaultUserCharacterData,
} from '@/app/api/utils';
import CardEditRemote from '@/app/components/CardEditRemote';
import { MouseEvent, useCallback, useState } from 'react';
import { LevelAscension, UserCharacterData } from '../api/types';
import { addUserCharacter } from '../api/userCharacterDB';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [characterData, setCharacterData] = useState<UserCharacterData>(
    getDefaultUserCharacterData(),
  );

  const handleChange = (v: UserCharacterData) => {
    setCharacterData(v);
  };

  const handleLAChange = useCallback((v: LevelAscension) => {
    setCharacterData((prev) => ({ ...prev, levelAscension: v }));
  }, []);

  const handleClickAdd = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    addUserCharacter(characterDataType2DBType(characterData));
    router.push('/character');
  };

  return (
    <div className="flex h-dvh w-dvw">
      <div className="h-full grow">
        <Card characterData={characterData} />
      </div>
      <div className="h-full">
        <CardEditRemote
          onChange={handleChange}
          onLevelAscensionChange={handleLAChange}
        >
          <div className="col-span-2 flex justify-center">
            <button
              type="button"
              className="rounded-sm bg-white px-2 py-1"
              onClick={handleClickAdd}
            >
              추가
            </button>
          </div>
        </CardEditRemote>
      </div>
    </div>
  );
}
