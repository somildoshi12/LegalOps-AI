import React, { useState, useEffect } from 'react';
import {
  FileText, ClipboardList, CheckSquare, Square, ThumbsUp,
  AlertTriangle, RefreshCw, Send, CheckCircle2, ChevronLeft
} from 'lucide-react';
import type { Case } from '../types';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'demand'>('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [isRerunning, setIsRerunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feedback Form State
  const [rating, setRating] = useState('Accurate');
  const [feedbackType, setFeedbackType] = useState('Incorrect facts');
  const [comments, setComments] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const fetchCaseDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (!res.ok) throw new Error('Failed to retrieve case details');
      const data = await res.json();
      setCaseItem(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading case details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle task status');

      // Optimistically update state
      if (caseItem && caseItem.tasks) {
        const updatedTasks = caseItem.tasks.map((t) =>
          t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
        );
        setCaseItem({ ...caseItem, tasks: updatedTasks });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRerunAgent = async () => {
    setIsRerunning(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/run`, { method: 'POST' });
      if (!res.ok) throw new Error('AI orchestration rerun failed');
      await fetchCaseDetails();
      alert('AI Orchestration completed. Case details refreshed.');
    } catch (err: any) {
      alert(`Rerun failed: ${err.message}`);
    } finally {
      setIsRerunning(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent, outputId: string) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatedOutputId: outputId,
          reviewerRole: 'Attorney',
          rating,
          feedbackType: rating === 'Accurate' ? null : feedbackType,
          comments,
        }),
      });

      if (!res.ok) throw new Error('Feedback submission failed');
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
      setComments('');
      await fetchCaseDetails(); // Refresh to show feedback history
    } catch (err: any) {
      alert(`Failed to save feedback: ${err.message}`);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Loading workspace details...</span>
      </div>
    );
  }

  if (error || !caseItem) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <AlertTriangle size={48} className="mx-auto text-red-500" />
        <h3 className="text-xl font-bold text-white">Error loading case details</h3>
        <p className="text-slate-400 text-sm">{error || 'Case not found'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Find generated outputs
  const summaryOutput = caseItem.generatedOutputs?.find((o) => o.outputType === 'Case Summary');
  const demandOutput = caseItem.generatedOutputs?.find((o) => o.outputType === 'Demand Letter Draft');

  // Find evaluation details
  const activeOutput = activeTab === 'summary' ? summaryOutput : demandOutput;
  const evaluation = activeOutput?.evaluations?.[0];

  // Extracted Facts JSON representation
  let extractedJsonObj: any = null;
  if (caseItem.documents && caseItem.documents.length > 0 && caseItem.documents[0].extractedJson) {
    try {
      extractedJsonObj = JSON.parse(caseItem.documents[0].extractedJson as string);
    } catch (e) {
      console.warn('Failed to parse extracted JSON in view');
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-fade-in">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
        >
          <ChevronLeft size={16} />
          <span>Case Dashboard</span>
        </button>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleRerunAgent}
            disabled={isRerunning}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl text-xs transition"
          >
            <RefreshCw size={14} className={isRerunning ? 'animate-spin' : ''} />
            <span>{isRerunning ? 'Orchestrating AI...' : 'Re-Run AI Agent Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Case Details Header Card */}
      <div className="glass-panel p-6 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Client Name</span>
          <h4 className="text-lg font-black text-white">{caseItem.clientName}</h4>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Matter Type</span>
          <h4 className="text-sm font-semibold text-slate-200">{caseItem.matterType}</h4>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Incident Date</span>
          <h4 className="text-sm font-semibold text-slate-200">{caseItem.incidentDate || 'Unspecified'}</h4>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Workflow Status</span>
          <div className="mt-1">
            <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black rounded-lg uppercase tracking-wide">
              {caseItem.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Facts, Checklist, Documents (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 1: Extracted Facts Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              <span>Extracted Structured Facts</span>
            </h3>

            {extractedJsonObj ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono max-h-72 overflow-y-auto space-y-3">
                <div>
                  <span className="text-blue-400">Client:</span> {extractedJsonObj.client}
                </div>
                <div>
                  <span className="text-blue-400">Defendant:</span> {extractedJsonObj.opposing_party}
                </div>
                <div>
                  <span className="text-blue-400">Location:</span> {extractedJsonObj.incident_location}
                </div>
                <div>
                  <span className="text-blue-400">Injuries:</span> {extractedJsonObj.injuries}
                </div>
                <div>
                  <span className="text-blue-400">Treatment:</span> {extractedJsonObj.treatment}
                </div>
                <div>
                  <span className="text-blue-400">Damages:</span> {extractedJsonObj.damages}
                </div>
                {extractedJsonObj.risk_flags?.length > 0 && (
                  <div>
                    <span className="text-red-400">Risk Flags:</span>
                    <ul className="list-disc pl-4 mt-1 text-slate-300">
                      {extractedJsonObj.risk_flags.map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-xs">No facts extracted yet. Run the agent workflow to parse the attached documents.</p>
            )}
          </div>

          {/* Section 2: Paralegal Task List Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <ClipboardList size={18} className="text-purple-400" />
              <span>Paralegal & Attorney Checklist</span>
            </h3>

            <div className="space-y-3">
              {caseItem.tasks && caseItem.tasks.length > 0 ? (
                caseItem.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 border rounded-2xl cursor-pointer transition ${
                      task.status === 'Completed'
                        ? 'bg-slate-900/30 border-slate-800/50 opacity-60'
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-400">
                      {task.status === 'Completed' ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xs font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {task.title}
                      </div>
                      {task.reason && (
                        <p className="text-[10px] text-slate-400 leading-relaxed">{task.reason}</p>
                      )}
                      <div className="flex gap-2 pt-0.5">
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold">
                          {task.ownerRole}
                        </span>
                        {task.priority === 'High' && (
                          <span className="text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">No tasks generated yet.</p>
              )}
            </div>
          </div>

          {/* Section 3: Attached Documents */}
          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <h3 className="text-md font-bold text-white">Attached Files</h3>
            <div className="space-y-2">
              {caseItem.documents && caseItem.documents.length > 0 ? (
                caseItem.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                    <FileText size={16} className="text-blue-400" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-300 truncate">{doc.fileName}</div>
                      <div className="text-[9px] text-slate-500">Confidence Score: {(doc.confidenceScore * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">No documents attached.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Outputs & Review Disclaimers (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
            {/* Header Tabs */}
            <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3.5 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`text-xs font-extrabold pb-1.5 transition border-b-2 uppercase tracking-wider ${
                    activeTab === 'summary'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Case Summary Summary
                </button>
                <button
                  onClick={() => setActiveTab('demand')}
                  className={`text-xs font-extrabold pb-1.5 transition border-b-2 uppercase tracking-wider ${
                    activeTab === 'demand'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Demand Letter Draft
                </button>
              </div>

              {activeOutput && (
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                  {activeOutput.modelName}
                </span>
              )}
            </div>

            {/* Generated Output Content */}
            <div className="p-6 flex-1 text-xs text-slate-300 overflow-y-auto leading-relaxed max-h-[400px]">
              {activeOutput ? (
                <div className="whitespace-pre-wrap font-sans space-y-4">
                  {activeOutput.content}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  No {activeTab === 'summary' ? 'Summary' : 'Demand Draft'} generated yet. Trigger the AI agent rerun.
                </div>
              )}
            </div>

            {/* Quality Scorecard Banner */}
            {evaluation && (
              <div className="bg-slate-900/40 border-t border-slate-800 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completeness</div>
                  <div className="text-lg font-black text-green-400">{(evaluation.completenessScore * 100).toFixed(0)}%</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Grounding</div>
                  <div className="text-lg font-black text-green-400">{(evaluation.groundingScore * 100).toFixed(0)}%</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Safety</div>
                  <div className="text-lg font-black text-green-400">{(evaluation.safetyScore * 100).toFixed(0)}%</div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Overall Quality</div>
                  <div className="text-lg font-black text-blue-400">{(evaluation.finalScore * 100).toFixed(0)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Attorney Review feedback capture (Only show if output exists) */}
          {activeOutput && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <ThumbsUp size={18} className="text-green-400" />
                <span>Submit Attorney Feedback Loop</span>
              </h3>

              {feedbackSubmitted ? (
                <div className="p-4 bg-green-950/40 border border-green-500/25 rounded-2xl text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Feedback recorded successfully! Thank you for the field input.</span>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmitFeedback(e, activeOutput.id)} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-slate-400 font-bold uppercase tracking-wide">Review Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                      >
                        <option value="Accurate">Accurate (No major edits needed)</option>
                        <option value="Needs minor edits">Needs minor edits</option>
                        <option value="Needs major edits">Needs major edits</option>
                        <option value="Unusable">Unusable</option>
                      </select>
                    </div>

                    {rating !== 'Accurate' && (
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wide">Failure Classification</label>
                        <select
                          value={feedbackType}
                          onChange={(e) => setFeedbackType(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                        >
                          <option value="Incorrect facts">Incorrect facts / Hallucination</option>
                          <option value="Missing important details">Missing important details</option>
                          <option value="Tone too formal">Tone too formal</option>
                          <option value="Tone too weak">Tone too weak</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wide">Comments & Correction Notes</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                      placeholder="Detail any corrections needed to improve prompt templates..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Send size={12} />
                      <span>{isSubmittingFeedback ? 'Submitting...' : 'Submit Review'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
