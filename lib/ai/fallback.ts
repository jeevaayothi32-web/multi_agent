import { AnalysisReport } from '../../types/analysis';

export const DEMO_IDEA = "An AI-based system that helps colleges reduce food waste by predicting daily meal demand.";

export const DEMO_REPORT: AnalysisReport = {
  id: 'demo-food-waste-prediction',
  idea: DEMO_IDEA,
  timestamp: new Date().toISOString(),
  overallScore: 79,
  verdict: 'Moderate Potential',
  explanation: 'Your idea shows strong practical feasibility and market viability, but technical execution and legal data privacy concerns require further validation and planning.',
  isDemo: true,
  errors: {},
  results: {
    feasibility: {
      score: 85,
      verdict: 'Highly feasible using standard forecasting tools and dining hall logs.',
      analysis: 'Implementing this system is operationally viable since most colleges already track meal transactions digitally. The core technical requirements are simple forecasting models that do not require high computational budgets. The main hurdle is training and adapting staff to use the dashboard instead of relying on legacy estimation habits.',
      strengths: [
        'Leverages existing student card swipe data and dining registers.',
        'Requires standard time-series data models rather than complex neural networks.',
        'Low initial capital expenditure for cloud hosting and software deployment.'
      ],
      weaknesses: [
        'Dining hall managers may resist adapting to a new software dashboard.',
        'Data quality might vary widely between different university dining partners.'
      ],
      recommendations: [
        'Design a simple, high-impact kitchen-friendly interface (tablet-optimized).',
        'Start with a CSV-import wizard to run analysis before building live database integrations.'
      ]
    },
    market: {
      score: 80,
      verdict: 'Strong demand driven by rising food inflation and sustainability directives.',
      analysis: 'University dining directors are under constant pressure to reduce operational costs and meet university carbon neutrality targets. Food waste is a major line-item cost. Competitors are generic enterprise food inventory solutions, leaving room for a specialized student-behavior-driven campus dining product.',
      target_users: [
        'University Dining Services Directors',
        'Campus Sustainability & Green Office Officers',
        'Contracted Dining Service Providers (e.g., Sodexo, Aramark, Compass Group)'
      ],
      strengths: [
        'Provides immediate, measurable ROI by cutting ingredient purchase costs.',
        'Aligns directly with college marketing campaigns highlighting green initiatives.'
      ],
      weaknesses: [
        'Long and highly bureaucratic university sales cycles (6-12 months).',
        'Dining directors are historically risk-averse and slow to purchase software.'
      ],
      recommendations: [
        'Create a clear financial ROI calculator demonstrating how the software pays for itself in under 90 days.',
        'Provide a free 30-day pilot program for one campus dining hall.'
      ]
    },
    technical: {
      score: 75,
      verdict: 'Moderate complexity using standard Python regression models and React interfaces.',
      analysis: 'The backend will utilize established regression or Prophet models to analyze seasonality, calendar dates, and enrollment metrics. The frontend requires a secure manager dashboard. Data requirements are structured and simple (daily meal counts, weather, student volume), meaning scaling is highly manageable.',
      suggested_technologies: [
        'Next.js (Web Frontend & Internal APIs)',
        'Python/FastAPI (Forecasting & Machine Learning Core)',
        'Meta Prophet / Scikit-Learn (Time-Series Forecasting)',
        'PostgreSQL (Relational Dining Logs Storage)'
      ],
      technical_risks: [
        'Poor predictive performance during the first two weeks of a new semester due to schedule shifts.',
        'Database security vulnerabilities regarding student transaction histories.'
      ],
      recommendations: [
        'Integrate external local weather forecasting APIs, as precipitation directly influences campus dining attendance.',
        'Utilize anonymized tokens instead of raw student names or IDs in the analytics database.'
      ]
    },
    innovation: {
      score: 70,
      verdict: 'Innovative application of standard demand planning to a campus niche.',
      analysis: 'Predictive analytics is common in commercial grocery and restaurant chains, but applying it to college meal-plan structures is innovative. It models specific student behaviors (e.g. weekend mass-exodus, exams stress eating, dorm distribution) rather than standard commercial transaction patterns.',
      strengths: [
        'Tailored specifically to university board plan constraints (sw swipes vs retail sales).',
        'Identifies surplus at the ingredient level before purchase, unlike post-waste tracking tools.'
      ],
      weaknesses: [
        'Relies on standard statistical methods rather than presenting deep proprietary algorithms.',
        'Can be easily replicated by established enterprise resource planning (ERP) companies.'
      ],
      recommendations: [
        'Add a student-facing mobile widget allowing students to RSVP "going/not going" for major meals to build a proprietary feedback loop.',
        'Integrate surplus food redistribution triggers (e.g. auto-alerting local shelters of excess food).'
      ]
    },
    risk: {
      score: 80,
      risk_level: 'Low Risk',
      analysis: 'The operational risks are highly manageable since a safety margin buffer can prevent food shortages. Business risk is low because hosting costs scale dynamically with university data and does not require physical hardware installations.',
      major_risks: [
        'Under-predicting demand, resulting in dining halls running out of meals and student complaints.',
        'Failure to integrate with proprietary card swipe systems (e.g., CBORD, Atrium).'
      ],
      mitigations: [
        'Implement a kitchen-configurable "safety margin buffer" (e.g. +5% default surplus) to ensure meal availability.',
        'Prioritize flat file CSV integrations as a secondary option if live API integrations are blocked.'
      ]
    },
    legal: {
      score: 75,
      verdict: 'Compliant with FERPA data rules with minor contractual IP hurdles.',
      analysis: 'Because the software aggregates dining data, it does not violate student privacy laws like FERPA. However, contract negotiations must clearly establish who owns the historical transaction logs. In addition, standard data protection disclaimers are required.',
      concerns: [
        'Unintentional recording of personally identifiable student swipe data.',
        'Data ownership arguments with third-party campus dining providers (e.g., Sodexo).'
      ],
      recommendations: [
        'Construct a legal data processing addendum (DPA) that explicitly states all transaction data is anonymized and aggregated.',
        'Confirm contract terms state the university owns their raw dining logs while your company owns the trained model weights.'
      ]
    },
    suggestion: {
      summary: 'To commercialize this project successfully, launch a single-hall MVP at your college using CSV exports to demonstrate cost savings, then scale into full system integrations.',
      improvements: [
        'Add local city/campus events (e.g. Homecoming, graduation, exams) into the algorithm features list.',
        'Partner with student sustainability clubs to run audits and gather qualitative feedback on meal preferences.'
      ],
      recommended_features: [
        'Sustainability dashboard displaying CO2, water, and waste savings in real time.',
        'Direct menu optimizer that suggests swapping unpopular dishes based on historical popularity scores.'
      ],
      next_steps: [
        'Request 2-3 years of anonymized historical dining register logs from the university operations board.',
        'Develop a simple Jupyter Notebook using linear regression to establish a baseline error rate.',
        'Create a frontend dashboard prototype and present it to the university dining director.'
      ]
    }
  }
};
