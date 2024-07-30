import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Characters",
  description: "Display saved Genshin Characters",
};

export default function CharacterPage(): React.ReactNode {
  return (
    <div className="text-lg font-noto-kr bg-black text-white w-full h-full flex flex-col justify-center items-center">
      <p>왼쪽의 캐릭터를 선택하여 캐릭터 카드를 구경하세요.</p>
      <p>캐릭터 카드가 없다면 추가 버튼으로 캐릭터를 추가해보세요.</p>
    </div>
  );
}
