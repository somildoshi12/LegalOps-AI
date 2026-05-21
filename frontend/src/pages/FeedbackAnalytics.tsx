import React, { useState, useEffect } from 'react';
import { ThumbsUp, AlertCircle, Compass, ListTodo, RefreshCw } from 'lucide-react';

interface FeedbackAnalyticsData {
  totalRatings: number;
  ratingCounts: {
    Accurate: number;
    'Needs minor edits': number;
    'Needs major edits': number;
    Unusable: number;
  };
  issueCounts: Record<string, number>;
  recommendations: string[];
}

export const FeedbackAnalytics: React.FC = () => {
  const [data, setData] = useState<FeedbackAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/feedback');
      if (!res.ok) throw new Error('Failed to retrieve feedback metrics');
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Error loading feedback data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Calculating feedback metrics...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <h3 className="text-xl font-bold text-white">Error loading analytics</h3>
        <p className="text-slate-400 text-sm">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-6 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const { totalRatings, ratingCounts, issueCounts, recommendations } = data;

  // Simple percentages
  const getPct = (val: number) => (totalRatings > 0 ? (val / totalRatings) * 100 : 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Compass size={28} className="text-blue-500" />
            <span>Product Feedback Analytics</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Analyze attorney-in-the-loop validation trends and automatic product roadmap suggestions.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-slate-300 transition flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={14} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Attorney Rating Breakdowns */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ThumbsUp size={18} className="text-green-400" />
            <span>Attorney Draft Ratings</span>
          </h3>

          <div className="space-y-4">
            {totalRatings === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No reviews submitted yet.</p>
            ) : (
              (['Accurate', 'Needs minor edits', 'Needs major edits', 'Unusable'] as const).map((label) => {
                const count = ratingCounts[label] || 0;
                const pct = getPct(count);

                return (
                  <div key={label} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold">{label}</span>
                      <span>
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          label === 'Accurate'
                            ? 'bg-green-500'
                            : label === 'Needs minor edits'
                            ? 'bg-blue-500'
                            : label === 'Needs major edits'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Card: Common Failure Causes */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-red-400" />
            <span>Common Draft Flag Trends</span>
          </h3>

          <div className="space-y-4">
            {Object.keys(issueCounts).length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No draft quality flags logged yet.</p>
            ) : (
              Object.entries(issueCounts).map(([issue, count]) => {
                const pct = getPct(count);
                return (
                  <div key={issue} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold">{issue}</span>
                      <span>{count} occurrences</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400/80 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recommended Product Roadmap Improvements */}
      <div className="glass-panel p-8 rounded-3xl space-y-5 glow-blue">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ListTodo size={18} className="text-blue-400" />
          <span>Recommended Product Improvements</span>
        </h3>
        <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
          Based on the feedback comments and failure classifications submitted by practicing attorneys, the platform automatically synthesizes recommendations for prompt templates and workflow steps:
        </p>

        <div className="space-y-3 pt-2">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex gap-3 items-start text-xs text-slate-200 leading-relaxed"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                {index + 1}
              </div>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
