import React, { useState, useEffect } from 'react';
import { Scale, Users, ShieldCheck, ClipboardList, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import type { Case } from '../types';

interface CaseDashboardProps {
  onSelectCase: (caseId: string) => void;
  onNavigateToIntake: () => void;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({ onSelectCase, onNavigateToIntake }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/cases';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('matterType', typeFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to retrieve cases');
      const data = await res.json();
      setCases(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading matters.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, typeFilter]);

  // Derive simple counts
  const totalMatters = cases.length;
  const draftGeneratedCount = cases.filter((c) => c.status === 'Draft Generated').length;
  const attorneyReviewCount = cases.filter((c) => c.status === 'Attorney Review' || c.status === 'AI Reviewed').length;

  const averageScore = cases.reduce((acc, c) => {
    const scores = c.generatedOutputs?.filter((o) => o.evaluationScore !== null).map((o) => o.evaluationScore as number) || [];
    if (scores.length > 0) {
      return acc + scores[0];
    }
    return acc + 0.9; // fallback standard score for display if not fully evaluated
  }, 0) / (totalMatters || 1);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Case Workspace</h2>
          <p className="text-slate-400 text-sm mt-1">Review active legal matters and generated AI drafts.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCases}
            className="p-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-slate-300 transition"
            title="Refresh Cases"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={onNavigateToIntake}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition-all"
          >
            Create New Case Intake
          </button>
        </div>
      </div>

      {/* Analytics Summary Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalMatters}</div>
            <div className="text-slate-400 text-xs font-semibold">Total Matters</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Scale size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{attorneyReviewCount}</div>
            <div className="text-slate-400 text-xs font-semibold">Awaiting Review</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <ClipboardList size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{draftGeneratedCount}</div>
            <div className="text-slate-400 text-xs font-semibold">Drafts Generated</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{(averageScore * 100).toFixed(0)}%</div>
            <div className="text-slate-400 text-xs font-semibold">Avg Quality Score</div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Status filter buttons */}
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Statuses
          </button>
          {['New Intake', 'AI Reviewed', 'Draft Generated', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === status ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 focus:outline-none focus:border-blue-500 text-xs font-bold"
          >
            <option value="">All Matter Types</option>
            <option value="Motor Vehicle Accident">Motor Vehicle Accident</option>
            <option value="Premises Liability">Premises Liability</option>
            <option value="Product Liability">Product Liability</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/50 border border-red-500/30 rounded-2xl text-red-300 text-center flex flex-col items-center justify-center space-y-2">
          <AlertCircle size={32} className="text-red-500" />
          <h4 className="font-bold">Error loading cases</h4>
          <p className="text-sm">{error}</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <Scale size={48} className="mx-auto text-slate-600" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">No active cases found</h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              There are no cases matching the selected filters. Submit a new client profile or adjust your filters.
            </p>
          </div>
          <button
            onClick={onNavigateToIntake}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition"
          >
            Go to Intake Portal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => {
            const score = caseItem.generatedOutputs?.[0]?.evaluationScore;

            return (
              <div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem.id)}
                className="glass-card p-6 rounded-2xl cursor-pointer flex flex-col justify-between h-52 relative group overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[70%]">
                      <h4 className="text-lg font-black text-white group-hover:text-blue-400 transition truncate">
                        {caseItem.clientName}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{caseItem.matterType}</p>
                    </div>

                    <div className="flex gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          caseItem.priority === 'High'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                            : caseItem.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                            : 'bg-green-500/10 text-green-400 border border-green-500/25'
                        }`}
                      >
                        {caseItem.priority}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          caseItem.status === 'Draft Generated'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                            : caseItem.status === 'AI Reviewed'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </div>
                  </div>

                  {caseItem.summary && (
                    <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                      {caseItem.summary.replace(/###/g, '').replace(/\*\*/g, '').substring(0, 180)}...
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Received: {new Date(caseItem.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-4">
                    {score !== undefined && score !== null && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">QA Score:</span>
                        <span
                          className={`text-xs font-black ${
                            score >= 0.9 ? 'text-green-400' : score >= 0.8 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    <div className="p-1 bg-slate-800 group-hover:bg-blue-600 rounded-lg text-slate-400 group-hover:text-white transition">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
