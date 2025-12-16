import { useState } from 'react';
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import StatsPage from './pages/StatsPage';
import BottomNav from './components/BottomNav';

type Page = 'home' | 'log' | 'stats' | 'calendar' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'log':
        return <LogPage />;
      case 'stats':
        return <StatsPage />;
      case 'calendar':
        return <div className="p-6 text-center text-gray-400">Calendar - Coming Soon</div>;
      case 'profile':
        return <div className="p-6 text-center text-gray-400">Profile - Coming Soon</div>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </div>
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
