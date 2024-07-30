'use client';

import { LevelAscension, UserCharacterData } from '@/app/api/types';
import LevelAscensionInput from './LevelAscensionInput';
import { useRef, memo, useCallback } from 'react';
import {
  characterDataList,
  getDefaultUserCharacterData,
} from '@/app/api/utils';
import CharacterSelect from './CharacterSelect';

function InputRow({
  property,
  propName,
  defaultValue,
}: {
  property: string;
  propName: string;
  inputType: string;
  defaultValue?: number;
}) {
  return (
    <>
      <label
        htmlFor={property}
        className="rounded-sm bg-white py-1 text-center text-lg font-semibold"
      >
        {propName}
      </label>
      <input
        type="number"
        step="0.1"
        name={property}
        id={property}
        defaultValue={defaultValue || 0}
        className="text-right"
      />
    </>
  );
}

function CardEditRemote({
  onChange,
  onLevelAscensionChange,
  initValue,
  children,
}: {
  onChange?: (v: UserCharacterData) => void;
  onLevelAscensionChange?: (v: LevelAscension) => void;
  initValue?: UserCharacterData;
  children?: React.ReactElement;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const getFormData = (): UserCharacterData => {
    if (!formRef.current) {
      throw new Error('const formRef is not assigned.');
    }
    formRef.current.on;
    let ret: UserCharacterData = initValue
      ? initValue
      : getDefaultUserCharacterData();
    const body = new FormData(formRef.current);
    body.forEach((value, key) => {
      if (key === 'level' || key === 'ascension') {
        ret.levelAscension = {
          ...ret.levelAscension,
          [key]: parseInt(value as string),
        };
      } else if (key === 'isAscended') {
        ret.levelAscension.isAscended = value === 'true' ? true : false;
      } else {
        ret = {
          ...ret,
          [key]: !isNaN(parseFloat(value as string))
            ? parseFloat(value as string)
            : value,
        };
      }
    });
    return ret;
  };

  const handleChange = () => {
    onChange && onChange(getFormData());
  };

  const handleLevelAscensionChange = useCallback(
    (v: LevelAscension) => {
      onLevelAscensionChange && onLevelAscensionChange(v);
    },
    [onLevelAscensionChange],
  );

  return (
    <div className="size-full min-w-[30rem] bg-blue-900 px-4 py-2">
      <form
        ref={formRef}
        className="grid grid-cols-2 gap-x-2 gap-y-2 font-noto-kr"
        onChange={handleChange}
      >
        <h2 className="col-span-2 text-center text-3xl font-bold text-white">
          Character Setting
        </h2>
        <label
          htmlFor="name"
          className="rounded-sm bg-white py-1 text-center text-lg font-semibold"
        >
          Character
        </label>
        <CharacterSelect
          defaultValue={initValue?.name}
        />
        <label
          htmlFor="level"
          className="rounded-sm bg-white py-1 text-center text-lg font-semibold"
        >
          Level
        </label>
        <LevelAscensionInput
          onChange={handleLevelAscensionChange}
          defaultValue={initValue?.levelAscension}
        />
        {characterDataList.map((v) => {
          return (
            <InputRow
              key={v[0]}
              property={v[0]}
              propName={v[1]}
              inputType={v[2]}
              defaultValue={initValue ? initValue[v[0]] : undefined}
            />
          );
        })}
        {children}
      </form>
    </div>
  );
}

export default CardEditRemote;
