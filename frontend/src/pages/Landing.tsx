import React from 'react';
import { Scale, Activity, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStartWizard: () => void;
  onViewDashboard: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartWizard, onViewDashboard }) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl text-center z-10 space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-blue-400 text-sm font-semibold mb-2">
          <Cpu size={14} className="animate-spin-slow" />
          <span>FDE Deployment Prototype for Glade.ai</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          LegalOps AI <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Deployment Hub
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Automate case intakes, extract structured clinical facts, draft demand letters, run LLM quality evaluations, and debug agent execution trace pipelines in real-time.
        </p>

        {/* Legal disclaimer */}
        <div className="glass-card max-w-lg mx-auto p-4 rounded-xl border-amber-500/20 text-amber-300 text-xs flex gap-3 text-left">
          <ShieldAlert size={28} className="shrink-0 text-amber-500" />
          <p>
            <strong>Legal Notice:</strong> This platform generates draft legal assistance for attorney review. It does not provide legal advice, does not replace a licensed attorney, and must be reviewed by a human professional prior to any legal application.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={onStartWizard}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Onboard Law Firm Wizard</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onViewDashboard}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold rounded-xl transition-all duration-200"
          >
            <span>Enter Case Dashboard</span>
            <Scale size={18} className="text-blue-400" />
          </button>
        </div>
      </div>

      {/* Feature matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-20 z-10">
        <div className="glass-card p-6 rounded-2xl flex flex-col space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Scale size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Intake & Extraction</h3>
          <p className="text-slate-400 text-sm">
            Ingest unstructured case narratives, police logs, and medical bills. Extract structured JSON entities with high confidence.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Activity size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Agent Evaluations</h3>
          <p className="text-slate-400 text-sm">
            Evaluate LLM drafts using standard criteria: Grounding score, completeness score, and hallucination warnings.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <Cpu size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Execution Debug Tracing</h3>
          <p className="text-slate-400 text-sm">
            Observe every step in the agent loop. Log latency, tokens, cost estimates, and error codes for production reliability.
          </p>
        </div>
      </div>
    </div>
  );
};
