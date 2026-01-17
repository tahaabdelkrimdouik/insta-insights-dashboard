import { BarChart3, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "reporting", label: "Reporting", icon: BarChart3 },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "compte", label: "Compte", icon: User },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <nav className="flex gap-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-instagram rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
