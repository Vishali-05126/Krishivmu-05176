import { Leaf, Mic } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">KrishivSeth AI</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Mic className="h-6 w-6" />
          <span className="sr-only">Voice Assistant</span>
        </Button>
      </div>
    </header>
  );
}
