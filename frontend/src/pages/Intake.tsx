import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Play, ShieldAlert } from 'lucide-react';
import type { Firm } from '../types';

interface IntakeProps {
  activeFirm: Firm | null;
  onCaseCreated: (caseId: string, runId: string) => void;
  onViewDashboard: () => void;
}

export const Intake: React.FC<IntakeProps> = ({ activeFirm, onCaseCreated, onViewDashboard }) => {
  const [clientName, setClientName] = useState('');
  const [matterType, setMatterType] = useState('Motor Vehicle Accident');
  const [incidentDate, setIncidentDate] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [pastedText, setPastedText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // 0: Idle, 1: Uploading/Parsing, 2: Orchestrating Agent, 3: Evaluating
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSelectDemoData = (caseIndex: number) => {
    const demoCases = [
      {
        name: 'Robert Vance',
        type: 'Motor Vehicle Accident',
        date: '2026-04-18',
        urgency: 'High',
        text: `INCIDENT DESCRIPTION:\nClient Robert Vance was driving northbound on Lake Shore Drive in Chicago, IL when he stopped for traffic. A commercial utility van owned by Apex Heating & Cooling rear-ended his sedan. Police arrived and cited the driver of the van for distracted driving and speeding.\n\nINJURIES:\nMr. Vance reports immediate neck stiffness and severe lower back pain. He visited Chicago Memorial Hospital ER. Diagnosed with cervical radiculopathy and lumbar strain. Recommended physical therapy 3x a week.\n\nDAMAGES:\nEmergency Room invoice: $6,800.00.\nCT Scan charges: $2,400.00.\nAmbulance ride bill: $1,800.00.\nTotal current medical bills: $11,000.00.`,
      },
      {
        name: 'Linda Martinez',
        type: 'Premises Liability',
        date: '2026-02-10',
        urgency: 'Medium',
        text: `ACCIDENT NOTES:\nClaimant Linda Martinez was shopping at BuyMart Superstore in Elgin, IL. While walking through the grocery aisle, she slipped on a large puddle of liquid leaking from a broken refrigeration unit. There were no warning signs present. Multiple employees were in the vicinity prior to the fall.\n\nINJURIES:\nClient fell hard on her left side, sustaining a fractured left wrist and severe bruising to her hip. She underwent wrist reduction surgery at Elgin Orthopedics.\n\nSPECIAL DAMAGES:\nOrthopedic Surgery fees: $14,200.00.\nElgin Hospital emergency fees: $8,500.00.\nPrescription pain medications: $350.00.\nTotal billing: $23,050.00.\nClient missed 4 weeks of work as an administrative assistant ($4,800.00 lost wages).`,
      },
    ];

    const selected = demoCases[caseIndex];
    setClientName(selected.name);
    setMatterType(selected.type);
    setIncidentDate(selected.date);
    setUrgency(selected.urgency);
    setPastedText(selected.text);
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Client Name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Timeline simulations
    setSubmitStep(1); // Uploading & extracting text
    const timer1 = setTimeout(() => setSubmitStep(2), 2000); // Orchestrating AI
    const timer2 = setTimeout(() => setSubmitStep(3), 5000); // Quality Benchmarking

    try {
      const formData = new FormData();
      formData.append('firmId', activeFirm?.id || '');
      formData.append('clientName', clientName);
      formData.append('matterType', matterType);
      formData.append('incidentDate', incidentDate);
      formData.append('urgency', urgency);
      formData.append('pastedText', pastedText);

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/cases', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok) {
        throw new Error('Case creation and workflow execution failed');
      }

      const data = await response.json();
      onCaseCreated(data.caseId, data.agentRunId);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
      setIsSubmitting(false);
      setSubmitStep(0);
    }
  };

  if (isSubmitting) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 flex flex-col items-center justify-center space-y-8 animate-fade-in text-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Running AI Agent Pipeline</h2>
          <p className="text-slate-400 text-sm max-w-sm">
            Please wait while LegalOps AI orchestrates client-facing discovery models.
          </p>
        </div>

        {/* Step checklist */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                submitStep >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              1
            </div>
            <span className={submitStep >= 1 ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
              Extracting document text & facts
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                submitStep >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              2
            </div>
            <span className={submitStep >= 2 ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
              Orchestrating agent (Classify, Summarize, Task Routing, Drafting)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                submitStep >= 3 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              3
            </div>
            <span className={submitStep >= 3 ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
              Benchmarking draft with AI Quality Judge
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Client Intake Portal</h2>
          <p className="text-slate-400 text-sm mt-1">
            Submit a new matter profile for the active firm: <strong className="text-blue-400">{activeFirm?.name || 'Apex Injury Lawyers'}</strong>
          </p>
        </div>
        <button
          onClick={onViewDashboard}
          className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
        >
          View Dashboard
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300 text-sm flex gap-2">
          <AlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recruiter Quick Seeds */}
      <div className="glass-panel p-6 rounded-3xl space-y-3">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
          <Play size={14} className="text-blue-400" />
          <span>Recruiter Quick Demo Datasets</span>
        </h4>
        <p className="text-slate-400 text-xs">
          Select a pre-populated case profile below to instantly test the platform without uploading document files:
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => handleSelectDemoData(0)}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-semibold transition"
          >
            Load MVA: Robert Vance ($11,000 Medical Bills)
          </button>
          <button
            onClick={() => handleSelectDemoData(1)}
            className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-semibold transition"
          >
            Load Fall: Linda Martinez ($23,050 Medical Bills)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form Details */}
        <div className="glass-panel p-8 rounded-3xl space-y-5">
          <h3 className="text-lg font-bold text-white">Matter Profile</h3>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Client Name *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              placeholder="e.g. Robert Vance"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Matter Type</label>
              <select
                value={matterType}
                onChange={(e) => setMatterType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Motor Vehicle Accident">Motor Vehicle Accident</option>
                <option value="Premises Liability">Premises Liability</option>
                <option value="Product Liability">Product Liability</option>
                <option value="Dog Bite">Dog Bite</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Incident Date</label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Urgency Level</label>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setUrgency(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    urgency === p
                      ? p === 'High'
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : p === 'Medium'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Case Intake Narrative / Notes</label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={6}
              className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm resize-none"
              placeholder="Paste case summaries, police report text, or client statement notes..."
            />
          </div>
        </div>

        {/* Right Column: File Uploads */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Attach Case Documents</h3>
            <p className="text-xs text-slate-400">
              Attach medical invoices, incident police reports, or client emails. Supported file types: <strong className="text-slate-300">.txt, .pdf, .docx</strong>.
            </p>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 cursor-pointer bg-slate-900/40 hover:bg-slate-900/60 transition"
            >
              <UploadCloud size={40} className="text-slate-500" />
              <div className="text-sm font-semibold text-slate-300">Drag files here or click to browse</div>
              <input
                type="file"
                multiple
                accept=".txt,.pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-3 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Browse Files
              </label>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Selected Files ({files.length})</h5>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-xs text-slate-300 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-[10px] text-slate-500 ml-auto">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-xl border-amber-500/10 text-amber-400 text-xs flex gap-2.5">
              <ShieldAlert size={20} className="shrink-0 text-amber-500" />
              <span>
                By submitting this intake, you agree to run the LegalOps multi-agent orchestrator to generate drafts and checklist workflows.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Run AI Intake Workflow
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
