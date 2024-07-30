import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-4 bg-blue-800">
      <div className="text-center font-n-myeongjo text-white">
        <h1
          className="text-6xl font-extrabold tracking-widest"
          style={{ textShadow: '0 0 10px black, 0 0 5px black' }}
        >
          Genshin Character Card
        </h1>
        <p
          className="text-2xl tracking-wide"
          style={{ textShadow: '0 0 8px black, 0 0 5px black' }}
        >
          Interactive Genshin Character Card Creator
        </p>
      </div>
      <Link
        className="mx-auto rounded-sm bg-white px-2 py-1 font-noto-kr font-bold text-black active:bg-blue-400"
        href="/character"
      >
        Enter
      </Link>
    </div>
  );
}
