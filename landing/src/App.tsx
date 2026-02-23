import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OSPortal } from './pages/OSPortal';
import { ArticleView } from './pages/ArticleView';
import { PrivacyPage } from './pages/PrivacyPage';
import { ArchivesPage } from './pages/ArchivesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/os" element={<OSPortal />} />
        <Route path="/article/:slug" element={<ArticleView />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/archives" element={<ArchivesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
