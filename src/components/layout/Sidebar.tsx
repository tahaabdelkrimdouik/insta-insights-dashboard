import { useState, useEffect } from "react";
import { BarChart3, DollarSign, User, ChevronLeft, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "reporting", label: "Reporting", icon: BarChart3 },
  { id: "monetisation", label: "Monetisation", icon: DollarSign },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="gradient-accent rounded-lg p-2">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">InstaMetrics</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px]",
                  isActive
                    ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white"
                    : "text-sidebar-foreground/70"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => handleTabChange("compte")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px]",
              activeTab === "compte"
                ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white"
                : "text-sidebar-foreground/70"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Compte</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo with collapse toggle */}
          <div className="relative px-4 py-6 border-b border-sidebar-border">
            <div className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}>
              <div className="gradient-accent rounded-lg p-2 shrink-0">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="fade-in">
                  <h1 className="text-xl font-bold text-sidebar-foreground">InstaMetrics</h1>
                  <p className="text-xs text-sidebar-foreground/60">Analytics Dashboard</p>
                </div>
              )}
            </div>
            {/* Collapse Button - positioned at edge of sidebar */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors shadow-sm"
            >
              <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", isCollapsed && "rotate-180")} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                isCollapsed && "justify-center px-2"
              )}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {!isCollapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
            </button>

            {/* Account Button at bottom */}
            <button
              onClick={() => handleTabChange("compte")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "compte"
                  ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <User className={cn("h-5 w-5 shrink-0", activeTab === "compte" && "text-white")} />
              {!isCollapsed && <span>Compte</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={cn(
        "hidden lg:block shrink-0 transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )} />
    </>
  );
}
