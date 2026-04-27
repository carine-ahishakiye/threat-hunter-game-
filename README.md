# Threat Hunter

A cybersecurity training game where you classify real-world attacks and pick the correct incident response built with React and Vite.

**Live:** https://threat-hunter-game.vercel.app

---

## What it does

You get a threat card showing an attack type, fake but realistic data (IPs, processes, log entries), and four response options. One is correct. A timer counts down. Pick fast and pick right.

After each answer it tells you why that response is correct — so you actually learn something.

---

## Difficulty modes

| Mode | Session | Per question | Lives |
|------|---------|-------------|-------|
| Rookie | 90s | 20s | 5 |
| Operator | 60s | 13s | 3 |
| Phantom | 45s | 8s | 2 |

---

## Scoring

- 100 points per correct answer
- Speed bonus added on top (faster = more)
- 3 correct in a row → 1.5× multiplier
- 5 correct in a row → 2× multiplier
- Wrong answer or timeout → lose a life, streak resets

---

## Threats covered

SQL Injection, Ransomware C2, Executive Phishing, Stealth Port Scan, Brute Force, Lateral Movement, Zero-Day Exploit, Insider Threat, DNS Hijack, Supply Chain Attack, DDoS UDP Flood, Credential Stuffing, ARP Spoofing, Cryptojacking, Kerberoasting.

---

## Stack

- React 18
- Vite 5
- CSS Modules
- Deployed on Vercel

---

## Run locally

```bash
git clone https://github.com/carine-ahishakiye/threat-hunter-game-.git
cd threat-hunter-game-
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Project layout

```
src/
  threats.js        # all 15 scenarios + difficulty config
  useGameState.js   # game logic
  App.jsx           # screen routing
  HUD.jsx           # score / timer / lives
  ThreatCard.jsx    # threat display + answer buttons
  Sidebar.jsx       # streak, accuracy, event log
  StartScreen.jsx
  GameOver.jsx
```

---