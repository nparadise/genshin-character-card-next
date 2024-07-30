'use client';

import { FormEvent } from 'react';
import { addUserCharacter } from '@/app/api/userCharacterDB';
import { DBUserCharacterData } from '@/app/api/types';
import {
  characterDataList,
  characterDataType2DBType,
  getDefaultUserCharacterData,
} from '@/app/api/utils';
import CharacterSelect from '@/app/components/CharacterSelect';
import LevelAscensionInput from '@/app/components/LevelAscensionInput';

export default function DataAdder({
  onDataUpdate,
}: {
  onDataUpdate?: () => void;
}) {
  const submitHandler = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const body = new FormData(ev.currentTarget);
    let data: DBUserCharacterData = characterDataType2DBType(
      getDefaultUserCharacterData(),
    );
    body.forEach((value, key) => {
      if (key === 'isAscended') {
        return;
      }

      data = {
        ...data,
        [key]: !isNaN(parseFloat(value as string))
          ? parseFloat(value as string)
          : value,
      };
    });

    addUserCharacter(data);
    onDataUpdate && onDataUpdate();
  };

  return (
    <form onSubmit={submitHandler} className="grid grid-cols-2 gap-2">
      <h2 className="col-span-2 rounded-sm bg-white py-1 text-center text-xl font-extrabold">
        Data Add
      </h2>
      <label htmlFor="name">Character</label>
      <CharacterSelect />
      <label>Level</label>
      <LevelAscensionInput />
      {characterDataList.map((value) => {
        return (
          <>
            <label htmlFor={value[0]}>{value[1]}</label>
            <input
              type="number"
              step="0.1"
              name={value[0]}
              id={`${value[0]}-input`}
              defaultValue={0}
              className="text-right"
            />
          </>
        );
      })}
      <div className="col-span-2 flex justify-center">
        <button type="submit" className="mx-auto rounded-sm bg-white px-2 py-1">
          추가
        </button>
      </div>
    </form>
  );
}
