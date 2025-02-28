// This is a server component that can use ISR
export const revalidate = 1800; // 30 minutes

export default function BirthChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
