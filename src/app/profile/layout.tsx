import WithAuth from "@/src/utils/withAuth";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WithAuth>{children}</WithAuth>;
}
