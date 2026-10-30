# 🛡️ Nemotron Code Sentinel

**Autonomous AI Code Review & Security Agent powered by NVIDIA Nemotron**

> An agentic developer assistant that inspects codebases, identifies security vulnerabilities and bugs, generates self-healing patches, and writes automated unit test suites — all powered by NVIDIA Nemotron's advanced chain-of-thought reasoning engine.

Built for the **Nebius x NVIDIA Global AI Hackathon** | Track: **Coding and Agentic Engineering**

---

## ✨ Features

| Mode | What It Does |
|------|-------------|
| 🔍 **Code Audit** | Deep quality analysis: naming, complexity, logic bugs, DRY violations, performance bottlenecks |
| 🛡️ **Security Scan** | OWASP Top 10 & CWE vulnerability detection with severity ratings and attack vectors |
| 🔧 **Auto-Patch** | Self-healing bug fixer — generates complete patched code with `// FIXED:` annotations |
| 🧪 **Test Generator** | Comprehensive unit test suite with happy paths, edge cases, and error handling |

### 🧠 Unique: Transparent Reasoning Traces

Unlike black-box code reviewers, Nemotron Code Sentinel exposes the model's **full chain-of-thought reasoning process**. You can see exactly *how* the AI diagnoses issues step-by-step before delivering its final report — making it a powerful learning and debugging tool.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Browser (UI)                        │
│  Code Editor ─→ Mode Selection ─→ Analysis Report   │
│                 + Reasoning Trace Viewer             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP POST /api/analyze
┌──────────────────────┴──────────────────────────────┐
│              Express.js Backend                      │
│  ┌────────────┐  ┌──────────┐  ┌────────────────┐   │
│  │ Prompt     │→ │ Nemotron │→ │ Markdown       │   │
│  │ Engineering│  │ API      │  │ Report Builder │   │
│  └────────────┘  └──────────┘  └────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│    NVIDIA Nemotron 3.5 Lightning (Reasoning Model)   │
│    via NVIDIA NIM / Nebius Token Factory              │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- An **NVIDIA API key** from [build.nvidia.com](https://build.nvidia.com) (free, no credit card required)

### 1. Clone & Install

```bash
git clone https://github.com/bc2ykys/nemotron-code-sentinel.git
cd nemotron-code-sentinel
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and paste your API key:

```env
LLM_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=nvapi-your-key-here
LLM_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

**For Nebius Token Factory deployment:**
```env
LLM_BASE_URL=https://api.tokenfactory.nebius.com/v1/
LLM_API_KEY=your-nebius-key-here
LLM_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

### 3. Run

```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## 🎮 How to Use

1. **Paste code** into the editor (or click an example: SQL Injection, Broken Auth, Buggy Logic).
2. **Select a mode**: Audit, Security, Patch, or Tests.
3. **Click Analyze** — Nemotron performs deep reasoning and returns a structured markdown report.
4. **Expand the Reasoning Trace** to see the full chain-of-thought process.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **AI Model** | NVIDIA Nemotron 3.5 Lightning 30B (Reasoning) |
| **Inference** | NVIDIA NIM / Nebius Token Factory (OpenAI-compatible) |
| **Backend** | Node.js + Express.js |
| **Frontend** | Vanilla HTML/CSS/JS + Marked.js + Highlight.js |
| **API Format** | OpenAI Chat Completions API |

---

## 📁 Project Structure

```
nemotron-code-sentinel/
├── server.js              # Express backend server
├── agent/
│   ├── client.js          # Unified NVIDIA/Nebius API client
│   ├── prompts.js         # Specialized prompt templates
│   └── analyzer.js        # Analysis orchestrator
├── public/
│   └── index.html         # Full frontend application
├── examples/              # Sample vulnerable/buggy code for demos
│   ├── demo_security.py       # SQL injection, command injection, path traversal, weak hashing
│   ├── demo_patch.py          # 9 logic bugs across functions & classes
│   ├── demo_tests.py          # Clean BankAccount class for test generation
│   ├── demo_audit.py          # O(n²) performance, dead code, memory leaks
│   ├── vulnerable_sql.py      # Classic SQL injection + plaintext passwords
│   └── buggy_auth_flow.js     # Hardcoded JWT secret, broken auth
├── .env.example           # Environment template
├── .gitignore
├── LICENSE                # MIT License
├── package.json
└── README.md
```

---

## 🏆 Hackathon Information

- **Event:** [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/)
- **Track:** Coding and Agentic Engineering
- **Model:** NVIDIA Nemotron 3.5 Lightning (open-source, via Nebius Token Factory / NVIDIA NIM)
- **Built During:** October 2026

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
