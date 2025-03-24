import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SalesCoach } from './views/SalesCoach';
import { DataAnalysis } from './views/DataAnalysis';
import { KnowledgeSearch } from './views/KnowledgeSearch';
import { Dashboard } from './views/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('coach');

  const renderContent = () => {
    switch (activeTab) {
      case 'coach':
        return <SalesCoach />;
      case 'analysis':
        return <DataAnalysis />;
      case 'knowledge':
        return <KnowledgeSearch />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <SalesCoach />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;