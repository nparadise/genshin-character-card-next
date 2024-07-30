'use client';

import Image from 'next/image';
import useLevelAscension from '@/app/hooks/useLevelAscension';
import useComponentVisible from '@/app/hooks/useComponentVisible';
import {
  ascensionLevel,
  createLevelAscension,
  MAX_LEVEL,
  MIN_LEVEL,
} from '@/app/api/levelAscensionHelper';
import { LevelAscension } from '@/app/api/types';

import ascensionUnlocked from '@/public/ascension-unlocked.svg';
import ascensionLocked from '@/public/ascension-locked.svg';
import { useEffect, memo } from 'react';

const selectOptions: LevelAscension[] = [];
selectOptions.push(createLevelAscension(MIN_LEVEL, 0));
ascensionLevel.forEach((level, index) => {
  selectOptions.push(createLevelAscension(level, index));
  selectOptions.push(createLevelAscension(level, index + 1));
});
selectOptions.push(createLevelAscension(MAX_LEVEL, ascensionLevel.length));

function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-blue-800 text-white hover:bg-blue-600 active:bg-blue-300"
    >
      {children}
    </button>
  );
}

interface DisplayProps {
  value: LevelAscension;
  id?: string;
  onClick: () => void;
}

function Display({ value, id, onClick }: DisplayProps) {
  return (
    <div
      id={id}
      className="flex grow cursor-pointer items-center justify-center align-middle hover:bg-slate-300"
      onClick={onClick}
    >
      {value.level}
      {ascensionLevel.includes(value.level) &&
        (value.isAscended ? (
          <Image
            src={ascensionUnlocked}
            alt="unlocked ascension star"
            unoptimized
          />
        ) : (
          <Image
            src={ascensionLocked}
            alt="locked ascension star"
            unoptimized
          />
        ))}
    </div>
  );
}

function SelectorBlock({
  onClick,
  colSpan = 1,
  value,
}: {
  onClick: () => void;
  colSpan?: number;
  value: LevelAscension;
}) {
  return (
    <div
      onClick={onClick}
      className={`col-span-${colSpan} flex cursor-pointer items-center justify-center rounded-sm bg-white`}
    >
      {value.level}
      {value.isAscended && (
        <Image
          src={ascensionUnlocked}
          alt="unlocked ascension star"
          unoptimized
        />
      )}
    </div>
  );
}

interface SelectorProps {
  onClickLevel: (v: LevelAscension) => void;
  divRef: React.RefObject<HTMLDivElement>;
}

function Selector({ onClickLevel, divRef }: SelectorProps) {
  const clickHandler = (v: LevelAscension) => () => {
    onClickLevel(v);
  };

  return (
    <div className="absolute flex h-fit w-full justify-center bg-transparent">
      <div
        ref={divRef}
        className="box-content grid w-3/5 min-w-40 grid-cols-2 gap-x-1 gap-y-1 rounded-sm bg-blue-800 p-1"
      >
        {selectOptions.map((v, i) => {
          return (
            <SelectorBlock
              key={`level${v.level}-ascension${v.ascension}`}
              onClick={clickHandler(v)}
              value={v}
              colSpan={i === 0 || i === selectOptions.length - 1 ? 2 : 1}
            />
          );
        })}
      </div>
    </div>
  );
}

const LevelAscensionInput = memo(function LevelAscensionInput({
  id,
  className,
  onChange,
  defaultValue,
}: {
  id?: string;
  className?: string;
  onChange?: (v: LevelAscension) => void;
  defaultValue?: LevelAscension;
}) {
  const [levelAscension, increaseLA, decreaseLA, setLA] = useLevelAscension();
  const [selectorRef, isSelectorVisible, setIsSelectorVisible] =
    useComponentVisible(false);

  useEffect(() => {
    defaultValue && setLA(defaultValue);
  }, [defaultValue, setLA]);

  useEffect(() => {
    onChange && onChange(levelAscension);
  }, [onChange, levelAscension]);

  return (
    <div className={`${className ? className : ''} relative bg-white`}>
      <div className="flex size-full justify-between gap-1 rounded-sm p-1">
        <Button
          onClick={() => {
            decreaseLA();
          }}
        >
          -
        </Button>
        <Display
          id={id}
          value={levelAscension}
          onClick={() => {
            setIsSelectorVisible((v) => !v);
          }}
        />
        <Button
          onClick={() => {
            increaseLA();
          }}
        >
          +
        </Button>
      </div>
      <input
        type="hidden"
        name="level"
        id="level-input"
        value={levelAscension.level}
      />
      <input
        type="hidden"
        name="ascension"
        id="ascension-input"
        value={levelAscension.ascension}
      />
      <input
        type="hidden"
        name="isAscended"
        id="isAscended-input"
        value={levelAscension.isAscended.toString()}
      />
      {isSelectorVisible && (
        <Selector
          divRef={selectorRef}
          onClickLevel={(lv: LevelAscension) => {
            setLA(lv);
            setIsSelectorVisible((v) => !v);
          }}
        />
      )}
    </div>
  );
});

export default LevelAscensionInput;
