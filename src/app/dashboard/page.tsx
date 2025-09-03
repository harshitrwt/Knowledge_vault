import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 text-white bg-black">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="mt-4">Welcome to your personal Vault 🚀</p>
      </main>
    </div>
  );
}
