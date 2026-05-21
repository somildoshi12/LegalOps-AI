import React, { useState } from 'react';
import { Briefcase, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Firm } from '../types';

interface OnboardingWizardProps {
  onFirmConfigured: (firm: Firm) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onFirmConfigured, onCancel }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Apex Injury Lawyers');
  const [practiceArea, setPracticeArea] = useState('Personal Injury');
  const [workflowType, setWorkflowType] = useState('Intake to Demand Letter');
  const [preferredTone, setPreferredTone] = useState('Professional & Assertive');
  const [reviewPolicy, setReviewPolicy] = useState('All drafts require partner sign-off');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/firms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          practiceArea,
          workflowType,
          preferredTone,
          reviewPolicy,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save firm configuration');
      }
      const data = await response.json();
      onFirmConfigured(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Step Tracker */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= s
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-24 md:w-36 h-1 mx-2 rounded transition-all duration-300 ${
                  step > s ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-3xl glow-blue space-y-6">
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300 text-sm flex gap-2">
            <AlertCircle className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: General Firm Profile */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <Briefcase size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Firm Profile</h2>
                <p className="text-slate-400 text-sm">Define your law firm identity</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-300">Law Firm Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Apex Injury Lawyers"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-300">Practice Area</label>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Personal Injury">Personal Injury (Recommended)</option>
                  <option value="Premises Liability">Premises Liability</option>
                  <option value="Product Liability">Product Liability</option>
                  <option value="General Civil Litigation">General Civil Litigation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Workflow Config */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Workflow Rules</h2>
                <p className="text-slate-400 text-sm">Configure how AI processes your matters</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-300">Automated Workflow Target</label>
                <select
                  value={workflowType}
                  onChange={(e) => setWorkflowType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Intake to Demand Letter">Intake to Demand Letter Draft</option>
                  <option value="Intake Summarization">Intake Fact Extraction & Summarization Only</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-300">Preferred Demand Letter Tone</label>
                <select
                  value={preferredTone}
                  onChange={(e) => setPreferredTone(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Professional & Assertive">Professional & Assertive (Standard PI)</option>
                  <option value="Technical & Detailed">Technical & Highly Detailed</option>
                  <option value="Objective & Neutral">Objective & Neutral</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Verification / Review Policies */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Review Policies</h2>
                <p className="text-slate-400 text-sm">Define human-in-the-loop validation parameters</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-slate-300">Attorney Review Policy</label>
                <select
                  value={reviewPolicy}
                  onChange={(e) => setReviewPolicy(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="All drafts require partner sign-off">All drafts require partner sign-off (Strict)</option>
                  <option value="Paralegal pre-screening allowed">Paralegal pre-screening prior to attorney review</option>
                  <option value="Direct attorney review">Direct review by the handling attorney</option>
                </select>
              </div>

              {/* Discovery Notes Summary Card */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Client Discovery Summary</h4>
                <div className="text-sm text-slate-300 grid grid-cols-2 gap-2">
                  <div><span className="text-slate-500">Firm:</span> {name}</div>
                  <div><span className="text-slate-500">Type:</span> {practiceArea}</div>
                  <div><span className="text-slate-500">Target:</span> {workflowType}</div>
                  <div><span className="text-slate-500">Tone:</span> {preferredTone}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Configuration...' : 'Finish Setup & Onboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
