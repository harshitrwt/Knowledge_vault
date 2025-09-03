import Sidebar from "@/components/Sidebar";
import { Shield, Upload, User } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome to your personal Vault 🚀</p>

        {/* Stats Section */}
        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <Shield className="w-8 h-8 mb-2 text-purple-400" />
            <h2 className="text-xl font-semibold">Secure Storage</h2>
            <p className="text-gray-400 text-sm">
              All your files are encrypted and safe in the vault.
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <Upload className="w-8 h-8 mb-2 text-green-400" />
            <h2 className="text-xl font-semibold">Quick Uploads</h2>
            <p className="text-gray-400 text-sm">
              Upload and manage important files anytime, anywhere.
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow">
            <User className="w-8 h-8 mb-2 text-blue-400" />
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="text-gray-400 text-sm">
              Manage account details and personalize your vault.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
