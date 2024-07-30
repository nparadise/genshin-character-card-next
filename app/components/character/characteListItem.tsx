'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function CharacterListItem({
  name,
}: // onClick,
{
  name: string;
  // onClick: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isTextOverflow, setIsTextOverflow] = useState<boolean>(false);

  const containerButton = useRef<HTMLButtonElement>(null);
  const characterNameDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (characterNameDiv.current === null) return;
    if (containerButton.current === null) return;
    if (
      characterNameDiv.current.clientWidth >
      containerButton.current.clientWidth + 4
    ) {
      setIsTextOverflow(true);
    } else {
      setIsTextOverflow(false);
    }

    if (pathname === `/character/${name}`) containerButton.current.focus();
  }, [pathname, name]);

  return (
    <button
      className="relative w-20 overflow-hidden rounded-sm bg-blue-500 focus:bg-blue-800"
      onClick={() => router.push(`/character/${name}`)}
      ref={containerButton}
      type="button"
    >
      <Image
        src={`/character_icons/${name.toLowerCase()}.png`}
        alt={name}
        className="w-full"
        width={256}
        height={256}
      />
      <div
        className={`inline-block w-fit text-nowrap font-noto-kr text-white ${isTextOverflow && 'text-overflow-anim'}`}
        ref={characterNameDiv}
      >
        {name}
      </div>
    </button>
  );
}
