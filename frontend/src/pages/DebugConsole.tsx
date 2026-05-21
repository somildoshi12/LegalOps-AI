import React, { useState, useEffect } from 'react';
import { Cpu, Clock, DollarSign, ShieldAlert, CheckCircle2, XCircle, RefreshCw, Terminal } from 'lucide-react';
import type { AgentRun } from '../types';

export const DebugConsole: React.FC = () => {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agent-runs');
      if (!res.ok) throw new Error('Failed to retrieve agent logs');
      const data = await res.json();
      setRuns(data);
      if (data.length > 0) {
        handleSelectRun(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred loading traces.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRun = async (runId: string) => {
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/agent-runs/${runId}`);
      if (!res.ok) throw new Error('Failed to retrieve run details');
      const data = await res.json();
      setSelectedRun(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Terminal size={28} className="text-blue-500" />
            <span>Production Debugging Console</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Analyze agent trace telemetry, step latencies, prompt logs, and cost estimates.
          </p>
        </div>
        <button
          onClick={fetchRuns}
          className="p-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-slate-300 transition flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={14} />
          <span>Refresh Traces</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/50 border border-red-500/30 rounded-2xl text-red-300 text-center flex flex-col items-center justify-center space-y-2">
          <ShieldAlert size={32} className="text-red-500" />
          <h4 className="font-bold">Error loading traces</h4>
          <p className="text-sm">{error}</p>
        </div>
      ) : runs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-500">
          No agent traces found in database. Submit an intake form to populate.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Trace List (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Agent Execution Runs</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {runs.map((run) => (
                <div
                  key={run.id}
                  onClick={() => handleSelectRun(run.id)}
                  className={`p-4 rounded-xl cursor-pointer border text-xs transition ${
                    selectedRun?.id === run.id
                      ? 'bg-blue-600/10 border-blue-500 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[9px] uppercase">
                      ID: {run.id.substring(0, 8)}...
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        run.status === 'Success'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>

                  <div className="font-bold text-white mb-1">
                    Client: {run.case?.clientName || 'Case Intake'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Model: {run.modelName}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 mt-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {run.totalLatencyMs}ms
                    </span>
                    <span>{new Date(run.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Execution Step Timeline Traces (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Timeline Traces & Log Variables</h3>

            {isLoadingDetails ? (
              <div className="py-20 flex justify-center items-center glass-panel rounded-3xl">
                <div className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : selectedRun ? (
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                {/* Selected Run Metadata banner */}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-850 pb-4 text-center">
                  <div className="p-3 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center">
                    <Clock size={16} className="text-blue-400 mb-1" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Latency</span>
                    <span className="text-md font-black text-white">{selectedRun.totalLatencyMs}ms</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center">
                    <Cpu size={16} className="text-purple-400 mb-1" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Token Count</span>
                    <span className="text-md font-black text-white">{selectedRun.totalTokens}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center">
                    <DollarSign size={16} className="text-green-400 mb-1" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cost Estimate</span>
                    <span className="text-md font-black text-white">${selectedRun.estimatedCost.toFixed(4)}</span>
                  </div>
                </div>

                {/* Error Box if Failed */}
                {selectedRun.status === 'Failed' && selectedRun.errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-500/25 rounded-2xl text-red-300 text-xs flex gap-3">
                    <ShieldAlert size={20} className="shrink-0 text-red-500" />
                    <div>
                      <h4 className="font-bold text-red-400">Execution Error Caught</h4>
                      <p className="mt-1 leading-relaxed">{selectedRun.errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Steps Timeline vertical representation */}
                <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-8 py-2">
                  {selectedRun.steps && selectedRun.steps.length > 0 ? (
                    selectedRun.steps.map((step, idx) => (
                      <div key={step.id} className="relative group">
                        {/* Status Icon Indicator */}
                        <div className="absolute -left-[35px] top-0 bg-slate-950 p-0.5 rounded-full z-10">
                          {step.status === 'Success' ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500 animate-pulse" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">
                              Step {idx + 1}: {step.stepName}
                            </h4>
                            <div className="flex gap-3 text-[10px] text-slate-500 font-mono">
                              <span>{step.latencyMs}ms</span>
                              {step.tokensUsed > 0 && <span>{step.tokensUsed} tokens</span>}
                            </div>
                          </div>

                          <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1.5 text-[10px] font-mono leading-relaxed">
                            {step.inputSummary && (
                              <div>
                                <span className="text-slate-500">&gt; Input summary:</span>{' '}
                                <span className="text-slate-300">{step.inputSummary}</span>
                              </div>
                            )}
                            {step.outputSummary && (
                              <div>
                                <span className="text-slate-500">&gt; Output summary:</span>{' '}
                                <span className="text-green-400">{step.outputSummary}</span>
                              </div>
                            )}
                            {step.errorMessage && (
                              <div className="text-red-400 font-bold bg-red-950/20 p-2 rounded border border-red-500/20 mt-1">
                                [ERROR] {step.errorMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs">No step traces recorded for this run.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center text-slate-500">
                Select an agent run on the left to inspect step details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
