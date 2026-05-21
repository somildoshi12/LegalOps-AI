import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing database records (cascade will take care of related tables)
  await prisma.feedback.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.agentStep.deleteMany({});
  await prisma.agentRun.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.generatedOutput.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.firm.deleteMany({});

  // 2. Create default Law Firms
  const firm1 = await prisma.firm.create({
    data: {
      name: 'Apex Injury Lawyers',
      practiceArea: 'Personal Injury',
      workflowType: 'Intake to Demand Letter',
      preferredTone: 'Professional & Assertive',
      reviewPolicy: 'All drafts require partner sign-off',
    },
  });

  const firm2 = await prisma.firm.create({
    data: {
      name: 'Glade Counsel Group',
      practiceArea: 'General Civil Litigation',
      workflowType: 'Intake Summarization',
      preferredTone: 'Objective & Analytical',
      reviewPolicy: 'Paralegal pre-screening',
    },
  });

  console.log('Created firms:', [firm1.name, firm2.name]);

  // 3. Create Case 1: Sarah Jenkins (Personal Injury, Status: AI Reviewed)
  const case1 = await prisma.case.create({
    data: {
      firmId: firm1.id,
      clientName: 'Sarah Jenkins',
      matterType: 'Motor Vehicle Accident',
      incidentDate: '2026-03-12',
      status: 'AI Reviewed',
      priority: 'High',
      summary: 'The client, Sarah Jenkins, was rear-ended by a commercial delivery truck operated by Swift Logistics on March 12, 2026, at the intersection of Broad St. and Elm St. in Chicago, IL. The client sustained whiplash, a mild concussion, and a sprained wrist. Medical treatments total $12,450 to date. Liability appears clear based on police report indicating the truck driver failed to yield.',
      riskScore: 0.15,
    },
  });

  // Create document for Case 1
  await prisma.document.create({
    data: {
      caseId: case1.id,
      fileName: 'police_report_jenkins.txt',
      fileType: 'TXT',
      extractedText: 'POLICE REPORT - CHICAGO PD\nDate of Incident: March 12, 2026\nTime: 14:30\nLocation: Intersection of Broad St and Elm St\nVehicle 1: Sarah Jenkins (Honda Civic)\nVehicle 2: Swift Logistics Delivery Truck (Ford Transit) driven by Thomas Miller\nDescription: V2 failed to brake in time, rear-ending V1 while V1 was stopped at a red light. Driver of V2 cited for failure to control speed. V1 driver Jenkins transported to Chicago General Hospital complaining of neck and wrist pain.',
      extractedJson: JSON.stringify({
        parties: ['Sarah Jenkins', 'Thomas Miller', 'Swift Logistics'],
        incidentDate: '2026-03-12',
        location: 'Broad St. and Elm St., Chicago, IL',
        citations: ['Failure to control speed - Thomas Miller'],
      }),
      confidenceScore: 0.98,
    },
  });

  await prisma.document.create({
    data: {
      caseId: case1.id,
      fileName: 'medical_records_jenkins.txt',
      fileType: 'TXT',
      extractedText: 'CHICAGO GENERAL HOSPITAL - ADMISSION SUMMARY\nPatient: Sarah Jenkins\nDOB: 1988-08-22\nDate of Treatment: 2026-03-12\nDiagnosis:\n1. Cervical strain (whiplash)\n2. Wrist sprain (right)\n3. Concussion, mild, without loss of consciousness\nRecommended follow-up: Physical therapy 2x weekly for 6 weeks. Out-of-pocket medical bill: $12,450.',
      extractedJson: JSON.stringify({
        diagnoses: ['Cervical strain', 'Wrist sprain', 'Concussion'],
        medicalBills: 12450.00,
        provider: 'Chicago General Hospital',
      }),
      confidenceScore: 0.95,
    },
  });

  // Tasks for Case 1
  await prisma.task.createMany({
    data: [
      {
        caseId: case1.id,
        title: 'Verify insurance policy limits for Swift Logistics',
        ownerRole: 'Paralegal',
        priority: 'High',
        dueDate: '2026-05-27',
        reason: 'Commercial delivery trucks typically have larger policy limits, crucial for structuring settlement demand.',
        status: 'Pending',
      },
      {
        caseId: case1.id,
        title: 'Request updated medical logs from physical therapist',
        ownerRole: 'Paralegal',
        priority: 'Medium',
        dueDate: '2026-06-03',
        reason: 'Seeding logs indicates physical therapy was recommended for 6 weeks; need to verify compliance and final bill.',
        status: 'Pending',
      },
      {
        caseId: case1.id,
        title: 'Draft demand letter',
        ownerRole: 'Attorney',
        priority: 'High',
        dueDate: '2026-05-25',
        reason: 'Intake and document extraction complete. Attorney needs to draft the demand letter.',
        status: 'Pending',
      },
    ],
  });

  // Generated outputs for Case 1
  const output1 = await prisma.generatedOutput.create({
    data: {
      caseId: case1.id,
      outputType: 'Case Summary',
      content: '### EXECUTIVE CASE SUMMARY\n\n**Client:** Sarah Jenkins\n**Incident Date:** March 12, 2026\n**Defendant:** Swift Logistics (Driver: Thomas Miller)\n**Case Type:** Motor Vehicle Accident (Rear-end Collision)\n\n**Liability Analysis:**\nLiability is strongly established. Defendant Thomas Miller, driving a commercial truck for Swift Logistics, rear-ended client Sarah Jenkins while she was stationary at a red light. Miller was cited by the Chicago Police Department for failure to control speed.\n\n**Injuries & Treatments:**\n- Mild concussion (Chicago General Hospital)\n- Cervical strain / Whiplash (Physical Therapy recommended 2x/week)\n- Right wrist sprain\n\n**Damages to Date:**\n- Medical Bills: $12,450.00\n- Property Damage: Under evaluation (Honda Civic)\n- Lost Wages: Not yet fully quantified\n\n**Missing Details:**\n- Insurance policy limits for Swift Logistics.\n- Physical therapy compliance logs and final bills.',
      promptVersion: '1.2.0',
      modelName: 'Ollama (Llama-3-8B)',
      evaluationScore: 0.92,
    },
  });

  // Create evaluation for output 1
  await prisma.evaluation.create({
    data: {
      generatedOutputId: output1.id,
      schemaValid: true,
      completenessScore: 0.90,
      groundingScore: 0.96,
      hallucinationRisk: 'Low',
      safetyScore: 0.90,
      finalScore: 0.92,
      notes: 'Excellent factual grounding. Identified all medical bill amounts correctly. Flagged missing insurance details appropriately.',
    },
  });

  // 4. Create Case 2: Marcus Vance (Personal Injury, Status: Draft Generated)
  const case2 = await prisma.case.create({
    data: {
      firmId: firm1.id,
      clientName: 'Marcus Vance',
      matterType: 'Premises Liability',
      incidentDate: '2026-01-05',
      status: 'Draft Generated',
      priority: 'Medium',
      summary: 'Client Marcus Vance slipped and fell on an accumulation of black ice in the parking lot of Oakwood Apartments in Elgin, IL on January 5, 2026. The property owner failed to salt or clear the parking lot despite a freezing rain event 12 hours prior. Client sustained a fractured left ankle requiring surgical hardware installation (ORIF). Medical bills total $45,800. Property owner claims Vance was wearing inappropriate footwear.',
      riskScore: 0.45,
    },
  });

  await prisma.document.create({
    data: {
      caseId: case2.id,
      fileName: 'intake_vance.txt',
      fileType: 'TXT',
      extractedText: 'CASE NOTES - OAKWOOD APARTMENTS SLIP & FALL\nClient: Marcus Vance\nIncident Date: Jan 5, 2026\nAddress: 1400 Oakwood Dr, Elgin, IL\nDetails: Vance stepped out of his vehicle in the tenant parking lot at 7:00 AM. Ground was solid black ice. No salt had been applied. Temperature was 18F. Landlord had notice of freezing rain warning from night before. Client fell heavily on left side. Transported by ambulance to Sherman Hospital.',
      extractedJson: JSON.stringify({
        client: 'Marcus Vance',
        incidentDate: '2026-01-05',
        location: 'Oakwood Apartments parking lot, Elgin, IL',
        conditions: 'Black ice, unsalted parking lot',
      }),
      confidenceScore: 0.96,
    },
  });

  await prisma.document.create({
    data: {
      caseId: case2.id,
      fileName: 'medical_bill_summary_vance.txt',
      fileType: 'TXT',
      extractedText: 'ELGIN MEDICAL GROUP - BILLING BREAKDOWN\nPatient: Marcus Vance\nDate of surgery: Jan 6, 2026\nProcedure: Open Reduction Internal Fixation (ORIF) Left Ankle\nSurgeon: Dr. Robert Cole\nHospital Fee: $32,000\nSurgical Fee: $8,500\nAnesthesia: $2,800\nAmbulance: $2,500\nTotal Outstanding Medical Debt: $45,800',
      extractedJson: JSON.stringify({
        procedure: 'ORIF Left Ankle',
        totalBills: 45800.00,
        surgeons: ['Dr. Robert Cole'],
      }),
      confidenceScore: 1.0,
    },
  });

  // Task for Case 2
  await prisma.task.create({
    data: {
      caseId: case2.id,
      title: 'Obtain weather records for Elgin, IL on Jan 4-5, 2026',
      ownerRole: 'Paralegal',
      priority: 'High',
      dueDate: '2026-05-24',
      reason: 'Defending against comparative negligence requires showing the landlord had ample time to clear the ice following the weather event.',
      status: 'Pending',
    }
  });

  await prisma.task.create({
    data: {
      caseId: case2.id,
      title: 'Review and approve generated demand letter draft',
      ownerRole: 'Attorney',
      priority: 'High',
      dueDate: '2026-05-22',
      reason: 'Demand letter draft is generated. Partner review required before mailing to Oakwood Apartments insurer.',
      status: 'Pending',
    }
  });

  // Generated output for Case 2 (Demand Letter Draft)
  const output2 = await prisma.generatedOutput.create({
    data: {
      caseId: case2.id,
      outputType: 'Demand Letter Draft',
      content: 'Apex Injury Lawyers\n100 N. LaSalle St, Suite 500\nChicago, IL 60602\n\nMay 20, 2026\n\nTO: Claims Department\nOakwood Apartments Insurance Co.\nRe: Insured: Oakwood Apartments LLC\nClaimant: Marcus Vance\nDate of Loss: January 5, 2026\nLocation: Tenant Parking Lot, 1400 Oakwood Dr, Elgin, IL\n\nFOR ATTORNEY REVIEW ONLY - NOT LEGAL ADVICE\n\nDear Claims Representative,\n\nPlease be advised that this office represents Mr. Marcus Vance in connection with the severe personal injuries he sustained due to the negligent maintenance of your insured\'s property on January 5, 2026.\n\nSUMMARY OF INCIDENT\nAt approximately 7:00 AM on the morning of January 5, Mr. Vance parked his vehicle in the tenant parking lot at 1400 Oakwood Dr. Upon stepping out of his vehicle, he immediately slipped and fell on a thick layer of unmitigated black ice. The parking lot was in a highly dangerous, unsalted, and unplowed state. Freezing rain warnings had been active for 12 hours prior, giving your insured ample time to address the hazard.\n\nSUMMARY OF INJURIES & TREATMENT\nAs a direct result of the fall, Mr. Vance suffered a severe, displaced trimalleolar fracture of the left ankle. He was transported via ambulance to Sherman Hospital, where he underwent emergency Open Reduction Internal Fixation (ORIF) surgery, performed by Dr. Robert Cole, to install surgical plates and screws.\n\nSPECIAL DAMAGES\nMedical expenses incurred to date are as follows:\n- Sherman Hospital Fees: $32,000.00\n- Surgical Fee (Dr. Cole): $8,500.00\n- Anesthesiology: $2,800.00\n- Ambulance Transport: $2,500.00\nTOTAL MEDICAL DAMAGES: $45,800.00\n\nSETTLEMENT DEMAND\nBased on the clear liability of your insured in failing to maintain safe common premises, we hereby demand the sum of $150,000.00 in full settlement of Mr. Vance\'s claims.\n\nSincerely,\nApex Injury Lawyers\n[Attorney Signature]',
      promptVersion: '1.4.1',
      modelName: 'Ollama (Mistral-7B)',
      evaluationScore: 0.88,
    },
  });

  // Create evaluation for Case 2 output
  await prisma.evaluation.create({
    data: {
      generatedOutputId: output2.id,
      schemaValid: true,
      completenessScore: 0.95,
      groundingScore: 1.0,
      hallucinationRisk: 'Low',
      safetyScore: 0.70,
      finalScore: 0.88,
      notes: 'Factual matching is perfect (100% matches medical bills and locations). Safety score is moderate because the demand letter asserts a definitive liability conclusion and includes a settlement amount placeholder without a strict prompt disclaimer inside the content itself.',
    },
  });

  // Create feedback for Case 2 output
  await prisma.feedback.create({
    data: {
      generatedOutputId: output2.id,
      reviewerRole: 'Attorney',
      rating: 'Needs minor edits',
      feedbackType: 'Missing important details',
      comments: 'The draft is solid, but we should add a paragraph detailing Mr. Vance\'s lost wages and his inability to work for 8 weeks following the ankle surgery.',
    },
  });

  // 5. Create Agent trace details for a sample run
  const agentRun1 = await prisma.agentRun.create({
    data: {
      caseId: case1.id,
      status: 'Success',
      modelName: 'Ollama (Llama-3-8B)',
      totalLatencyMs: 4210,
      totalTokens: 2540,
      estimatedCost: 0.0,
    },
  });

  await prisma.agentStep.createMany({
    data: [
      {
        agentRunId: agentRun1.id,
        stepName: 'extractCaseFacts',
        status: 'Success',
        inputSummary: 'Input: 2 uploaded text documents containing Chicago PD report and hospital admission records.',
        outputSummary: 'Output: Extracted JSON facts (Client: Sarah Jenkins, Injury Date: 2026-03-12, Bills: $12,450, Diagnoses: Cervical strain, Concussion).',
        latencyMs: 1450,
        tokensUsed: 1200,
      },
      {
        agentRunId: agentRun1.id,
        stepName: 'classifyMatter',
        status: 'Success',
        inputSummary: 'Input: Extracted facts from documents.',
        outputSummary: 'Output: Matter type: Motor Vehicle Accident, Urgency: High, Risk score: 0.15.',
        latencyMs: 450,
        tokensUsed: 350,
      },
      {
        agentRunId: agentRun1.id,
        stepName: 'generateCaseSummary',
        status: 'Success',
        inputSummary: 'Input: Fact list + Matter type.',
        outputSummary: 'Output: Formatted Case Summary with executive analysis, injuries, and liability breakdown.',
        latencyMs: 1200,
        tokensUsed: 620,
      },
      {
        agentRunId: agentRun1.id,
        stepName: 'generateTasks',
        status: 'Success',
        inputSummary: 'Input: Case summary + facts.',
        outputSummary: 'Output: Generated 3 automated paralegal/attorney tasks regarding insurance, therapy logs, and draft reviews.',
        latencyMs: 510,
        tokensUsed: 220,
      },
      {
        agentRunId: agentRun1.id,
        stepName: 'runEvaluations',
        status: 'Success',
        inputSummary: 'Input: Case summary and original documents.',
        outputSummary: 'Output: Evaluation results (Completeness: 90%, Grounding: 96%, Final score: 0.92).',
        latencyMs: 600,
        tokensUsed: 150,
      },
    ],
  });

  // 6. Create a failed agent run case for demonstration
  const case3 = await prisma.case.create({
    data: {
      firmId: firm1.id,
      clientName: 'Daniel Martinez',
      matterType: 'Product Liability',
      incidentDate: '2025-11-20',
      status: 'New Intake',
      priority: 'Low',
      summary: 'Client claims a household appliance malfunctioned causing minor property damage. No medical injuries. Document provided is a blurry photo invoice of a replacement toaster.',
      riskScore: 0.8,
    },
  });

  const agentRun2 = await prisma.agentRun.create({
    data: {
      caseId: case3.id,
      status: 'Failed',
      modelName: 'Ollama (Llama-3-8B)',
      totalLatencyMs: 1120,
      totalTokens: 520,
      estimatedCost: 0.0,
      errorMessage: 'FactExtractionError: Failed to extract structured legal parties. Document content insufficient.',
    },
  });

  await prisma.agentStep.createMany({
    data: [
      {
        agentRunId: agentRun2.id,
        stepName: 'extractCaseFacts',
        status: 'Failed',
        inputSummary: 'Input: Photo invoice text.',
        outputSummary: 'Null output.',
        latencyMs: 1120,
        tokensUsed: 520,
        errorMessage: 'FactExtractionError: No client name or incident location identified. Invoice describes a retail sale, not a product injury case.',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
