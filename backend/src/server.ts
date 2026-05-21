import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { parseDocument } from './services/parser';
import { runLegalOpsAgent } from './agents/agent';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Setup Multer memory storage (safe, fast, doesn't lock disk files)
const upload = multer({ storage: multer.memoryStorage() });

// -------------------------------------------------------------------------
// FIRM ENDPOINTS
// -------------------------------------------------------------------------
app.get('/api/firms', async (req, res) => {
  try {
    const firms = await prisma.firm.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(firms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/firms', async (req, res) => {
  const { name, practiceArea, workflowType, preferredTone, reviewPolicy } = req.body;
  try {
    const firm = await prisma.firm.create({
      data: {
        name: name || 'Glade Law Group Partner',
        practiceArea: practiceArea || 'Personal Injury',
        workflowType: workflowType || 'Intake to Demand Letter',
        preferredTone: preferredTone || 'Professional & Assertive',
        reviewPolicy: reviewPolicy || 'Attorney sign-off required',
      },
    });
    res.status(201).json(firm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// CASE ENDPOINTS
// -------------------------------------------------------------------------
app.get('/api/cases', async (req, res) => {
  try {
    const { status, matterType } = req.query;
    const filter: any = {};
    if (status) filter.status = String(status);
    if (matterType) filter.matterType = String(matterType);

    const cases = await prisma.case.findMany({
      where: filter,
      include: {
        firm: true,
        generatedOutputs: {
          select: {
            evaluationScore: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(cases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Single endpoint for Case Intake: supports form fields, file uploads, or pasted text fallback
app.post('/api/cases', upload.array('files'), async (req, res) => {
  try {
    const {
      firmId,
      clientName,
      matterType,
      incidentDate,
      pastedText,
      urgency,
    } = req.body;

    // 1. Verify/Create Firm if none provided
    let targetFirmId = firmId;
    if (!targetFirmId) {
      const defaultFirm = await prisma.firm.findFirst();
      if (defaultFirm) {
        targetFirmId = defaultFirm.id;
      } else {
        const newFirm = await prisma.firm.create({
          data: {
            name: 'Default Legal Counsel',
            practiceArea: 'Personal Injury',
            workflowType: 'Intake to Demand Letter',
            preferredTone: 'Professional',
            reviewPolicy: 'Standard Review',
          },
        });
        targetFirmId = newFirm.id;
      }
    }

    // 2. Create the Case
    const newCase = await prisma.case.create({
      data: {
        firmId: targetFirmId,
        clientName: clientName || 'Anonymous Client',
        matterType: matterType || 'Motor Vehicle Accident',
        incidentDate: incidentDate || null,
        status: 'New Intake',
        priority: urgency || 'Medium',
        summary: '',
        riskScore: 0.1,
      },
    });

    // 3. Process Uploaded Files
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const parsedText = await parseDocument(file.buffer, file.originalname, file.mimetype);
          await prisma.document.create({
            data: {
              caseId: newCase.id,
              fileName: file.originalname,
              fileType: file.originalname.split('.').pop()?.toUpperCase() || 'TXT',
              extractedText: parsedText,
              confidenceScore: 0.95,
            },
          });
        } catch (fileErr: any) {
          console.error(`Failed to parse file ${file.originalname}:`, fileErr);
          // Create document with empty text, but flag error in log
          await prisma.document.create({
            data: {
              caseId: newCase.id,
              fileName: file.originalname,
              fileType: 'ERROR',
              extractedText: `Parsing Error: ${fileErr.message}`,
              confidenceScore: 0.0,
            },
          });
        }
      }
    }

    // 4. Handle pasted text fallback
    if (pastedText && pastedText.trim().length > 0) {
      await prisma.document.create({
        data: {
          caseId: newCase.id,
          fileName: 'pasted_intake_notes.txt',
          fileType: 'TXT',
          extractedText: pastedText,
          confidenceScore: 1.0,
        },
      });
    }

    // 5. Trigger the AI Workflow agent (run synchronously for the intake submission, or return case first)
    // For portfolio demo, let's run it synchronously so they see results immediately on return, or return and run
    // Let's run it here and log the run ID
    let runId = '';
    try {
      runId = await runLegalOpsAgent(newCase.id);
    } catch (agentErr) {
      console.error('Agent run failed upon intake:', agentErr);
    }

    res.status(201).json({
      message: 'Case created and AI workflow run initiated',
      caseId: newCase.id,
      agentRunId: runId,
    });
  } catch (error: any) {
    console.error('Intake endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const caseItem = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        firm: true,
        documents: true,
        generatedOutputs: {
          include: {
            evaluations: true,
            feedback: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        agentRuns: {
          include: {
            steps: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger a manual agent rerun
app.post('/api/cases/:id/run', async (req, res) => {
  try {
    const runId = await runLegalOpsAgent(req.params.id);
    res.json({ message: 'AI agent completed successfully', runId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// TASK ENDPOINTS
// -------------------------------------------------------------------------
app.post('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        status: task.status === 'Completed' ? 'Pending' : 'Completed',
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// FEEDBACK & EVALUATION ENDPOINTS
// -------------------------------------------------------------------------
app.post('/api/feedback', async (req, res) => {
  const { generatedOutputId, rating, feedbackType, comments, reviewerRole } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: {
        generatedOutputId,
        reviewerRole: reviewerRole || 'Attorney',
        rating,
        feedbackType,
        comments,
      },
    });
    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/feedback', async (req, res) => {
  try {
    const feedbackList = await prisma.feedback.findMany({
      include: {
        generatedOutput: {
          include: {
            case: true,
          },
        },
      },
    });

    const totalRatings = feedbackList.length;
    const ratingCounts: Record<string, number> = {
      Accurate: 0,
      'Needs minor edits': 0,
      'Needs major edits': 0,
      Unusable: 0,
    };
    const issueCounts: Record<string, number> = {};

    feedbackList.forEach((fb) => {
      if (ratingCounts[fb.rating] !== undefined) {
        ratingCounts[fb.rating]++;
      }
      if (fb.feedbackType) {
        issueCounts[fb.feedbackType] = (issueCounts[fb.feedbackType] || 0) + 1;
      }
    });

    // Auto-generate roadmap recommendations based on issues
    const recommendations: string[] = [];
    if ((issueCounts['Incorrect facts'] || 0) > 0) {
      recommendations.push(
        'Factual errors detected. Recommended Action: Integrate cross-reference validation logic comparing generated entity terms against raw extracted JSON facts before rendering attorney drafts.'
      );
    }
    if ((issueCounts['Missing important details'] || 0) > 0) {
      recommendations.push(
        'Attorneys frequently flagged missing case information. Recommended Action: Enhance Fact Extraction system prompt with stricter instruction to output placeholder tokens (e.g. "[Missing Insurance Policy]") rather than omitting the detail entirely.'
      );
    }
    if ((issueCounts['Tone too formal'] || 0) > 0 || (issueCounts['Tone too weak'] || 0) > 0) {
      recommendations.push(
        'Tone adjustments required. Recommended Action: Link the preferred tone specified in the Firm Onboarding Wizard directly to the Draft Generation system instructions.'
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        'No critical issue trends detected. System performance within normal bounds. Recommended Action: Implement automated RAG expansion to support multi-file legal contract cross-referencing.'
      );
    }

    res.json({
      totalRatings,
      ratingCounts,
      issueCounts,
      recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// DEBUG CONSOLE ENDPOINTS
// -------------------------------------------------------------------------
app.get('/api/agent-runs', async (req, res) => {
  try {
    const runs = await prisma.agentRun.findMany({
      include: {
        case: {
          select: {
            clientName: true,
            matterType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(runs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agent-runs/:id', async (req, res) => {
  try {
    const run = await prisma.agentRun.findUnique({
      where: { id: req.params.id },
      include: {
        steps: {
          orderBy: { createdAt: 'asc' },
        },
        case: true,
      },
    });

    if (!run) {
      return res.status(404).json({ error: 'Agent run not found' });
    }

    res.json(run);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express App
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
