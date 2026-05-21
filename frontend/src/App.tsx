import { useState, useEffect } from 'react';
import { Cpu, Terminal, Compass, ClipboardList, Settings, ShieldAlert } from 'lucide-react';
import type { Firm } from './types';
import { Landing } from './pages/Landing';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { Intake } from './pages/Intake';
import { CaseDashboard } from './pages/CaseDashboard';
import { CaseDetail } from './pages/CaseDetail';
import { DebugConsole } from './pages/DebugConsole';
import { FeedbackAnalytics } from './pages/FeedbackAnalytics';

export default function App() {
  const [page, setPage] = useState<'landing' | 'wizard' | 'intake' | 'dashboard' | 'detail' | 'debug' | 'feedback'>('landing');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeFirm, setActiveFirm] = useState<Firm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active firm on load
  const fetchActiveFirm = async () => {
    try {
      const res = await fetch('/api/firms');
      if (res.ok) {
        const firms = await res.json();
        if (firms.length > 0) {
          setActiveFirm(firms[0]); // Default to first onboarded firm
        }
      }
    } catch (err) {
      console.error('Error fetching active firm:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveFirm();
  }, []);

  const handleFirmConfigured = (firm: Firm) => {
    setActiveFirm(firm);
    setPage('dashboard');
  };

  const handleCaseCreated = (caseId: string, runId: string) => {
    console.log('Case created with run ID:', runId);
    setSelectedCaseId(caseId);
    setPage('detail');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9] flex flex-col font-sans">
      {/* Top Header Navigation (Only show if not on landing) */}
      {page !== 'landing' && (
        <header className="sticky top-0 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => setPage('landing')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:bg-blue-500 transition">
                LO
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                LegalOps <span className="text-blue-400">AI</span>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setPage('dashboard')}
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                  page === 'dashboard' || page === 'detail' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ClipboardList size={14} />
                <span>Cases</span>
              </button>
              <button
                onClick={() => setPage('intake')}
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                  page === 'intake' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu size={14} />
                <span>New Intake</span>
              </button>
              <button
                onClick={() => setPage('feedback')}
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                  page === 'feedback' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass size={14} />
                <span>Feedback Analytics</span>
              </button>
              <button
                onClick={() => setPage('debug')}
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                  page === 'debug' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal size={14} />
                <span>Debug Console</span>
              </button>
            </nav>

            {/* Active Firm Badge & Onboard Trigger */}
            <div className="flex items-center gap-3">
              {activeFirm ? (
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Firm</span>
                  <span className="text-xs font-bold text-slate-300">{activeFirm.name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 border border-amber-500/25 rounded-lg uppercase font-black">
                  No Active Firm
                </span>
              )}

              <button
                onClick={() => setPage('wizard')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white border border-slate-700 transition"
                title="Firm Configuration Setup"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {page === 'landing' && (
          <Landing
            onStartWizard={() => setPage('wizard')}
            onViewDashboard={() => setPage('dashboard')}
          />
        )}

        {page === 'wizard' && (
          <OnboardingWizard
            onFirmConfigured={handleFirmConfigured}
            onCancel={() => setPage(activeFirm ? 'dashboard' : 'landing')}
          />
        )}

        {page === 'intake' && (
          <Intake
            activeFirm={activeFirm}
            onCaseCreated={handleCaseCreated}
            onViewDashboard={() => setPage('dashboard')}
          />
        )}

        {page === 'dashboard' && (
          <CaseDashboard
            onSelectCase={(id) => {
              setSelectedCaseId(id);
              setPage('detail');
            }}
            onNavigateToIntake={() => setPage('intake')}
          />
        )}

        {page === 'detail' && selectedCaseId && (
          <CaseDetail
            caseId={selectedCaseId}
            onBack={() => setPage('dashboard')}
          />
        )}

        {page === 'debug' && <DebugConsole />}

        {page === 'feedback' && <FeedbackAnalytics />}
      </main>

      {/* Footer disclaimers */}
      <footer className="bg-[#080b12] border-t border-slate-900 py-6 text-center text-[10px] text-slate-500 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} LegalOps AI Deployment Hub. FDE Candidate Evaluation Prototype.</span>
          <div className="flex gap-2.5 text-amber-500/80 items-center justify-center font-bold">
            <ShieldAlert size={12} />
            <span>AI drafts are helper utilities. All files require licensed attorney verification before use.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
