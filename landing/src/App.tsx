import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OSPortal } from './pages/OSPortal';
import { ArticleView } from './pages/ArticleView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/os" element={<OSPortal />} />
        <Route path="/article/:slug" element={<ArticleView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
