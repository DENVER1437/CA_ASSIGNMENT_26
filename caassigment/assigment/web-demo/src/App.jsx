import { useState } from 'react';
import { useCacheSimulator } from './hooks/useCacheSimulator';
import VideoBackground from './components/VideoBackground';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SimulationPage from './pages/SimulationPage';
import CacheViewPage from './pages/CacheViewPage';
import StatisticsPage from './pages/StatisticsPage';
import AboutPage from './pages/AboutPage';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'simulation', label: 'Simulation', icon: 'play_circle' },
  { id: 'cache-view', label: 'Cache View', icon: 'table_chart' },
  { id: 'statistics', label: 'Statistics', icon: 'bar_chart' },
  { id: 'about', label: 'About', icon: 'info' },
];

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const sim = useCacheSimulator();

  // Home page renders within the root VideoBackground context

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            hitCount={sim.hitCount}
            missCount={sim.missCount}
            hitRatio={sim.hitRatio}
            accessLog={sim.accessLog}
            onNavigate={setActivePage}
          />
        );
      case 'simulation':
        return (
          <SimulationPage
            accessCache={sim.accessCache}
            fsmState={sim.fsmState}
            lastAccess={sim.lastAccess}
            hitCount={sim.hitCount}
            missCount={sim.missCount}
          />
        );
      case 'cache-view':
        return (
          <CacheViewPage
            cacheLines={sim.cacheLines}
            lastAccess={sim.lastAccess}
            hitRatio={sim.hitRatio}
            hitCount={sim.hitCount}
            missCount={sim.missCount}
            resetCache={sim.resetCache}
          />
        );
      case 'statistics':
        return (
          <StatisticsPage
            hitCount={sim.hitCount}
            missCount={sim.missCount}
            hitRatio={sim.hitRatio}
            accessLog={sim.accessLog}
          />
        );
      case 'about':
        return <AboutPage onNavigate={setActivePage} />;
      default:
        return null;
    }
  };

  const pageTitle = navItems.find(n => n.id === activePage)?.label || 'Dashboard';

  return (
    <>
      <VideoBackground overlayOpacity={0.5} />
      {activePage === 'home' ? (
        <HomePage onNavigate={setActivePage} />
      ) : (
        <Layout
          activePage={activePage}
          onNavigate={setActivePage}
          pageTitle={pageTitle}
          fsmState={sim.fsmState}
        >
          {renderPage()}
        </Layout>
      )}
    </>
  );
}
