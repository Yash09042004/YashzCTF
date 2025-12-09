# 🟣 YashzCTF — CLI CTF (Purple Hacker Theme)

```
   __   __            _     _   _  _____ _____ _______ 
   \ \ / /           | |   | \ | |/ ____|_   _|__   __|
    \ V /___  _   _  | |   |  \| | |      | |    | |   
     \ // _ \| | | | | |   | . ` | |      | |    | |   
     | | (_) | |_| | | |___| |\  | |____ _| |_   | |   
     \_/\___/ \__,_| |_____|_| \_|\_____|_____|  |_|   

                A fully CLI-based Capture The Flag
```

💜 Welcome to **YashzCTF** — a compact, terminal-first CTF platform built for learning and competitions. Solve challenges inside isolated Docker containers, submit flags from your terminal and climb the leaderboard.

---

## ✨ Core Concept

- Fully CLI driven experience — no web UI required.
- Each challenge runs in its own Docker container for isolation and reproducibility.
- Lightweight Go backend provides user state, flag validation and leaderboard.
- Python CLI (`play.py`) manages setup, pulls challenge containers, and provides an interactive shell per level.

---

## 🔧 Features

- 🧩 10 progressive challenges (intro → expert)
- 🐳 Auto-pull & manage Docker challenge containers
- 🚩 Submit flags from the terminal (`submit flag{...}`)
- 🏆 Live leaderboard (top users & scores)
- 🔒 Isolated environments per level (Docker)
- 💾 Persistent progress stored in MongoDB

---

## 🧭 How it works (brief)

1. CLI prompts for username and saves it locally.
2. CLI pulls Docker images for each level (one-time setup).
3. Player selects a level and can `play` (open shell) or `submit` a flag.
4. Backend validates flags, updates score and progression.
5. Use `leaderboard` in-game to view the top players.

---

## ▶️ Quick Local Run (client)

Requirements: Python 3.7+, Docker (running), network access.

Run the CLI client:

```bash
git clone https://github.com/Yash09042004/YashzCTF.git
cd YashzCTF
python3 play.py
```

The CLI will guide you through setup (pull Docker images) and gameplay.

---

## ⚙️ Tech Stack

- Backend: Go (single binary)
- Database: MongoDB (Atlas or local)
- Client: Python 3 CLI (`play.py`)
- Containers: Docker images for each challenge

---

## 🧾 Challenges (summary)

| # | Difficulty | Points |
|---:|:----------:|:------:|
| 1  | ⭐ Beginner | 100 |
| 2  | ⭐ Beginner | 150 |
| 3  | ⭐⭐ Easy   | 200 |
| 4  | ⭐⭐ Easy   | 250 |
| 5  | ⭐⭐⭐ Medium | 300 |
| 6  | ⭐⭐⭐ Medium | 350 |
| 7  | ⭐⭐⭐⭐ Hard | 400 |
| 8  | ⭐⭐⭐⭐ Hard | 450 |
| 9  | ⭐⭐⭐⭐⭐ Expert | 500 |
| 10 | ⭐⭐⭐⭐⭐ Expert | 1000 |

Total: 4350 points

---

## 🔐 Environment (important)

The backend reads its MongoDB connection from an environment variable:

- `MONGODB_URI` — set this to your MongoDB Atlas or local URI when running the backend locally.

(Do NOT commit secrets to the repo.)

---

## 👩‍💻 Contributing

- Fork, create a feature branch, and open a Pull Request.
- Keep secrets out of commits. Use env vars for credentials.

---

## 📝 License

MIT — free for educational and non-commercial use.

---

Enjoy — and hack responsibly 💜
