'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import CharacterListItem from './character/characteListItem';
import { getAllUserCharacter } from '../api/userCharacterDB';

export default function SideNav() {
  const [characterList, setCharacterList] = useState<string[]>([]);

  useEffect(() => {
    getAllUserCharacter().then((res) => {
      setCharacterList(res.map((v) => v.name));
    });
  }, []);

  const inputChangeHandle = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const query = ev.currentTarget.value;
    getAllUserCharacter().then((res) => {
      setCharacterList(
        res
          .filter((value) =>
            value.name.toLowerCase().includes(query.toLowerCase()),
          )
          .map((v) => v.name),
      );
    });
  }, []);

  return (
    <nav className="h-dvh w-80 bg-white">
      <div className="flex h-full flex-col text-center">
        <h3 className="my-2 font-n-myeongjo text-xl font-extrabold tracking-wide">
          Genshin Character Card
        </h3>
        <div className="flex justify-center gap-1">
          <form>
            <input
              type="text"
              className="box-border h-full rounded-sm border-2 border-blue-800"
              onChange={inputChangeHandle}
            />
          </form>
          <Link
            href="/add"
            className="box-border rounded-sm bg-blue-800 px-2 py-1 font-noto-kr text-white"
          >
            추가
          </Link>
        </div>
        <div
          id="List"
          className="mt-4 flex flex-wrap justify-evenly gap-x-1 gap-y-3 overflow-y-scroll text-black"
        >
          {characterList.map((value: string) => {
            return <CharacterListItem name={value} key={value} />;
          })}
        </div>
      </div>
    </nav>
  );
}
