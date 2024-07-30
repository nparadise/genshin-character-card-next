'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getCharacterNameList } from '@/app/api/genshinCharacterDB';

export default function CharacterSelect({
  name = 'name',
  id = 'name-input',
  onChange,
  defaultValue,
}: {
  name?: string;
  id?: string;
  onChange?: (v: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
}) {
  const ref = useRef<HTMLSelectElement>(null);
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!defaultValue) {
      getCharacterNameList().then((value) => {
        setList(value);
      });
    } else {
      setList([defaultValue]);
    }
  }, [defaultValue]);

  return (
    <select
      ref={ref}
      name={name}
      id={id}
      onChange={onChange}
      disabled={defaultValue ? true : false}
    >
      {list.map((character) => {
        return (
          <option
            className="py-1 text-center checked:font-bold"
            key={`option-${character}`}
            value={character}
          >
            {character}
          </option>
        );
      })}
    </select>
  );
}
