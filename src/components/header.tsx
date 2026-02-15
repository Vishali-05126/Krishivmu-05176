import { LayoutTemplate } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex items-center gap-4">
        <LayoutTemplate className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Landing Site Builder</h1>
      </div>
    </header>
  );
}
