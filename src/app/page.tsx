import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
      <Toaster />
    </div>
  );
}
