/**
 * Every fact on the site lives here — copied verbatim from the root portfolio
 * so the two versions never disagree. Sections render from this; none of them
 * hardcode copy of their own.
 */

export const profile = {
  name: "Raj Tandel",
  role: "Operations Research × Machine Learning",
  location: "South San Francisco, CA",
  status: "Open to conversations",
  email: "raj2511tandel@gmail.com",
  resume: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/resume.pdf`,
  pitch:
    "I'm open to conversations about ML engineering, operations research, and analytics roles — especially ones that involve forecasting, optimization, or decision-support systems for real operations.",
  bio: [
    "I'm Raj Tandel — an Operations Research & ML professional. My day looks like taking an operational problem that arrived as a spreadsheet and leaving it as a model.",
    "M.P.S. in Applied Machine Intelligence from Northeastern (concentration: AI for Finance), B.E. in Computer Engineering from Mahatma Gandhi Institute of Technical Education and Research. I've shipped ML for major automotive and industrial-automation clients in India — and I'm currently building the ERP-integrated operations stack at All Air Mechanical in South San Francisco.",
  ],
} as const;

export const metrics = [
  { value: 10, unit: "k+", label: "Operational records modeled daily" },
  { value: 48, unit: "h", label: "Predictive-maintenance early warning" },
  { value: 35, unit: "%", label: "Lift in defect-detection accuracy" },
  { value: 25, unit: "%", label: "Reduction in equipment downtime" },
] as const;

export type VizKind = "forecast" | "optimize" | "learn" | "decide";

export const disciplines: {
  viz: VizKind;
  title: string;
  body: string;
  tools: string[];
}[] = [
  {
    viz: "forecast",
    title: "Forecasting",
    body: "Demand, production, and financial time-series. Macro-aware models that lifted forecasting accuracy 20%+ at TechNova and enabled 48h-ahead fault warnings on industrial automation assets.",
    tools: ["ARIMA", "Prophet", "XGBoost", "Bayesian"],
  },
  {
    viz: "optimize",
    title: "Optimization",
    body: "Portfolio optimization, resource allocation, scheduling. Markowitz MPT, Sharpe ratio, Monte Carlo, and integer programming — applied when they earn their keep.",
    tools: ["MPT", "Monte Carlo", "SciPy", "OR-Tools"],
  },
  {
    viz: "learn",
    title: "Machine Learning",
    body: "Classification, anomaly detection, OCR, and the occasional deep net. 0.86 AUC stroke-risk prediction, 35% defect-detection lift on automotive assembly lines, LLM-backed ERP assistant.",
    tools: ["Scikit-Learn", "PyTorch", "TensorFlow", "Mistral"],
  },
  {
    viz: "decide",
    title: "Decision Systems",
    body: "Trimble Spectrum ERP warehouses, vendor-invoice pipelines, field-ops platforms. Decision-support tools built for non-technical stakeholders who need answers, not charts.",
    tools: ["Power BI", "Streamlit", "FastAPI", "Next.js"],
  },
];

export type Project = {
  n: string;
  title: string;
  client: string;
  year: string;
  stack: string[];
  summary: string;
  href?: string;
};

export const projects: Project[] = [
  {
    n: "001",
    title: "InvoiceFlow",
    client: "All Air Mechanical",
    year: "2025",
    stack: ["React", "TS", "Python", "Mistral OCR"],
    summary:
      "Invoice OCR + PO-matching platform. Hours of manual entry become seconds of automated extraction across 1,000+ monthly invoices.",
    href: "https://github.com/RajTandel2511/Invoice_Parser",
  },
  {
    n: "002",
    title: "HVAC Ductwork Estimator",
    client: "All Air Mechanical",
    year: "2025",
    stack: ["Python", "Ray Tracing", "PDF"],
    summary:
      "Computer vision on architectural drawings. Ray-tracing + vector-path detection turns a two-day manual take-off into a click.",
    href: "https://github.com/RajTandel2511/Estimator",
  },
  {
    n: "003",
    title: "Spectrum Data Warehouse",
    client: "All Air Mechanical",
    year: "2025",
    stack: ["SQL Server", "Python", "Pandas"],
    summary:
      "Trimble Spectrum ERP mirrored into a clean SQL warehouse with batched exports and manifest tracking — the source of truth for every analytics tool downstream.",
    href: "https://github.com/RajTandel2511/Spectrum_Analysis",
  },
  {
    n: "004",
    title: "AI Assistant for ERP Queries",
    client: "All Air Mechanical",
    year: "2025",
    stack: ["Python", "LLM", "Mistral", "SOAP"],
    summary:
      "Natural-language assistant over the Spectrum ERP. Intent parsing translates business questions into authorized SOAP calls, never exposing the raw API.",
    href: "https://github.com/RajTandel2511/company-brain",
  },
  {
    n: "005",
    title: "Stroke Risk Prediction Model",
    client: "Northeastern University",
    year: "2024",
    stack: ["Scikit-Learn", "Python", "SHAP"],
    summary:
      "Classification pipeline for preventative care. Logistic Regression + Random Forest + Gradient Boosting reaching AUC 0.86 on 10,000+ patient records.",
    href: "https://github.com/RajTandel2511/stroke-risk-prediction",
  },
];

/** Months are "YYYY-MM". `end: null` means current — durations are derived, never typed. */
export type Role = {
  title: string;
  start: string;
  end: string | null;
  bullets: string[];
};

export type Company = {
  company: string;
  where: string;
  /** Newest first. More than one role means a promotion within the company. */
  roles: Role[];
};

export const experience: Company[] = [
  {
    company: "All Air Mechanical Contractors",
    where: "South San Francisco, CA",
    roles: [
      {
        title: "Operations Research Analyst",
        start: "2026-01",
        end: null,
        bullets: [
          "Quantitative + optimization models for scheduling, capacity planning, forecasting, and workload balancing across field, fab, and admin.",
          "Predictive, scenario, and sensitivity analysis evaluating operational performance, cost drivers, and resource constraints.",
          "Decision-support tools and dashboards that translate analytical results into cost-control and continuous-improvement calls for leadership.",
        ],
      },
      {
        title: "Data Scientist — Process Optimization",
        start: "2025-05",
        end: "2026-01",
        bullets: [
          "Transformed legacy operational workflows into intelligent, automated systems during the company's digital transformation.",
          "Shipped InvoiceFlow, the HVAC ductwork estimator, the Spectrum data warehouse, and an AI ERP assistant.",
          "End-to-end ML + data-engineering pipelines, real-time reporting, and scalable models deployed across departments.",
        ],
      },
    ],
  },
  {
    company: "Inovatech Solutions",
    where: "Gujarat, India",
    roles: [
      {
        title: "Data Scientist",
        start: "2023-03",
        end: "2023-08",
        bullets: [
          "Predictive analytics + forecasting for major Indian manufacturing clients (auto + industrial).",
          "Quality-inspection analytics on automotive assembly lines — +35% defect detection.",
          "Anomaly detection + time-series maintenance on industrial automation assets — 48h early warning, −25% downtime.",
          "Led a 6-person AI team; introduced RAG + LangChain agents into industrial workflows.",
        ],
      },
    ],
  },
  {
    company: "TechNova Analytics Solutions",
    where: "Gujarat, India",
    roles: [
      {
        title: "Data Science Associate",
        start: "2022-08",
        end: "2023-03",
        bullets: [
          "Finance + e-commerce models. Forecasting accuracy +20% via time-series, regression, and macro priors.",
          "Automated Python/Spark/SQL pipelines — preprocessing time −30%.",
          "NLP sentiment + customer segmentation with clustering and transformers — +25% CSAT.",
        ],
      },
    ],
  },
  {
    company: "Skyline Projects",
    where: "Gujarat, India",
    roles: [
      {
        title: "Software Engineer",
        start: "2022-01",
        end: "2022-08",
        bullets: [
          "AI-powered web apps with integrated analytics dashboards and ML-based recommendation systems.",
          "Supervised + unsupervised models for real-time classification, fraud detection, and automated decision workflows.",
          "+15% system performance; on-time delivery across the engagement.",
        ],
      },
    ],
  },
];

export const education = [
  {
    degree: "M.P.S. Applied Machine Intelligence",
    school: "Northeastern University",
    where: "Massachusetts, USA",
    period: "Sep 2023 — Mar 2025",
    start: "2023-09",
    end: "2025-03",
    focus: "Concentration: AI for Finance",
  },
  {
    degree: "B.E. Computer Engineering",
    school: "Mahatma Gandhi Institute of Technical Education and Research",
    where: "Gujarat, India",
    period: "Jun 2018 — May 2022",
    start: "2018-06",
    end: "2022-05",
    focus: "",
  },
] as const;

export const certifications = [
  { name: "Deep Learning Specialization", issuer: "DeepLearning.AI · Andrew Ng · Coursera" },
  { name: "Machine Learning", issuer: "Stanford University · Coursera" },
  { name: "Applied Machine Learning: Foundations", issuer: "LinkedIn Learning" },
  { name: "AWS Educate Machine Learning Foundations", issuer: "Amazon Web Services" },
  { name: "Graduate Leadership Institute", issuer: "Northeastern University" },
] as const;

export const reading = {
  title: "Elements of Statistical Learning",
  authors: "Hastie, Tibshirani & Friedman",
} as const;

export const channels = [
  { label: "Email", value: "raj2511tandel@gmail.com", href: "mailto:raj2511tandel@gmail.com", external: false },
  { label: "LinkedIn", value: "in/raj-tandel", href: "https://www.linkedin.com/in/raj-tandel/", external: true },
  { label: "GitHub", value: "RajTandel2511", href: "https://github.com/RajTandel2511", external: true },
] as const;

// ---- derived helpers -------------------------------------------------------

const monthIndex = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

/** Build-time "now". A static site freezes this at each deploy, which is fine. */
export const nowMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

/**
 * Months in a role, counted inclusively the way LinkedIn does and the way the
 * root site always has: Mar 2023 – Aug 2023 is 6 months. Open-ended roles run
 * through the current month.
 */
export function monthsBetween(start: string, end: string | null): number {
  return Math.max(1, monthIndex(end ?? nowMonth) - monthIndex(start) + 1);
}

export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (!y) return `${m} mo`;
  return m ? `${y} yr ${m} mo` : `${y} yr`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(ym: string | null): string {
  if (!ym) return "Present";
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** Earliest role start — the zero point of the experience timeline ruler. */
export const timelineStart = experience
  .flatMap((c) => c.roles.map((r) => r.start))
  .reduce((a, b) => (a < b ? a : b));

/**
 * Layout offset in months from the timeline's zero point, for positioning
 * clips on a ruler. `null` means "now" and lands at the END of the current
 * month. Offsets are month boundaries, so a promotion (one role ending in the
 * month the next begins) abuts exactly instead of overlapping. Use this for
 * geometry only; use monthsBetween for the duration text.
 */
export function monthsFromStart(ym: string | null): number {
  return monthIndex(ym ?? nowMonth) - monthIndex(timelineStart) + (ym ? 0 : 1);
}

/** Total width of the timeline ruler in months, from the first role to now. */
export const timelineMonths = monthsFromStart(null);
