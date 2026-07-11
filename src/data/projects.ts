export type ProjectScreenshot = {
  src: string;
  caption: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  description: string;
  details: string;
  insights: string;
  tags: string[];
  year: string;
  githubUrl: string;
  liveUrl: string;
  thumbnail: string;
  screenshots: [ProjectScreenshot, ProjectScreenshot, ProjectScreenshot];
};

export const projects: ProjectItem[] = [
  {
    slug: "notification-engine",
    title: "Automated Notification Engine",
    description:
      "High-throughput task processing system handling 10M+ jobs/day with automatic retries, dead-letter queues, and real-time monitoring.",
    details:
      "Built a distributed task queue system capable of processing over 10 million jobs per day. The architecture features automatic retries with exponential backoff, dead-letter queues for failed tasks, and a real-time monitoring dashboard. Implemented using Go for the core engine, Redis for queue management, gRPC for inter-service communication, and deployed on Kubernetes for horizontal scaling.",
    insights:
      "I learned how back-pressure and idempotent consumers shape the reliability of any queue. Designing dead-letter flows taught me that visibility into failures matters as much as throughput. Kubernetes deepened my appreciation for graceful shutdown and observability in distributed systems.",
    tags: ["Go", "Redis", "gRPC", "Kubernetes"],
    year: "2025",
    githubUrl: "https://github.com/your-handle/distributed-task-queue",
    liveUrl: "https://123.vercel.app",
    thumbnail: "/images/intern1.jpg",
    screenshots: [
      { src: "/images/intern1.jpg", caption: "Home page: the landing dashboard with live queue metrics." },
      { src: "/images/intern2.jpg", caption: "Job monitor: per-worker throughput and retry timeline." },
      { src: "/images/intern3.jpg", caption: "Dead-letter view: inspect, replay, or discard failed jobs." },
    ],
  },
  {
    slug: "aadhar-validator",
    title: "Aadhar Validator",
    description:
      "A composable CLI framework for building internal developer tools with plugin architecture and interactive prompts.",
    details:
      "Designed and developed a composable CLI framework that enables teams to build internal developer tools rapidly. Features a plugin architecture for extensibility, interactive terminal prompts, auto-generated help documentation, and WebAssembly support for cross-platform distribution.",
    insights:
      "Designing a plugin surface forced me to think carefully about stable APIs and versioning. I learned that great developer tooling lives or dies by its ergonomics — clear help text, predictable flags, and fast feedback loops. Shipping WASM cross-platform sharpened my build pipeline skills.",
    tags: ["Rust", "WASM", "TypeScript"],
    year: "2024",
    githubUrl: "https://github.com/your-handle/dev-cli-toolkit",
    liveUrl: "https://567.vercel.app",
    thumbnail: "/images/intern2.jpg",
    screenshots: [
      { src: "/images/intern2.jpg", caption: "Command palette: discover and run plugin commands instantly." },
      { src: "/images/intern3.jpg", caption: "Interactive prompts: guided flows for complex tasks." },
      { src: "/images/intern4.jpg", caption: "Plugin marketplace: install and manage extensions." },
    ],
  },
  {
    slug: "ATS-software",
    title: "AI Powered ATS Softwate",
    description:
      "Stream processing pipeline for event analytics with sub-second query latency over billions of events.",
    details:
      "Architected a real-time analytics engine processing billions of events with sub-second query latency. The pipeline ingests events via Apache Kafka, processes them through a Python-based stream processor, and stores results in ClickHouse for fast analytical queries.",
    insights:
      "Streaming at scale taught me to respect partitioning, ordering guarantees, and exactly-once semantics. I learned that columnar stores like ClickHouse change how you think about schemas. Most importantly, I saw how monitoring lag and consumer health is non-negotiable in production.",
    tags: ["Python", "Apache Kafka", "ClickHouse"],
    year: "2024",
    githubUrl: "https://github.com/your-handle/realtime-analytics",
    liveUrl: "https://785.vercel.app",
    thumbnail: "/images/intern3.jpg",
    screenshots: [
      { src: "/images/intern3.jpg", caption: "Live dashboard: real-time event ingestion overview." },
      { src: "/images/intern4.jpg", caption: "Query console: sub-second analytical queries on ClickHouse." },
      { src: "/images/intern1.jpg", caption: "Pipeline graph: visualize Kafka → processor → sink flow." },
    ],
  },
  {
    slug: "customer-agent",
    title: "AI Powered Customer Support Agent",
    description:
      "Declarative infrastructure management tool with drift detection, plan visualization, and multi-cloud support.",
    details:
      "Created a declarative infrastructure management platform supporting AWS, GCP, and Azure. Features include automatic drift detection, visual plan previews before applying changes, rollback capabilities, and a React-based dashboard.",
    insights:
      "Building multi-cloud abstractions taught me that leaky APIs are unavoidable — the goal is to surface them clearly. Drift detection reinforced how important reconciliation loops are. I came away with deep respect for plan-before-apply workflows and safe rollback as a first-class feature.",
    tags: ["TypeScript", "AWS", "Terraform", "React"],
    year: "2023",
    githubUrl: "https://github.com/your-handle/iac-platform",
    liveUrl: "https://888.streamlit.app",
    thumbnail: "/images/intern4.jpg",
    screenshots: [
      { src: "/images/intern4.jpg", caption: "Project overview: multi-cloud resources at a glance." },
      { src: "/images/intern1.jpg", caption: "Plan preview: visualize changes before they apply." },
      { src: "/images/intern2.jpg", caption: "Drift detection: highlight infra changes outside IaC." },
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);