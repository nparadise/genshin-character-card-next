import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  return {
    title: `Edit: ${decodeURI(params.name)}`,
    description: `Character Card Edit Page`,
  }
}

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
