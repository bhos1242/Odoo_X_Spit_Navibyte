export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">IMS</h1>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
