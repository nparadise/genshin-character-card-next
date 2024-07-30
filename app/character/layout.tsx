import SideNav from "@/app/components/SideNav";

export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-dvw">
      <div className="shrink-0 h-dvh w-fit">
        <SideNav />
      </div>
      <section className="relative h-dvh grow shrink-0">
        {children}
      </section>
    </div>
  );
}
