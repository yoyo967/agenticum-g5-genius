import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OSPortal } from './pages/OSPortal';
import { ArticleView } from './pages/ArticleView';
import { PrivacyPage } from './pages/PrivacyPage';
import { ArchivesPage } from './pages/ArchivesPage';
import { DemoPage } from './pages/DemoPage';
import { DemoWorkflow } from './pages/DemoWorkflow';
import { BlogPage } from './pages/BlogPage';
import { ModulesPage } from './pages/ModulesPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TechPage } from './pages/TechPage';
import { CompliancePage } from './pages/CompliancePage';
import { AuthProvider } from './components/auth/AuthProvider';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Apex */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/article/:slug" element={<ArticleView />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/demo" element={<DemoPage />} />

          {/* Pillar and Cluster Pages */}
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:agentSlug" element={<AgentDetailPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:moduleSlug" element={<ModuleDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/tech" element={<TechPage />} />
          <Route path="/compliance" element={<CompliancePage />} />

          {/* Blog + Demo */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/demo-workflow" element={<DemoWorkflow />} />

          {/* OS Dashboard & Modules */}
          <Route path="/os" element={<OSPortal />} />
          <Route path="/os/campaigns" element={<OSPortal />} />
          <Route path="/os/genius" element={<OSPortal />} />
          <Route path="/os/nexus" element={<OSPortal />} />
          <Route path="/os/blog" element={<OSPortal />} />
          <Route path="/os/blog/:id" element={<OSPortal />} />
          <Route path="/os/creative" element={<OSPortal />} />
          <Route path="/os/workflows" element={<OSPortal />} />
          <Route path="/os/workflows/:id" element={<OSPortal />} />
          <Route path="/os/vault" element={<OSPortal />} />
          <Route path="/os/memory" element={<OSPortal />} />
          <Route path="/os/analytics" element={<OSPortal />} />
          <Route path="/os/synergy" element={<OSPortal />} />
          <Route path="/os/senate" element={<OSPortal />} />
          <Route path="/os/radar" element={<OSPortal />} />
          <Route path="/os/twin" element={<OSPortal />} />
          <Route path="/os/config" element={<OSPortal />} />
          <Route path="/os/calendar" element={<OSPortal />} />
          <Route path="/os/clients" element={<OSPortal />} />
          <Route path="/os/testing" element={<OSPortal />} />
          <Route path="/os/distribution" element={<OSPortal />} />
          <Route path="/os/performance" element={<OSPortal />} />
          <Route path="/os/knowledge" element={<OSPortal />} />
          <Route path="/os/brand" element={<OSPortal />} />
          <Route path="/os/competitors" element={<OSPortal />} />
          <Route path="/os/notifications" element={<OSPortal />} />
          <Route path="/os/team" element={<OSPortal />} />
          <Route path="/os/billing" element={<OSPortal />} />
          <Route path="/os/playground" element={<OSPortal />} />
          <Route path="/os/integrations" element={<OSPortal />} />
          <Route path="/os/audit" element={<OSPortal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
