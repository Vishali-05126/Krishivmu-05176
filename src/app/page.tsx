import { Builder } from '@/components/builder';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main className="flex-1">
        <Builder />
      </main>
      <Toaster />
    </div>
  );
}
