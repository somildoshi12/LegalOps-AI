export interface Firm {
  id: string;
  name: string;
  practiceArea: string;
  workflowType: string;
  preferredTone: string;
  reviewPolicy: string;
  createdAt: string;
}

export interface Case {
  id: string;
  firmId: string;
  firm: Firm;
  clientName: string;
  matterType: string;
  incidentDate: string | null;
  status: string;
  priority: string;
  summary: string | null;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  documents?: Document[];
  generatedOutputs?: GeneratedOutput[];
  tasks?: Task[];
  agentRuns?: AgentRun[];
}

export interface Document {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  extractedText: string | null;
  extractedJson: string | null; // JSON string
  confidenceScore: number;
  createdAt: string;
}

export interface GeneratedOutput {
  id: string;
  caseId: string;
  outputType: string;
  content: string;
  promptVersion: string;
  modelName: string;
  evaluationScore: number | null;
  createdAt: string;
  evaluations?: Evaluation[];
  feedback?: Feedback[];
}

export interface Task {
  id: string;
  caseId: string;
  title: string;
  ownerRole: string;
  priority: string;
  dueDate: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  caseId: string;
  status: string;
  modelName: string;
  totalLatencyMs: number;
  totalTokens: number;
  estimatedCost: number;
  errorMessage: string | null;
  createdAt: string;
  steps?: AgentStep[];
  case?: {
    clientName: string;
    matterType: string;
  };
}

export interface AgentStep {
  id: string;
  agentRunId: string;
  stepName: string;
  status: string;
  inputSummary: string | null;
  outputSummary: string | null;
  latencyMs: number;
  tokensUsed: number;
  errorMessage: string | null;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  generatedOutputId: string;
  schemaValid: boolean;
  completenessScore: number;
  groundingScore: number;
  hallucinationRisk: string;
  safetyScore: number;
  finalScore: number;
  notes: string | null;
  createdAt: string;
}

export interface Feedback {
  id: string;
  generatedOutputId: string;
  reviewerRole: string;
  rating: string;
  feedbackType: string | null;
  comments: string | null;
  createdAt: string;
}
