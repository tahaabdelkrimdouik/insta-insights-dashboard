import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { ReportingTab } from "@/components/dashboard/ReportingTab";
import { MonitoringTab } from "@/components/dashboard/MonitoringTab";
import { CompteTab } from "@/components/dashboard/CompteTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("reporting");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        {activeTab === "reporting" && <ReportingTab />}
        {activeTab === "monitoring" && <MonitoringTab />}
        {activeTab === "compte" && <CompteTab />}
      </main>
    </div>
  );
};

export default Index;
