import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReportingTab } from "@/components/dashboard/ReportingTab";
import { MonetisationTab } from "@/components/dashboard/MonetisationTab";
import { CompteTab } from "@/components/dashboard/CompteTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("reporting");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Add mobile top padding to account for fixed header */}
      <main className="flex-1 p-4 lg:p-6 overflow-auto pt-[76px] lg:pt-6">
        {activeTab === "reporting" && <ReportingTab />}
        {activeTab === "monetisation" && <MonetisationTab />}
        {activeTab === "compte" && <CompteTab />}
      </main>
    </div>
  );
};

export default Index;
