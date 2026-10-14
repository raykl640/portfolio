// All site copy lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Ray Lukorito",
  tagline: "Computer science student & builder of useful things.",
  location: "Nairobi, Kenya",
  email: "raylukorito@gmail.com",
  intro:
    "I study Informatics & Computer Science at Strathmore University. I build practical software — legal help that works offline, sensors for growers, apps for everyday problems.",
  quote: "I like software that works for ordinary people, on ordinary hardware, in their own language.",
  bio: [
    "I'm working through my degree at Strathmore (class of 2027), and most of what I build starts with a real problem someone close to home actually has. My favourite projects mix a bit of AI, a bit of hardware and a lot of plain, careful engineering.",
    "Outside the classroom I've done IT support and data work through internships at New KCC and ADS Western, and picked up iOS development and data analytics along the way.",
  ],
  offClock: "Drawing, reading (novels, neuropsychology, physics, philosophy), music and puzzles.",
  languages: "English and Kiswahili fluently, a little Spanish.",
};

export const links = {
  github: "https://github.com/raykl640",
  linkedin: "https://www.linkedin.com/in/ray-lukorito-405518350",
  email: `mailto:${profile.email}`,
};

export type PosterKind = "haki" | "carnation" | "crop" | "medical";

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  repo: string;
  year: string;
  poster: PosterKind;
  note?: string; // handwritten margin note
};

export const projects: Project[] = [
  {
    title: "HakiAI",
    subtitle: "Legal help for Kenyans, offline",
    description:
      "Ask a legal question in English or Kiswahili and get a plain-language answer drawn straight from Kenyan law — with its sources shown and a formal letter drafted for you. It runs entirely on a laptop, no internet needed.",
    stack: ["Python", "FastAPI", "React", "Local LLM"],
    repo: "https://github.com/raykl640/ICS-PROJECT",
    year: "2026",
    poster: "haki",
    note: "my favourite so far",
  },
  {
    title: "Carnation Monitor",
    subtitle: "A greenhouse that reports back",
    description:
      "An ESP32 device that watches temperature, humidity and air quality for carnation growers, flags bad conditions on a small screen and sends every reading to a live dashboard. Built with my team, Binary Force.",
    stack: ["C++", "ESP32", "InfluxDB"],
    repo: "https://github.com/raykl640/carnation_monitor",
    year: "2026",
    poster: "carnation",
  },
  {
    title: "Crop Recommender",
    subtitle: "What should grow here?",
    description:
      "A machine-learning model that suggests the best crop for a piece of land from its soil and climate, wrapped in an interactive dashboard that walks through how the model was built.",
    stack: ["Python", "scikit-learn", "Streamlit"],
    repo: "https://github.com/raykl640/ML-project",
    year: "2026",
    poster: "crop",
  },
  {
    title: "Medical Specialist App",
    subtitle: "A web app for specialists",
    description:
      "A serverless web app for medical specialists, built on Firebase — hosting, cloud functions and a secured Firestore database.",
    stack: ["JavaScript", "Firebase"],
    repo: "https://github.com/raykl640/Medical_Specialist_App",
    year: "2025",
    poster: "medical",
  },
];

export const alsoBuilt = [
  { title: "Web platform with user accounts", lang: "PHP", repo: "https://github.com/raykl640/IAP" },
  { title: "Unity game prototype", lang: "C#", repo: "https://github.com/raykl640/OS-Unity2" },
  { title: "Data structures from scratch", lang: "C++", repo: "https://github.com/raykl640/CPP-DSA" },
  { title: "Browser audio player", lang: "HTML/JS", repo: "https://github.com/raykl640/audio_player_v2" },
];

export const experience = [
  {
    role: "Intern",
    org: "New KCC Ltd",
    place: "Nairobi",
    period: "Jan – Mar 2026",
    summary: "IT support, hardware and systems maintenance, and data analysis & visualisation.",
  },
  {
    role: "Communications & Admin Support Intern",
    org: "ADS Western",
    place: "Kakamega",
    period: "Jan – Apr 2025",
    summary:
      "Technical support and IT equipment upkeep, data collection for the M&E team, and photography for public-health field work.",
  },
];

export const education = [
  {
    credential: "BSc Informatics & Computer Science",
    school: "Strathmore University",
    period: "2023 – 2027",
  },
  {
    credential: "High School Diploma (KCSE)",
    school: "Friends School Kamusinga",
    period: "2019 – 2022",
  },
];

export type Certification = { name: string; issuer: string; year: string; url?: string };

export const certifications: Certification[] = [
  { name: "Data Analytics & Visualization", issuer: "Strathmore · @iLabAfrica", year: "2026" },
  {
    name: "App Development with Swift",
    issuer: "Apple",
    year: "2025",
    url: `${import.meta.env.BASE_URL}certificates/apple-app-development-with-swift.pdf`,
  },
  { name: "Good Clinical Practice", issuer: "NIDA Clinical Trials Network", year: "2025" },
  { name: "Research Ethics: Informed Consent", issuer: "TRREE", year: "2025" },
];

export const toolkit = [
  { title: "Languages", items: ["Python", "TypeScript", "Java", "C++", "Swift", "Kotlin", "PHP", "SQL"] },
  { title: "Building", items: ["React", "Node.js", "FastAPI", "SwiftUI", "Firebase", "Streamlit"] },
  { title: "Data & AI", items: ["scikit-learn", "Local LLMs", "Vector search", "Data visualisation"] },
  { title: "Hardware & IT", items: ["ESP32 / Arduino", "Linux", "IT support", "Systems maintenance"] },
];
