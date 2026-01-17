import { Instagram } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="gradient-instagram rounded-xl p-2">
            <Instagram className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">InstaMetrics</h1>
            <p className="text-xs text-muted-foreground">Instagram Analytics Dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
}
