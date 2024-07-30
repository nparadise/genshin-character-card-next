import { Metadata } from 'next';

interface Props {
  params: { name: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURI(params.name);
  return {
    title: `Character: ${name}`,
    description: `Character Information`,
  };
}

export default function DynamicCharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
