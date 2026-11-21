require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const collegeProfile = {
  name: 'Ashoka Institute of Technology & Management',
  shortName: 'AITM Varanasi',
  affiliation: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow',
  address: 'Paharia, Sarnath, Varanasi - 221007, Uttar Pradesh',
  tnpHead: 'Mr. O P Sharma (Head – Training & Placement)'
};

const campusDrives = [
  { id: 1, company: 'Accenture', role: 'Associate Software Engineer (ASE)', ctc: '4.50 LPA', minCgpa: 6.5, date: '05 Dec 2026' },
  { id: 2, company: 'Tata Consultancy Services (TCS)', role: 'Ninja / Digital Developer', ctc: '3.36 - 7.00 LPA', minCgpa: 6.0, date: '12 Dec 2026' },
  { id: 3, company: 'Digio Security LLP', role: 'Junior Security & Backend Engineer', ctc: '4.20 LPA', minCgpa: 7.0, date: '18 Dec 2026' },
  { id: 4, company: 'Jaro Education', role: 'Career Development Officer', ctc: '9.56 LPA', minCgpa: 6.0, date: '22 Dec 2026' }
];

let applications = [];

app.get('/api/college-info', (req, res) => {
  res.json({ collegeProfile, campusDrives });
});

app.post('/api/apply', (req, res) => {
  const { studentName, rollNo, branch, cgpa, driveId } = req.body;
  const drive = campusDrives.find((d) => d.id === Number(driveId));
  if (!drive) return res.status(404).json({ message: 'Drive not found' });

  if (Number(cgpa) < drive.minCgpa) {
    return res.status(400).json({ message: `Minimum CGPA required for ${drive.company} is ${drive.minCgpa}` });
  }

  const record = {
    id: Date.now(),
    studentName,
    rollNo,
    branch,
    company: drive.company,
    role: drive.role,
    ctc: drive.ctc,
    date: new Date().toLocaleDateString('en-IN'),
    status: 'Submitted • Eligible & Registered'
  };
  applications.push(record);
  res.json({ message: 'Applied successfully!', application: record });
});

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.post('/api/analyze-resume', async (req, res) => {
  const { studentName, branch, targetRole, resumeText } = req.body;
  if (!genAI) return res.status(503).json({ fallback: true });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a strict technical recruiter reviewing a resume for ${targetRole}.
Candidate: ${studentName} (${branch}, Ashoka Institute of Technology & Management, Varanasi).
Resume Content:
"""
${resumeText}
"""
Return ONLY valid JSON (no markdown) with exact keys:
{
  "score": number (0-100),
  "verdict": "string (honest assessment)",
  "strengths": "string",
  "missingSkills": ["string", "string", "string"],
  "enhancedSummary": "string",
  "improvedBullets": ["string", "string", "string"]
}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch {
    res.status(500).json({ fallback: true });
  }
});

app.post('/api/mock-interview', async (req, res) => {
  const { branch, targetCompany, userAnswer, previousQuestion, expectedTopics } = req.body;
  if (!genAI) return res.status(503).json({ fallback: true });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = !userAnswer
      ? `You are a technical interviewer for ${targetCompany} interviewing a ${branch} student from AITM Varanasi.
Ask ONE clear technical question and provide 3 expected topic keywords.
Reply ONLY in JSON: {"question": "...", "topics": ["...", "...", "..."]}`
      : `You are a strict technical interviewer at ${targetCompany} for a ${branch} student.
Current Question: "${previousQuestion}"
Expected Topics: ${(expectedTopics || []).join(', ')}
Candidate Answer: "${userAnswer}"

Evaluate strictly:
1. If the answer is off-topic, random, or does not address the question asked, mark isRelevant: false and clearly tell the candidate they are not answering the asked question.
2. If relevant, give honest feedback and ask the NEXT technical question.

Reply ONLY in JSON:
{
  "isRelevant": boolean,
  "feedback": "...",
  "nextQuestion": "...",
  "nextTopics": ["...", "...", "..."]
}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(raw));
  } catch {
    res.status(500).json({ fallback: true });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AITM Varanasi Placement Server running on http://localhost:${PORT}`));