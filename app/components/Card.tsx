'use client';

import Image from 'next/image';
import { memo, useEffect, useRef, useState } from 'react';
import { VscStarFull } from 'react-icons/vsc';
import { getCharacterData } from '@/app/api/genshinCharacterDB';
import { UserCharacterData } from '@/app/api/types';
import { element2Color } from '@/app/api/utils';

interface CardTopProps {
  characterName: string;
  characterTitle: string;
  characterLevel: number;
  element: string;
  isAscended: boolean;
}

const ElementImage = ({ element }: { element: string }) => {
  const src: string =
    element.length !== 0
      ? `/elements/${element.toLowerCase()}.webp`
      : '/elements/placeholder.webp';

  return <Image src={src} alt={element} width={40} height={40} />;
};

const CardTop = memo(function CardTop({
  characterName,
  characterTitle,
  characterLevel,
  element,
  isAscended,
}: CardTopProps) {
  const elementImage = <ElementImage element={element} />;

  return (
    <div className="ml-2 flex items-center font-n-myeongjo text-white">
      {elementImage}
      <div>
        <h2 className="relative z-30 -ms-4 flex items-center text-2xl font-semibold tracking-widest shadow-black text-shadow">
          {characterName}
          <span className="ml-2 inline-block font-noto-kr text-xl font-normal tracking-normal">
            Lv.{characterLevel}
          </span>
          {isAscended && <VscStarFull className="h-5" />}
        </h2>
        <p className="relative z-30 -mt-1 text-base shadow-black text-shadow">
          {characterTitle}
        </p>
      </div>
    </div>
  );
});

function StatRow({
  statName,
  statValue,
}: {
  statName: string;
  statValue: number;
}) {
  const onDisplay = {
    atk: 'Attack',
    def: 'Defence',
    critRate: 'Critical Rate',
    critDmg: 'Critical Damage',
    elem: 'Elemental Mastery',
    energy: 'Energy Recharge',
    dmgBonus: 'DMG Bonus',
    hp: 'HP',
  };

  console.log(statName, statValue);

  return (
    <div className="relative box-border flex justify-between gap-2 overflow-hidden px-8 py-1 font-noto-kr font-bold">
      <div className="absolute left-[5%] top-0 -z-10 h-full w-[90%] -skew-x-[20deg] rounded-br-lg rounded-tl-lg bg-[rgba(255,219,193,0.8)]"></div>
      <div className="w-1/2">
        {onDisplay[statName as keyof typeof onDisplay]}
      </div>
      <div className="w-px bg-black"></div>
      <div className="w-1/3 text-right">{statValue.toFixed(1).toString()}</div>
    </div>
  );
}

const Stats = memo(function Stats({ data }: { data: UserCharacterData }) {
  const ignoreList = ['name', 'levelAscension'];

  return (
    <div className="relative z-30 flex flex-col gap-2">
      {Object.entries(data).map(([key, value]) => {
        if (ignoreList.includes(key)) return '';
        if (value === 0) return '';
        return <StatRow key={key} statName={key} statValue={value} />;
      })}
    </div>
  );
});

export default function Card({
  characterData,
}: {
  characterData: UserCharacterData;
}) {
  const [cardData, setCardData] = useState({
    characterTitle: '',
    characterElement: '',
    elementColor: '',
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<HTMLDivElement>(null);

  const [rotateStyle, setRotateStyle] = useState({});
  const [lightStyle, setLightStyle] = useState({});

  useEffect(() => {
    getCharacterData(characterData.name).then((res) => {
      // console.log(res);
      const elem = res.element.toLowerCase();
      setCardData(() => ({
        characterTitle: res.title,
        characterElement: elem,
        elementColor: element2Color(elem),
      }));
    });
  }, [characterData.name]);

  const mouseMoveHandler = (ev: React.MouseEvent) => {
    if (containerRef.current === null) return;
    if (cardRef.current === null) return;

    const containerBox = containerRef.current.getBoundingClientRect();
    const cardBox = cardRef.current.getBoundingClientRect();

    const offset = {
      x: ev.clientX - containerBox.left,
      y: ev.clientY - containerBox.top,
    };

    const cardBoxInContainer = {
      left: cardBox.left - containerBox.left,
      top: cardBox.top - containerBox.top,
      right: cardBox.right - containerBox.left,
      bottom: cardBox.bottom - containerBox.top,
    };

    window.requestAnimationFrame(() => {
      const calcX: number =
        -(ev.clientY - cardBox.y - cardBox.height / 2) / 200;
      const calcY: number = (ev.clientX - cardBox.x - cardBox.width / 2) / 200;
      setRotateStyle({
        transform: `perspective(200px) rotateX(${calcX}deg) rotateY(${calcY}deg)`,
      });

      if (offset.x < cardBoxInContainer.left) offset.x = 0;
      else if (offset.x > cardBoxInContainer.right) offset.x = cardBox.width;
      else offset.x -= cardBoxInContainer.left;

      if (offset.y < cardBoxInContainer.top) offset.y = 0;
      else if (offset.y > cardBoxInContainer.bottom) offset.y = cardBox.height;
      else offset.y -= cardBoxInContainer.top;

      setLightStyle({
        backgroundImage: `radial-gradient(circle at ${offset.x}px ${offset.y}px, lch(100% 0 0 / 50%), lch(0% 0 0 / 0%) 60%)`,
      });
    });
  };

  const mouseLeaveHandler = () => {
    window.requestAnimationFrame(() => {
      setRotateStyle({});
      setLightStyle({});
    });
  };

  return (
    <div
      className="flex size-full items-center justify-center bg-black"
      onMouseMove={mouseMoveHandler}
      onMouseLeave={mouseLeaveHandler}
      ref={containerRef}
    >
      <div
        className={`relative box-border h-[32rem] w-96 rounded-lg bg-${cardData.elementColor}-950 from-${cardData.elementColor}-400 px-2 py-4`}
        style={{
          ...rotateStyle,
          backgroundImage:
            'radial-gradient(circle at left 15% top 10%, var(--tw-gradient-from), transparent 30%), ' +
            'radial-gradient(circle at right 5% bottom 50%, var(--tw-gradient-from), transparent 25%), ' +
            'radial-gradient(circle at left 30% bottom 5%, var(--tw-gradient-from), transparent 20%)',
        }}
        ref={cardRef}
      >
        <div
          className="absolute left-0 top-0 z-50 size-full rounded-lg"
          ref={effectRef}
          style={lightStyle}
        ></div>
        <div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center overflow-hidden rounded-lg">
          <Image
            src={`/wish_image/${characterData.name.toLowerCase()}.webp`}
            alt="klee image"
            width={1000}
            height={500}
            className="h-full w-auto max-w-none"
          />
        </div>
        <div className="flex h-full flex-col justify-between">
          <CardTop
            characterName={characterData.name}
            characterTitle={cardData.characterTitle}
            characterLevel={characterData.levelAscension.level}
            element={cardData.characterElement}
            isAscended={characterData.levelAscension.isAscended}
          />
          <Stats data={characterData} />
        </div>
      </div>
    </div>
  );
}
