import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

if (typeof document !== 'undefined') {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.width = '100%';
  document.body.style.maxWidth = '100%';
  document.body.style.overflowX = 'hidden';
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.style.width = '100%';
    rootEl.style.maxWidth = '100%';
    rootEl.style.margin = '0';
    rootEl.style.padding = '0';
    rootEl.style.textAlign = 'left';
  }
}

const API_BASE = 'http://localhost:5000/api';
const LOGO_SRC = '/ashoka-logo.png';
const CAMPUS_SRC = '/ashoka-campus.jpg';
const USERS_KEY = 'aitm_vns_users_final_v6';

const COLLEGE = {
  title: 'Ashoka Institute of Technology & Management',
  city: 'Varanasi',
  sub: 'AKTU Affiliated • Paharia, Sarnath, Varanasi - 221007 • T&P Cell (Mr. O P Sharma)',
  tracks: [
    { name: 'Software & Web Engineering', tag: 'B.Tech Drives', desc: 'DSA, coding rounds, core CS & technical interviews' },
    { name: 'IT, Cloud & Security', tag: 'Tech & Product', desc: 'APIs, DBMS, authentication, system thinking & labs' },
    { name: 'Management & Counseling', tag: 'B.Tech / MBA / BBA', desc: 'Communication, case prep, client fit & HR rounds' }
  ],
  drives: [
    { id: 1, company: 'Accenture', role: 'Associate Software Engineer', minCgpa: 6.5, branches: 'CSE, AIML, DS, ECE', skills: ['DSA', 'SQL', 'OOP'] },
    { id: 2, company: 'TCS Digital', role: 'Systems / Digital Engineer', minCgpa: 6.5, branches: 'CSE, AIML, DS, ECE, EE', skills: ['DBMS', 'SQL', 'Networks'] },
    { id: 3, company: 'Digio Security', role: 'Junior Security & Backend Eng.', minCgpa: 7.0, branches: 'CSE, AIML, DS', skills: ['Auth/JWT', 'APIs', 'Security'] },
    { id: 4, company: 'Jaro Education', role: 'Career Development & Counseling', minCgpa: 6.0, branches: 'All B.Tech, MBA, BBA', skills: ['Communication', 'Pitch', 'HR'] },
    { id: 5, company: 'Infosys', role: 'Systems Engineer', minCgpa: 6.5, branches: 'CSE, AIML, DS, ECE, EE, ME', skills: ['Coding', 'Arrays', 'DBMS'] },
    { id: 6, company: 'Google', role: 'SWE / Coding Prep Track', minCgpa: 7.5, branches: 'CSE, AIML, DS, ECE', skills: ['Algorithms', 'Complexity', 'DSA'] },
    { id: 7, company: 'Microsoft', role: 'SWE / Design Prep Track', minCgpa: 7.5, branches: 'CSE, AIML, DS, ECE', skills: ['OOP Design', 'Trees/Graphs', 'Testing'] }
  ]
};

const COMP_META = {
  Accenture: { color: '#38bdf8', focus: 'OOP, Stack/Heap, Arrays/Lists & Logical Problem Solving', tip: 'Give definition, example, and complexity/impact.' },
  'TCS Digital': { color: '#a78bfa', focus: 'DBMS Indexing, SQL, TCP/UDP & REST APIs', tip: 'Compare read speed vs write/index trade-offs.' },
  'Digio Security': { color: '#34d399', focus: 'JWT/Sessions, Auth vs Authorization, Validation & Safe Secrets', tip: 'Always validate input & protect auth/secrets.' },
  'Jaro Education': { color: '#fbbf24', focus: 'Active Listening, Value Clarity & Objection Handling', tip: 'Listen first, stay calm, and focus on clear outcomes.' },
  Infosys: { color: '#60a5fa', focus: 'SQL Joins/Queries, Edge Cases & Core Programming', tip: 'Check empty/boundary cases early.' },
  Google: { color: '#f87171', focus: 'Time/Space Complexity, Hash/Tree/Graph & Optimization', tip: 'Explain approach, trade-offs, and Big-O.' },
  Microsoft: { color: '#2dd4bf', focus: 'Modular Design, BFS/DFS & Error Handling', tip: 'Keep code structured, safe, and maintainable.' }
};

const Q_BANK = {
  Accenture: [
    { q: 'For Accenture: Explain Stack vs Heap memory and how OOP helps structure applications.', t: ['stack', 'heap', 'memory', 'oop', 'class', 'object', 'inheritance', 'polymorphism', 'encapsulation'] },
    { q: 'For Accenture: Compare arrays and linked lists on search, insertion, and deletion complexity.', t: ['array', 'linked', 'list', 'complexity', 'o(1)', 'o(n)', 'insert', 'delete', 'search'] }
  ],
  'TCS Digital': [
    { q: 'For TCS Digital: How does database indexing speed up SELECT queries and affect INSERT/UPDATE?', t: ['index', 'indexing', 'database', 'dbms', 'sql', 'select', 'insert', 'update', 'query'] },
    { q: 'For TCS Digital: Compare TCP vs UDP or explain HTTP methods and status codes in REST APIs.', t: ['tcp', 'udp', 'rest', 'api', 'http', 'status', 'get', 'post', 'put', 'delete'] }
  ],
  'Digio Security': [
    { q: 'For Digio Security: How do tokens/sessions authenticate users and prevent SQL injection or unauthorized API access?', t: ['jwt', 'token', 'auth', 'authentication', 'authorization', 'security', 'injection', 'sql', 'api'] },
    { q: 'For Digio Security: Why keep secrets in environment variables and how do you validate API requests?', t: ['env', 'environment', 'secret', 'key', 'validation', 'input', 'security', 'access'] }
  ],
  'Jaro Education': [
    { q: 'For Jaro Education: How do you explain a career program clearly to someone unsure about ROI and commitment?', t: ['listen', 'understand', 'career', 'value', 'benefit', 'communication', 'clarity', 'trust', 'goal'] },
    { q: 'For Jaro Education: How do you handle tough questions or objections calmly during counseling?', t: ['objection', 'calm', 'listen', 'explain', 'communicate', 'patience', 'solution'] }
  ],
  Infosys: [
    { q: 'For Infosys: How do you optimize slow SQL queries or handle edge cases in array/string problems?', t: ['sql', 'query', 'index', 'array', 'string', 'edge', 'case', 'complexity', 'database'] },
    { q: 'For Infosys: Explain INNER JOIN vs LEFT JOIN in SQL with a practical example.', t: ['join', 'inner', 'left', 'sql', 'table', 'row', 'rows', 'match', 'null'] }
  ],
  Google: [
    { q: 'For Google: How do you analyze time and space complexity when optimizing a solution?', t: ['time', 'space', 'complexity', 'big', 'o(n)', 'o(log', 'hash', 'map', 'set', 'tree', 'graph'] },
    { q: 'For Google: When do you pick a hash map/set over sorting or binary search, and what edge cases matter?', t: ['hash', 'map', 'set', 'lookup', 'sort', 'binary', 'search', 'edge', 'key'] }
  ],
  Microsoft: [
    { q: 'For Microsoft: How do you design a clean, maintainable module/service and handle runtime errors?', t: ['design', 'class', 'service', 'error', 'exception', 'handle', 'modular', 'clean', 'interface'] },
    { q: 'For Microsoft: Explain tree/graph traversal such as BFS vs DFS and when to use each.', t: ['tree', 'graph', 'bfs', 'dfs', 'breadth', 'depth', 'traversal', 'queue', 'stack', 'path'] }
  ]
};

const ROLE_SKILLS = {
  'Associate Software Engineer': [
    { k: 'dsa', label: 'DSA' }, { k: 'oop', label: 'OOP' }, { k: 'sql', label: 'SQL/DBMS' }, { k: 'git', label: 'Git' }, { k: 'project', label: 'Projects' }
  ],
  'Full-Stack Web Developer': [
    { k: 'react', label: 'React' }, { k: 'node', label: 'Node/Express' }, { k: 'api', label: 'REST APIs' }, { k: 'sql', label: 'Database' }, { k: 'project', label: 'Projects' }
  ],
  'Data / AI Engineer': [
    { k: 'python', label: 'Python' }, { k: 'sql', label: 'SQL' }, { k: 'data', label: 'Data/ML' }, { k: 'api', label: 'APIs' }, { k: 'project', label: 'Projects' }
  ],
  'Backend & Cloud Engineer': [
    { k: 'api', label: 'APIs & Auth' }, { k: 'sql', label: 'Database' }, { k: 'cloud', label: 'Cloud' }, { k: 'linux', label: 'Linux' }, { k: 'security', label: 'Security' }
  ]
};

const SAMPLE_RESUME =
  'B.Tech CSE student at Ashoka Institute of Technology & Management, Varanasi. Skills: React, Node, SQL, DSA, OOP, Git. Built full-stack web project with auth & REST APIs.';

const INIT_FORM = { name: '', rollNo: '', branch: 'B.Tech CSE', cgpa: '', password: '' };

function isValidRoll(r) {
  return /^\d{10,15}$/.test((r || '').trim());
}

function hasRealWords(txt, minWords = 2, minLen = 8) {
  const clean = (txt || '').trim();
  if (clean.length < minLen) return false;
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < minWords) return false;
  const letters = clean.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length < 4 || /(.)\1{4,}/.test(letters)) return false;
  return true;
}

async function readResumeFile(file) {
  const lower = file.name.toLowerCase();
  if (file.type.startsWith('text/') || lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv')) {
    return (await file.text()).trim();
  }
  const buf = await file.arrayBuffer();
  const latin = new TextDecoder('latin1').decode(new Uint8Array(buf));
  const pdfChunks = [...latin.matchAll(/\(([^()\\]{2,140})\)/g)]
    .map((m) => m[1].replace(/\\n|\\r/g, ' ').replace(/[^\x20-\x7E]/g, ' ').trim())
    .filter((c) => /[a-zA-Z]{2,}/.test(c) && !/^(Helvetica|Arial|Times|Courier|Font|ProcSet)/i.test(c));
  if (pdfChunks.length > 0) {
    return pdfChunks.join(' ').replace(/\s+/g, ' ').trim();
  }
  const readableWords = latin
    .replace(/[^\x20-\x7E]/g, ' ')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z][A-Za-z0-9+#.-]{1,24}$/.test(w))
    .slice(0, 80);
  return readableWords.join(' ').trim();
}

function loadUsers() {
  try {
    const d = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(d) ? d : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export default function App() {
  const [users, setUsers] = useState(() => loadUsers());
  const [student, setStudent] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(INIT_FORM);
  const [authErr, setAuthErr] = useState('');

  const [page, setPage] = useState('dashboard');
  const [apps, setApps] = useState([]);
  const [logoOk, setLogoOk] = useState(true);
  const [campusOk, setCampusOk] = useState(true);
  const [toast, setToast] = useState('');

  // Resume state
  const [fileName, setFileName] = useState('');
  const [resumeTxt, setResumeTxt] = useState('');
  const [role, setRole] = useState('Associate Software Engineer');
  const [report, setReport] = useState(null);
  const [resumeErr, setResumeErr] = useState('');
  const fileInputRef = useRef(null);

  // Interview state
  const [company, setCompany] = useState('Accenture');
  const [msgs, setMsgs] = useState([]);
  const [ans, setAns] = useState('');
  const [liveSpeech, setLiveSpeech] = useState('');
  const [qObj, setQObj] = useState(Q_BANK.Accenture[0]);
  const [qIdx, setQIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const recRef = useRef(null);
  const finalSpeechRef = useRef('');

  const loggedIn = Boolean(student);
  const activeUser = student || form;
  const meta = COMP_META[company] || COMP_META.Accenture;

  const notify = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3200);
  };

  const resetSessionState = () => {
    if (recRef.current) {
      try { recRef.current.stop(); } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setListening(false);
    setFileName('');
    setResumeTxt('');
    setRole('Associate Software Engineer');
    setReport(null);
    setResumeErr('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setCompany('Accenture');
    setMsgs([]);
    setAns('');
    setLiveSpeech('');
    setQObj(Q_BANK.Accenture[0]);
    setQIdx(0);
    finalSpeechRef.current = '';
  };

  const handleLogout = () => {
    resetSessionState();
    setStudent(null);
    setPage('dashboard');
    setForm(INIT_FORM);
    setAuthErr('');
    notify('Logged out — session cleared');
  };

  const speak = (text) => {
    if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 450));
    u.lang = 'en-IN';
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    axios.get(`${API_BASE}/applications`, { timeout: 1800 }).then((r) => {
      if (Array.isArray(r.data)) setApps(r.data);
    }).catch(() => {});
  }, []);

  const buildResumeReport = (sourceText, selectedRole, uploadedName = '', userObj = activeUser) => {
    const combinedLower = `${sourceText} ${uploadedName}`.toLowerCase();
    const targetList = ROLE_SKILLS[selectedRole] || ROLE_SKILLS['Associate Software Engineer'];
    const matched = targetList.filter((x) => combinedLower.includes(x.k));
    const missing = targetList.filter((x) => !combinedLower.includes(x.k)).map((x) => x.label);

    const extraFound = ['react', 'node', 'python', 'java', 'sql', 'dsa', 'oop', 'project', 'intern', 'cloud', 'api']
      .filter((k) => combinedLower.includes(k));

    const matchRatio = matched.length / targetList.length;
    const score = Math.min(95, Math.max(52, Math.round(54 + matchRatio * 32 + Math.min(9, extraFound.length * 2))));

    return {
      score,
      role: selectedRole,
      strengths: matched.length
        ? `Matched skills/areas for ${selectedRole}: ${matched.map((x) => x.label).join(', ')}.`
        : `Resume file "${uploadedName || 'submitted'}" reviewed for ${selectedRole}; add explicit role keywords and project metrics.`,
      missingSkills: missing.length ? missing : ['Quantified Impact', 'System Design Basics'],
      enhancedSummary: `${userObj.name} (${userObj.branch}, CGPA ${userObj.cgpa}) — ${COLLEGE.title}, ${COLLEGE.city}. Focused on ${selectedRole}, strengthening ${matched.length ? matched.map((x) => x.label).join(', ') : 'core CS & problem solving'}.`,
      improvedBullets: [
        `Designed and implemented ${selectedRole} modules with clean structure, input validation, and debugging.`,
        `Applied ${matched[0]?.label || 'core technical skills'} to academic/campus projects with measurable outcomes.`,
        `Prepared structured explanations and coding/HR responses for campus placement drives.`
      ]
    };
  };

  const loadQuestion = async (comp, idx = 0, reset = true) => {
    const list = Q_BANK[comp] || Q_BANK.Accenture;
    const chosen = list[idx % list.length];
    setQObj(chosen);
    setQIdx(idx % list.length);
    if (reset) {
      setMsgs([]);
      setAns('');
      setLiveSpeech('');
      finalSpeechRef.current = '';
    }
    try {
      const r = await axios.post(`${API_BASE}/mock-interview`, { branch: activeUser.branch || 'B.Tech CSE', targetCompany: comp }, { timeout: 8000 });
      if (r.data?.question) {
        const nextQ = { q: r.data.question, t: Array.isArray(r.data.topics) ? r.data.topics : chosen.t };
        setQObj(nextQ);
        const line = `${comp} Question:\n${nextQ.q}`;
        setMsgs((p) => (reset ? [{ who: 'AI Interviewer', txt: line }] : [...p, { who: 'AI Interviewer', txt: line }]));
        speak(nextQ.q);
        return;
      }
    } catch {}
    const line = `${comp} Question:\n${chosen.q}`;
    setMsgs((p) => (reset ? [{ who: 'AI Interviewer', txt: line }] : [...p, { who: 'AI Interviewer', txt: line }]));
    speak(chosen.q);
  };

  const onAuth = (e) => {
    e.preventDefault();
    setAuthErr('');
    const n = form.name.trim();
    const r = form.rollNo.trim();
    const c = parseFloat(form.cgpa);
    const p = form.password;

    if (!isValidRoll(r)) return setAuthErr('Enter a valid 10 to 15 digit AKTU Roll Number (e.g. 2306410100045).');
    if (!p || p.length < 4) return setAuthErr('Password must be at least 4 characters.');

    resetSessionState();

    if (mode === 'register') {
      if (n.length < 2) return setAuthErr('Enter your full name.');
      if (Number.isNaN(c) || c < 0 || c > 10) return setAuthErr('Enter valid CGPA (0 - 10).');
      if (users.some((u) => u.rollNo === r)) return setAuthErr('Roll Number already registered. Use Student Login.');
      const created = { name: n, rollNo: r, branch: form.branch, cgpa: c.toFixed(2), password: p };
      const next = [created, ...users];
      setUsers(next);
      saveUsers(next);
      setStudent(created);
      setForm(INIT_FORM);
      setPage('dashboard');
      notify(`Registered: ${created.name}`);
      return;
    }

    const found = users.find((u) => u.rollNo === r);
    if (found) {
      if (found.password !== p) return setAuthErr('Incorrect password for this Roll Number.');
      const updated = {
        ...found,
        ...(n.length >= 2 ? { name: n } : {}),
        ...(form.branch ? { branch: form.branch } : {}),
        ...(!Number.isNaN(c) && c >= 0 && c <= 10 ? { cgpa: c.toFixed(2) } : {})
      };
      const next = users.map((u) => (u.rollNo === found.rollNo ? updated : u));
      setUsers(next);
      saveUsers(next);
      setStudent(updated);
      setForm(INIT_FORM);
      setPage('dashboard');
      notify(`Welcome, ${updated.name}`);
      return;
    }

    const entry = {
      name: n.length >= 2 ? n : `Student ${r.slice(-4)}`,
      rollNo: r,
      branch: form.branch || 'B.Tech CSE',
      cgpa: !Number.isNaN(c) && c >= 0 && c <= 10 ? c.toFixed(2) : '7.50',
      password: p
    };
    const next = [entry, ...users];
    setUsers(next);
    saveUsers(next);
    setStudent(entry);
    setForm(INIT_FORM);
    setPage('dashboard');
    notify(`Logged in: ${entry.name}`);
  };

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setResumeErr('');
    setFileName(f.name);
    const extracted = await readResumeFile(f);
    const finalContent = extracted || `Resume file: ${f.name} (${activeUser.branch}, target ${role})`;
    setResumeTxt(finalContent);
    const autoRep = buildResumeReport(finalContent, role, f.name, activeUser);
    setReport(autoRep);
    notify(`Analyzed "${f.name}" — suggestions ready!`);
  };

  const onAnalyze = async () => {
    setResumeErr('');
    if (!hasRealWords(resumeTxt || fileName, 2, 6)) {
      return setResumeErr('Upload a resume file or enter skills/projects/education to get suggestions.');
    }

    try {
      const r = await axios.post(
        `${API_BASE}/analyze-resume`,
        { studentName: activeUser.name, branch: activeUser.branch, targetRole: role, resumeText: resumeTxt || fileName },
        { timeout: 8000 }
      );
      if (r.data && typeof r.data.score === 'number') {
        setReport(r.data);
        return;
      }
    } catch {}

    setReport(buildResumeReport(resumeTxt, role, fileName, activeUser));
    notify('Resume suggestions updated!');
  };

  const onApplyDrive = async (d) => {
    const cg = parseFloat(activeUser.cgpa);
    if (Number.isNaN(cg) || cg < d.minCgpa) return notify(`Need ${d.minCgpa} CGPA for ${d.company}.`);
    if (apps.some((a) => a.company === d.company && a.rollNo === activeUser.rollNo)) return notify(`Already applied to ${d.company}.`);
    const item = {
      id: Date.now(),
      studentName: activeUser.name,
      rollNo: activeUser.rollNo,
      company: d.company,
      role: d.role,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Submitted • Eligible'
    };
    try {
      await axios.post(`${API_BASE}/apply`, item, { timeout: 2000 });
    } catch {}
    setApps((p) => [item, ...p]);
    notify(`Applied for ${d.company}`);
  };

  const onAnswer = async (e) => {
    e.preventDefault();
    const spokenCombined = `${finalSpeechRef.current} ${liveSpeech}`.trim();
    const text = (ans || spokenCombined).trim();
    if (!text) return notify('Speak with Mic or type an answer.');

    const nextHistory = [...msgs, { who: activeUser.name || 'Student', txt: text }];
    setMsgs(nextHistory);
    setAns('');
    setLiveSpeech('');
    finalSpeechRef.current = '';

    if (!hasRealWords(text, 2, 8)) {
      const msg = 'Please give a clear answer on the asked question.';
      setMsgs([...nextHistory, { who: 'AI Interviewer', txt: msg }]);
      speak(msg);
      return;
    }

    try {
      const r = await axios.post(
        `${API_BASE}/mock-interview`,
        { branch: activeUser.branch, targetCompany: company, userAnswer: text, previousQuestion: qObj.q, expectedTopics: qObj.t },
        { timeout: 8000 }
      );
      if (r.data && typeof r.data.isRelevant === 'boolean') {
        if (!r.data.isRelevant) {
          const m = `Off-topic: ${r.data.feedback}\n\nAnswer this ${company} question:\n${qObj.q}`;
          setMsgs([...nextHistory, { who: 'AI Interviewer', txt: m }]);
          speak(m);
          return;
        }
        const bank = Q_BANK[company] || Q_BANK.Accenture;
        const ni = (qIdx + 1) % bank.length;
        const nq = { q: r.data.nextQuestion || bank[ni].q, t: Array.isArray(r.data.nextTopics) ? r.data.nextTopics : bank[ni].t };
        setQIdx(ni);
        setQObj(nq);
        const m = `Good (${r.data.feedback})\n\nNext ${company} Question:\n${nq.q}`;
        setMsgs([...nextHistory, { who: 'AI Interviewer', txt: m }]);
        speak(m);
        return;
      }
    } catch {}

    const low = text.toLowerCase();
    const hit = (qObj.t || []).filter((t) => low.includes(t));
    if (hit.length === 0) {
      const off = `Answer does not match the ${company} question topic.\n\nCurrent Question:\n${qObj.q}`;
      setMsgs([...nextHistory, { who: 'AI Interviewer', txt: off }]);
      speak('Answer does not match the asked topic.');
      return;
    }

    const bank = Q_BANK[company] || Q_BANK.Accenture;
    const ni = (qIdx + 1) % bank.length;
    const nq = bank[ni];
    setQIdx(ni);
    setQObj(nq);
    const ok = `Relevant answer (Topics: ${hit.join(', ')}).\n\nNext ${company} Question:\n${nq.q}`;
    setMsgs([...nextHistory, { who: 'AI Interviewer', txt: ok }]);
    speak(nq.q);
  };

  const toggleMic = () => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return notify('Use Chrome or Edge on localhost/HTTPS for voice mic.');

    if (listening && recRef.current) {
      try { recRef.current.stop(); } catch {}
      setListening(false);
      const captured = `${finalSpeechRef.current} ${liveSpeech}`.trim();
      if (captured) {
        setAns((prev) => (prev ? `${prev} ${captured}`.trim() : captured));
      }
      setLiveSpeech('');
      finalSpeechRef.current = '';
      return;
    }

    if (typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel();
    }

    const r = new SR();
    r.lang = 'en-IN';
    r.interimResults = true;
    r.continuous = true;
    finalSpeechRef.current = '';
    setLiveSpeech('');

    r.onstart = () => {
      setListening(true);
      notify('Mic ON — speak your answer clearly.');
    };

    r.onresult = (ev) => {
      let interim = '';
      let finalText = '';
      for (let i = 0; i < ev.results.length; i += 1) {
        const tr = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) {
          finalText += `${tr} `;
        } else {
          interim += `${tr} `;
        }
      }
      finalSpeechRef.current = finalText.trim();
      setLiveSpeech(interim.trim());
      const combined = `${finalText} ${interim}`.replace(/\s+/g, ' ').trim();
      if (combined) {
        setAns(combined);
      }
    };

    r.onerror = (ev) => {
      setListening(false);
      setLiveSpeech('');
      if (ev?.error === 'not-allowed') notify('Allow microphone permission in browser.');
      else notify('Could not hear voice — check mic or type answer.');
    };

    r.onend = () => {
      setListening(false);
      const captured = `${finalSpeechRef.current} ${liveSpeech}`.trim();
      if (captured) {
        setAns(captured);
      }
      setLiveSpeech('');
      finalSpeechRef.current = '';
    };

    recRef.current = r;
    try {
      r.start();
    } catch {
      setListening(false);
      notify('Mic start failed — try again.');
    }
  };

  const myApps = apps.filter((a) => !a.rollNo || a.rollNo === activeUser.rollNo);

  const box = { width: '100%', boxSizing: 'border-box', background: 'rgba(15,23,42,0.94)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: '16px', padding: '22px' };
  const inp = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.32)', background: '#050914', color: '#f8fafc', fontSize: '14px', boxSizing: 'border-box' };
  const btn = { background: 'linear-gradient(135deg,#0ea5e9,#4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer', whiteSpace: 'nowrap' };
  const btn2 = { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(148,163,184,0.32)', borderRadius: '10px', padding: '10px 14px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer', whiteSpace: 'nowrap' };

  return (
    <div style={{ width: '100%', minHeight: '100vh', paddingBottom: '48px', color: '#f8fafc', fontFamily: "'Segoe UI',system-ui,sans-serif", backgroundColor: '#060c18', backgroundImage: campusOk ? `linear-gradient(180deg,rgba(6,12,24,0.88),rgba(6,10,20,0.96)),url(${CAMPUS_SRC})` : undefined, backgroundSize: 'cover', backgroundAttachment: 'fixed', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '24px', zIndex: 80, background: '#0f172a', border: '1px solid #38bdf8', padding: '11px 16px', borderRadius: '11px', fontSize: '13px', fontWeight: 600 }}>{toast}</div>}

      <header style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(8,14,28,0.96)', borderBottom: '1px solid rgba(148,163,184,0.22)', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={LOGO_SRC} alt="Logo" onLoad={() => setLogoOk(true)} onError={() => setLogoOk(false)} style={{ display: logoOk ? 'block' : 'none', width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fbbf24', background: '#fff', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '17px' }}>{COLLEGE.title} <span style={{ color: '#fbbf24' }}>{COLLEGE.city}</span></div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{loggedIn ? `${activeUser.name} • Roll: ${activeUser.rollNo} • ${activeUser.branch} • CGPA ${activeUser.cgpa}` : COLLEGE.sub}</div>
          </div>
        </div>

        {loggedIn ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button type="button" onClick={() => setPage('dashboard')} style={page === 'dashboard' ? btn : btn2}>Drives</button>
            <button type="button" onClick={() => setPage('resume')} style={page === 'resume' ? btn : btn2}>Resume AI</button>
            <button type="button" onClick={() => { setPage('interview'); if (!msgs.length) loadQuestion(company, 0, true); }} style={page === 'interview' ? btn : btn2}>Mock Interview</button>
            <button type="button" onClick={() => setPage('tracker')} style={page === 'tracker' ? btn : btn2}>Applications ({myApps.length})</button>
            <button type="button" onClick={handleLogout} style={{ ...btn2, color: '#fca5a5' }}>Logout</button>
          </div>
        ) : (
          <span style={{ fontSize: '12.5px', color: '#7dd3fc', fontWeight: 700 }}>Varanasi • AKTU Portal</span>
        )}
      </header>

      <main style={{ width: '100%', boxSizing: 'border-box', padding: '20px 24px', display: 'grid', gap: '20px' }}>
        <div style={{ ...box, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '20px', alignItems: 'center' }}>
          <img src={CAMPUS_SRC} alt="Campus" onLoad={() => setCampusOk(true)} onError={() => setCampusOk(false)} style={{ display: campusOk ? 'block' : 'none', width: '100%', height: '210px', objectFit: 'cover', borderRadius: '12px' }} />
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>{COLLEGE.title.toUpperCase()}, {COLLEGE.city.toUpperCase()}</div>
            {COLLEGE.tracks.map((tr) => (
              <div key={tr.name} style={{ background: '#060a13', padding: '12px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.22)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '13.5px', fontWeight: 700 }}><span>{tr.name}</span><span style={{ color: '#7dd3fc' }}>{tr.tag}</span></div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>{tr.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {!loggedIn && (
          <form onSubmit={onAuth} style={box}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Student Login / Registration — {COLLEGE.city}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => { setMode('login'); setAuthErr(''); }} style={mode === 'login' ? btn : btn2}>Login</button>
                <button type="button" onClick={() => { setMode('register'); setAuthErr(''); }} style={mode === 'register' ? btn : btn2}>New Registration</button>
              </div>
            </div>
            {authErr && <div style={{ background: 'rgba(239,68,68,0.16)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '12px' }}>{authErr}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}>
              <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={mode === 'register' ? 'Full Name *' : 'Full Name (optional)'} />
              <input style={inp} value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} placeholder="AKTU Roll No (e.g. 2306410100045) *" />
              <select style={inp} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                <option>B.Tech CSE</option>
                <option>B.Tech CSE (AI &amp; ML)</option>
                <option>B.Tech CSE (Data Science)</option>
                <option>B.Tech ECE</option>
                <option>B.Tech Mechanical</option>
                <option>MBA / BBA</option>
              </select>
              <input style={inp} value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} placeholder={mode === 'register' ? 'CGPA (e.g. 8.2) *' : 'CGPA (e.g. 8.2)'} />
              <input type="password" style={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 4 chars) *" />
            </div>
            <button type="submit" style={{ ...btn, marginTop: '16px', padding: '12px 24px', fontSize: '14px' }}>{mode === 'login' ? 'Login & Open Portal →' : 'Register & Open Portal →'}</button>
          </form>
        )}

        {loggedIn && page === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '18px' }}>
            {COLLEGE.drives.map((d) => {
              const ok = parseFloat(activeUser.cgpa) >= d.minCgpa;
              const applied = myApps.some((a) => a.company === d.company);
              return (
                <div key={d.id} style={{ ...box, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '18px' }}>{d.company}</div>
                    <div style={{ color: (COMP_META[d.company] || COMP_META.Accenture).color, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{d.role}</div>
                    <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginTop: '10px' }}>Branches: {d.branches}</div>
                    <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginTop: '4px' }}>Min CGPA: {d.minCgpa} • {d.skills.join(' • ')}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: ok ? '#34d399' : '#fbbf24' }}>{ok ? 'Eligible' : `Min ${d.minCgpa}`}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => { setCompany(d.company); setPage('interview'); loadQuestion(d.company, 0, true); }} style={btn2}>Mock</button>
                      <button type="button" onClick={() => onApplyDrive(d)} style={{ ...btn, opacity: applied ? 0.65 : 1 }}>{applied ? 'Applied' : 'Apply'}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loggedIn && page === 'resume' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '20px' }}>
            <div style={box}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Resume AI &amp; Enhance</h3>
                <button type="button" onClick={() => { setResumeTxt(SAMPLE_RESUME); setResumeErr(''); setReport(buildResumeReport(SAMPLE_RESUME, role, fileName, activeUser)); }} style={{ ...btn2, padding: '7px 12px', fontSize: '12px' }}>Sample Text</button>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.doc,.docx,.csv" onChange={onFile} style={{ fontSize: '12.5px', marginBottom: '12px', display: 'block' }} />
              {fileName && <div style={{ fontSize: '12px', color: '#7dd3fc', marginBottom: '8px' }}>Uploaded File: {fileName}</div>}
              <select style={{ ...inp, marginBottom: '12px' }} value={role} onChange={(e) => { setRole(e.target.value); if (resumeTxt || fileName) setReport(buildResumeReport(resumeTxt, e.target.value, fileName, activeUser)); }}>
                <option>Associate Software Engineer</option>
                <option>Full-Stack Web Developer</option>
                <option>Data / AI Engineer</option>
                <option>Backend &amp; Cloud Engineer</option>
              </select>
              <textarea rows={7} style={{ ...inp, marginBottom: '12px' }} value={resumeTxt} onChange={(e) => setResumeTxt(e.target.value)} placeholder="Upload resume file or paste skills, education, projects..." />
              {resumeErr && <div style={{ color: '#fde68a', fontSize: '12.5px', marginBottom: '12px' }}>{resumeErr}</div>}
              <button type="button" onClick={onAnalyze} style={{ ...btn, width: '100%', padding: '12px' }}>Analyze &amp; Get Suggestions</button>
            </div>

            <div style={box}>
              <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>Resume Suggestions &amp; Enhanced Output</h3>
              {!report ? (
                <p style={{ color: '#94a3b8', fontSize: '13.5px' }}>Upload a resume file or enter details on the left to get instant suggestions.</p>
              ) : (
                <div style={{ display: 'grid', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#34d399' }}>Score: {report.score} / 100</div>
                  <div><strong>Strengths:</strong> {report.strengths}</div>
                  <div><strong>Suggested Skills to Add:</strong> {(report.missingSkills || []).join(', ')}</div>
                  <div><strong>Enhanced Summary:</strong> {report.enhancedSummary}</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                    {(report.improvedBullets || []).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <button type="button" onClick={() => { setResumeTxt(`${report.enhancedSummary}\n• ${(report.improvedBullets || []).join('\n• ')}`); notify('Applied suggestions to editor'); }} style={btn2}>Apply Suggestions to Editor</button>
                </div>
              )}
            </div>
          </div>
        )}

        {loggedIn && page === 'interview' && (
          <div style={box}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>AI Mock Interviewer • {company}</h3>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Focus: {meta.focus} • Tip: {meta.tip}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setVoiceOn((v) => !v)} style={btn2}>{voiceOn ? 'AI Voice ON' : 'AI Voice OFF'}</button>
                <select style={{ ...inp, width: 'auto' }} value={company} onChange={(e) => { setCompany(e.target.value); loadQuestion(e.target.value, 0, true); }}>
                  <option>Accenture</option>
                  <option>TCS Digital</option>
                  <option>Digio Security</option>
                  <option>Jaro Education</option>
                  <option>Infosys</option>
                  <option>Google</option>
                  <option>Microsoft</option>
                </select>
                <button type="button" onClick={() => loadQuestion(company, 0, true)} style={btn}>Start / Reset</button>
              </div>
            </div>

            <div style={{ minHeight: '250px', maxHeight: '380px', overflowY: 'auto', background: '#050914', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '12px', padding: '14px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {msgs.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '13px' }}>Click &quot;Start / Reset&quot; or pick a company to begin.</div>
              ) : (
                msgs.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.who === 'AI Interviewer' ? 'flex-start' : 'flex-end', maxWidth: '84%', background: m.who === 'AI Interviewer' ? 'rgba(14,165,233,0.18)' : '#1e293b', padding: '11px 14px', borderRadius: '11px', fontSize: '13.5px', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#fbbf24', marginBottom: '3px' }}>{m.who}</div>
                    {m.txt}
                  </div>
                ))
              )}
              {listening && <div style={{ fontSize: '12.5px', color: '#34d399', fontWeight: 600 }}>Listening to your voice... {liveSpeech ? `"${liveSpeech}"` : 'Speak now'}</div>}
            </div>

            <form onSubmit={onAnswer} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={toggleMic} style={{ ...btn2, background: listening ? '#991b1b' : '#1e293b', borderColor: listening ? '#f87171' : 'rgba(148,163,184,0.32)' }}>{listening ? 'Stop Mic' : 'Mic (Speak)'}</button>
              <input style={{ ...inp, flex: '1 1 240px' }} value={ans} onChange={(e) => setAns(e.target.value)} placeholder={`Speak with Mic or type answer for ${company}...`} />
              <button type="submit" style={btn}>Submit</button>
            </form>
          </div>
        )}

        {loggedIn && page === 'tracker' && (
          <div style={box}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>My Applications ({activeUser.name} • {activeUser.rollNo})</h3>
            {myApps.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0 }}>No applications yet. Open Drives and click Apply.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {myApps.map((a) => (
                  <div key={a.id} style={{ background: '#050914', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                    <div><strong>{a.company}</strong> — {a.role} <span style={{ color: '#94a3b8' }}>({a.date})</span></div>
                    <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 700 }}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}