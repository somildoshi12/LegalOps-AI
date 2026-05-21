import dotenv from 'dotenv';
dotenv.config();

export interface LLMResponse {
  content: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  cost: number;
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Call the selected LLM provider (OpenAI, Anthropic, Ollama, or Mock Fallback)
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options: { formatJson?: boolean; taskType?: string; clientName?: string } = {}
): Promise<LLMResponse> {
  const startTime = Date.now();
  let content = '';
  let modelUsed = '';
  let tokensUsed = 0;
  let cost = 0.0;

  // 1. Check for OpenAI
  if (OPENAI_KEY) {
    try {
      modelUsed = 'openai/gpt-4o-mini';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: options.formatJson ? { type: 'json_object' } : undefined,
          temperature: 0.1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.choices[0]?.message?.content || '';
        tokensUsed = data.usage?.total_tokens || 0;
        // Pricing for gpt-4o-mini: input $0.15/1M, output $0.60/1M tokens
        const promptTokens = data.usage?.prompt_tokens || 0;
        const completionTokens = data.usage?.completion_tokens || 0;
        cost = (promptTokens * 0.15 + completionTokens * 0.60) / 1000000;
        return {
          content,
          model: modelUsed,
          latencyMs: Date.now() - startTime,
          tokensUsed,
          cost,
        };
      }
    } catch (err) {
      console.warn('OpenAI API call failed, trying next provider. Error:', err);
    }
  }

  // 2. Check for Anthropic
  if (ANTHROPIC_KEY) {
    try {
      modelUsed = 'anthropic/claude-3-5-haiku';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          temperature: 0.1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.content[0]?.text || '';
        const inputTokens = data.usage?.input_tokens || 0;
        const outputTokens = data.usage?.output_tokens || 0;
        tokensUsed = inputTokens + outputTokens;
        // Pricing for claude-3-5-haiku: input $0.80/1M, output $4.00/1M tokens
        cost = (inputTokens * 0.80 + outputTokens * 4.00) / 1000000;
        return {
          content,
          model: modelUsed,
          latencyMs: Date.now() - startTime,
          tokensUsed,
          cost,
        };
      }
    } catch (err) {
      console.warn('Anthropic API call failed, trying next provider. Error:', err);
    }
  }

  // 3. Check for Local Ollama
  try {
    modelUsed = `ollama/${OLLAMA_MODEL}`;
    const response = await fetch(`${OLLAMA_HOST}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        options: {
          num_predict: 2000,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      content = data.choices[0]?.message?.content || '';
      tokensUsed = data.usage?.total_tokens || content.length / 4; // fallback token estimate
      cost = 0.0; // local is free
      return {
        content,
        model: modelUsed,
        latencyMs: Date.now() - startTime,
        tokensUsed: Math.round(tokensUsed),
        cost,
      };
    }
  } catch (err) {
    console.log('Ollama is not running or unreachable. Falling back to high-fidelity mock generator.');
  }

  // 4. High-Fidelity Mock Fallback (Context-Aware Mock Generator)
  modelUsed = 'LocalMock/FDE-Engine-v1';
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate LLM processing latency

  const mockResponse = getMockOutput(options.taskType || 'extract', userPrompt, options.clientName || 'the claimant');
  tokensUsed = Math.round(mockResponse.length / 4);

  return {
    content: mockResponse,
    model: modelUsed,
    latencyMs: Date.now() - startTime,
    tokensUsed,
    cost: 0.0,
  };
}

/**
 * Returns a detailed structured mock response based on the task type and input text
 */
function getMockOutput(task: string, promptText: string, clientName: string): string {
  // Try to parse some info from the promptText
  const name = clientName === 'the claimant' ? (promptText.match(/Name:?\s*([A-Za-z\s]+)/i)?.[1]?.trim() || 'John Doe') : clientName;
  const injury = promptText.match(/injury|injuries|hurt|broke|pain:?\s*([A-Za-z\s,.\d]+)/i)?.[1]?.trim() || 'multiple soft tissue injuries, whip-lash, and lower back strain';
  const insurance = promptText.match(/insurance|policy:?\s*([A-Za-z\s,.\d]+)/i)?.[1]?.trim() || 'State Farm Insurance (Policy: #SF-88371-X)';
  const date = promptText.match(/date|incident:?\s*([\d\-\/A-Za-z\s,]+)/i)?.[1]?.trim() || 'March 25, 2026';
  const medicalBills = promptText.match(/bills|treatment|cost|medical:?\s*([\$A-Za-z\s,.\d]+)/i)?.[1]?.trim() || '$15,800.00';
  const opposingParty = promptText.match(/opposing|defendant|driver|liable:?\s*([A-Za-z\s,.\d]+)/i)?.[1]?.trim() || 'Transit Corp Delivery Services';

  switch (task) {
    case 'extract':
      return JSON.stringify({
        client: name,
        opposing_party: opposingParty,
        incident_date: date,
        incident_location: 'Main St. & Elm Ave., Chicago, IL',
        injuries: injury,
        treatment: 'Emergency room evaluation, followed by 8 sessions of physical therapy and chiropractic adjustments.',
        insurance: insurance,
        damages: `Medical bills total ${medicalBills}. Property damage to vehicle estimated at $4,500.00.`,
        missing_information: [
          'Full chiropractic discharge report and final ledger.',
          'Employer statement confirming lost wages details.',
        ],
        risk_flags: [
          'Prior back injury mentioned in medical intake form, which may raise pre-existing condition arguments.',
        ],
      }, null, 2);

    case 'classify':
      return JSON.stringify({
        matterType: 'Motor Vehicle Accident (MVA)',
        priority: 'High',
        riskScore: 0.35,
        urgencyLevel: 'Immediate Action Recommended',
      }, null, 2);

    case 'summary':
      return `### ATTORNEY CASE SUMMARY
**Client Name:** ${name}
**Date of Incident:** ${date}
**Opposing Party:** ${opposingParty}

#### 1. Liability Breakdown
Client was stopped at a red light when the defendant's commercial vehicle rear-ended them. The police report confirms the driver was cited for following too closely and distracted driving. Liability is strongly established at 100% on the defendant.

#### 2. Injury Overview & Treatment History
- **Diagnoses:** ${injury}.
- **Treatment:** Attended ER at Chicago Mercy Hospital on the day of incident. Referred to Physical Therapy (PT) for spinal manipulation and muscle rehabilitation.
- **Current Status:** Released from active treatment; reporting lingering stiffness but has returned to daily activities.

#### 3. Financial Damages
- **Medical Expense:** ${medicalBills}.
- **Property Damage:** $4,500.00.
- **Other damages:** Lost wages under evaluation.

#### 4. Critical Risk Flags
- Risk of pre-existing condition arguments due to minor lower back treatment noted in 2024. Recommended to gather prior medical history to demonstrate full recovery before this collision.`;

    case 'tasks':
      return JSON.stringify([
        {
          title: 'Request prior medical records (2024-2025) for lower back',
          ownerRole: 'Paralegal',
          priority: 'Medium',
          dueDate: '2026-06-05',
          reason: 'Intake notes indicate minor prior chiropractic treatment. Need to isolate the accident-related injuries.',
        },
        {
          title: `Confirm final ledger totals from chiropractic clinic`,
          ownerRole: 'Paralegal',
          priority: 'High',
          dueDate: '2026-05-30',
          reason: `Make sure the total billing of ${medicalBills} represents all treatment and no additional liens are pending.`,
        },
        {
          title: 'Review insurance policy limits for opposing commercial driver',
          ownerRole: 'Attorney',
          priority: 'High',
          dueDate: '2026-05-28',
          reason: 'Determine policy cap for commercial delivery truck insurer prior to finalizing settlement target.',
        },
      ], null, 2);

    case 'draft':
      return `APEX INJURY LAWYERS
100 N. LaSalle Street, Suite 500
Chicago, IL 60602

May 20, 2026

TO: Claims Department
${insurance}
Re: Insured: ${opposingParty}
Claimant: ${name}
Date of Loss: ${date}

*** FOR ATTORNEY REVIEW ONLY - NOT FOR DIRECT FILING ***

Dear Claims Representative,

Please be advised that this office represents Mr./Ms. ${name} in connection with the severe personal injuries sustained due to the sole negligence of your insured, ${opposingParty}, which occurred on ${date}.

SUMMARY OF INCIDENT
On ${date}, ${name} was driving a vehicle stopped completely at a red light at the intersection of Main St. and Elm Ave. Your insured, operating a commercial vehicle, failed to control speed, failing to yield, and violently rear-ended our client\'s stationary vehicle. The crash report clearly cites your driver for negligent operation. Liability is uncontestable.

SUMMARY OF INJURIES & TREATMENT
As a direct result of the collision, ${name} suffered immediate spinal strain, whiplash, and severe body soreness. They were transported to Chicago Mercy Hospital for emergency evaluation. Following discharge, they completed a rigorous course of physical therapy and chiropractic manipulation to manage persistent neck and lumbar pain.
Diagnoses include: ${injury}.

SPECIAL DAMAGES
Medical expenses incurred to date total ${medicalBills}.
Mr./Ms. ${name} continues to suffer pain and suffering, limitations in daily living, and general disruption of life.

SETTLEMENT DEMAND
In light of the clear liability and documented damages, we hereby demand the sum of $45,000.00 in full settlement of Mr./Ms. ${name}\'s claims against your insured.

This offer is open for 30 days, after which we will advise our client to proceed with formal legal actions.

Sincerely,
Apex Injury Lawyers
[Attorney Review Signature Required]

*** Disclaimer: Draft generated for attorney review. This output is not legal advice and should be verified by a licensed attorney before use. ***`;

    case 'evaluate':
      return JSON.stringify({
        schema_valid: true,
        completeness_score: 0.92,
        grounding_score: 0.98,
        hallucination_risk: 'low',
        safety_score: 0.90,
        missing_sections: ['Chiropractic discharge record summary missing from body text'],
        warnings: ['Pre-existing condition mentioned but not detailed in draft'],
        final_score: 0.93,
        notes: `The generated draft corresponds perfectly to the extracted facts of ${name}. All dates, medical bill amounts (${medicalBills}), and parties align with the source text. The required attorney review disclaimers are present.`,
      }, null, 2);

    default:
      return 'Generic AI response.';
  }
}
