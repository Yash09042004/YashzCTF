# YashzCTF 🚀 - Fully CLI-Based CTF Platform

**YashzCTF** is a comprehensive **Capture The Flag (CTF) platform** combining a high-performance REST API backend with an interactive CLI client. Designed for security enthusiasts and educational purposes, it provides a gamified experience where players solve progressively difficult challenges, earn points, and compete on the leaderboard.

## 🎮 What is YashzCTF?

YashzCTF is a **fully CLI-based** cybersecurity competition platform where:
- 🔐 **Solve Challenges**: Players progress through 10 levels with increasing difficulty
- 🚩 **Find & Submit Flags**: Extract flags from Docker containers running isolated challenge environments
- 📊 **Track Progress**: Real-time scoring and level progression
- 🏆 **Compete**: Live leaderboard to see where you stand against other players
- 🐳 **Isolated Environments**: Each challenge runs in a separate Docker container for security

### Platform Components

| Component | Type | Purpose |
|-----------|------|---------|
| **Backend** | Go REST API | Handles user auth, flag validation, scoring, leaderboard |
| **CLI Client** | Python Script | Interactive terminal interface for players |
| **Database** | MongoDB Atlas | Persistent storage for users, progress, scores |
| **Challenge Containers** | Docker | Isolated Linux environments with challenge tasks |

## ✨ Features

- ✅ **Fully CLI-Based**: Pure terminal experience - no GUI needed
- ✅ **10 Progressive Challenges**: From beginner to expert level
- ✅ **User Management**: Registration, progress tracking, score calculation
- ✅ **Flag Validation**: Instant feedback on correct/incorrect flags
- ✅ **Real-time Scoring**: Earn points for each solved challenge
- ✅ **Live Leaderboard**: Top 100 players ranked by score
- ✅ **Docker Integration**: Isolated challenge environments
- ✅ **Auto Docker Setup**: Script automatically pulls and manages challenge containers
- ✅ **Session Persistence**: Save progress between sessions
- ✅ **Bash Shell Access**: `play` command drops you into challenge container
- ✅ **CORS & API Support**: Cross-origin requests for future web/mobile clients
- ✅ **Fast & Scalable**: Built with Go for high concurrency

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend API** | Go 1.20+ | REST API server |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database |
| **CLI Client** | Python 3.7+ | Interactive terminal client |
| **Challenge Env** | Docker | Container isolation |
| **Deployment** | Render | Cloud hosting for backend |
| **API Format** | REST JSON | Client-server communication |

## 🎯 How It Works

### Player Journey

```
1. Start Game
   ↓
2. Enter Username (auto-saved)
   ↓
3. Setup Phase (auto-pull Docker challenge containers)
   ↓
4. Enter Interactive Shell for Level 1
   ↓
5. Loop:
   - Solve challenge in Docker container
   - Find flag (hint: `flag{...}`)
   - Submit flag: `submit flag{...}`
   - Correct? → Level up, earn points
   - Incorrect? → Try again
   - Or: `play` to drop into bash shell
   - Or: `restart` to reset progress
   - Or: `exit` to quit level
   ↓
6. Complete All 10 Levels
   ↓
7. See Final Score & Rank on Leaderboard
```

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Player's Machine                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐         ┌──────────────────┐      │
│  │   play.py        │ HTTP    │ Docker Daemon    │      │
│  │  (CLI Client)    │◄────────│ (Containers)     │      │
│  │                  │         │                  │      │
│  │ - User login     │         │ - Challenge 1-10 │      │
│  │ - Level mgmt     │         │ - Shell access   │      │
│  │ - Flag submit    │         │ - Isolated env   │      │
│  └──────────────────┘         └──────────────────┘      │
│           │                                               │
│           │ REST API (HTTP)                              │
│           ▼                                               │
│  ┌─────────────────────────────────────────┐            │
│  │         Render (Cloud)                  │            │
│  │  ┌─────────────────────────────────┐   │            │
│  │  │   Go Backend (main.go)          │   │            │
│  │  │ - /getLevel                     │   │            │
│  │  │ - /checkFlag                    │   │            │
│  │  │ - /resetUser                    │   │            │
│  │  │ - /deleteUser                   │   │            │
│  │  │ - /api/leaderboard              │   │            │
│  │  │ - /api/challenges               │   │            │
│  │  │ - /api/test (health)            │   │            │
│  │  └──────────────┬──────────────────┘   │            │
│  │                 │ Query                 │            │
│  │                 ▼                       │            │
│  │  ┌─────────────────────────────────┐   │            │
│  │  │   MongoDB Atlas                 │   │            │
│  │  │ - Users (username, score, level)│   │            │
│  │  │ - Challenges (flag, points)     │   │            │
│  │  └─────────────────────────────────┘   │            │
│  └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start Guide

### Prerequisites

**On Your Local Machine:**
- Python 3.7+ (for CLI client)
- Docker (installed and running)
- Internet connection
- Linux/macOS or WSL2 on Windows

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/Yash09042004/YashzCTF.git
cd YashzCTF

# 2. Run the CLI client (handles setup automatically)
python3 play.py
```

That's it! The script will:
1. ✅ Check internet connectivity
2. ✅ Verify/install Docker
3. ✅ Auto-download all 10 challenge containers
4. ✅ Prompt for username
5. ✅ Start the interactive game

### Interactive Commands

Once in a level, use these commands:

```bash
ctf-1> submit flag{welcome_to_the_game}  # Submit flag
ctf-1> play                               # Drop into bash shell
ctf-1> restart                            # Reset progress to level 1
ctf-1> exit                               # Quit current level
```

### Example Game Session

```
yash@pc9:~$ python3 play.py
Welcome back, player1!
Welcome, player1! Preparing your game session...

┌──────────────────────────────────────┐
│ Welcome player1, to CTF Level 1       │
└──────────────────────────────────────┘
Submit the flag using 'submit FLAG{...}' below.
Type 'play' to open your Docker shell. Type 'exit' to quit this level session.

ctf-1> ls
flag.txt  challenge.md

ctf-1> cat flag.txt
flag{welcome_to_the_game}

ctf-1> submit flag{welcome_to_the_game}
Correct flag! Level up!

ctf-2> # Now on level 2...
```

## 📚 The 10 Challenges

| # | Difficulty | Flag | Points | Topic |
|---|-----------|------|--------|-------|
| 1 | ⭐ Beginner | `flag{welcome_to_the_game}` | 100 | Intro |
| 2 | ⭐ Beginner | `flag{docker_is_fun}` | 150 | Docker |
| 3 | ⭐⭐ Easy | `flag{sql_mastery_achieved}` | 200 | SQL |
| 4 | ⭐⭐ Easy | `flag{reverse_engineering}` | 250 | Reverse Eng |
| 5 | ⭐⭐⭐ Medium | `flag{crypto_beginner}` | 300 | Cryptography |
| 6 | ⭐⭐⭐ Medium | `flag{forensics_time}` | 350 | Forensics |
| 7 | ⭐⭐⭐⭐ Hard | `flag{pwn_it}` | 400 | Binary Exploit |
| 8 | ⭐⭐⭐⭐ Hard | `flag{web_2_0}` | 450 | Web Security |
| 9 | ⭐⭐⭐⭐⭐ Expert | `flag{network_ninja}` | 500 | Networking |
| 10 | ⭐⭐⭐⭐⭐ Expert | `flag{ctf_mastery}` | 1000 | Advanced |

**Total Points Available: 4350**

## 🔌 API Endpoints (Backend)

The backend REST API is used by the CLI client and can be accessed independently:

### Endpoints

| Method | Path | Description | Input |
|--------|------|-------------|-------|
| `GET` | `/api/test` | Health check | - |
| `GET` | `/getLevel?userId=<user>` | Get current level | Query param |
| `POST` | `/checkFlag` | Submit flag | JSON body |
| `POST` | `/resetUser` | Reset progress | JSON body |
| `POST` | `/deleteUser` | Delete account | JSON body |
| `GET` | `/api/leaderboard` | Top 100 users | - |
| `GET` | `/api/challenges` | All challenges | - |

### Example API Calls

**Get your level:**
```bash
curl "https://api.ctf.com/getLevel?userId=player1"
# {"level":3}
```

**Submit a flag:**
```bash
curl -X POST https://api.ctf.com/checkFlag \
  -H "Content-Type: application/json" \
  -d '{"userId":"player1","flag":"flag{welcome_to_the_game}"}'
# {"correct":true,"newLevel":2}
```

**View leaderboard:**
```bash
curl https://api.ctf.com/api/leaderboard | jq '.'
# [{"username":"player1","score":450,"solvedLevels":[1,2,3,4]}, ...]
```

## Repository Structure

```
YashzCTF/
├── main.go              # Go backend server
├── go.mod               # Go module definition
├── go.sum               # Go dependencies (auto-generated)
├── .gitignore           # Git ignore patterns
├── README.md            # This file
├── DEPLOYMENT_GUIDE.md  # Detailed deployment steps
└── play.py              # Client CLI (separate project)
```

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/ctf_db?retryWrites=true&w=majority` |
| `PORT` | ❌ No | `10000` (default) |

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas Network Access allows your IP
- Ensure connection string includes `/ctf_db` database name

### Port Already in Use
```bash
# Find process using port 10000
lsof -i :10000

# Kill process
kill -9 <PID>
```

### Build Fails
```bash
# Clean and rebuild
go clean -testcache
go mod tidy
go build -o ctf-backend .
```

## Contributing

To contribute:
1. Clone repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

## License

MIT License - Feel free to use this for educational purposes

## Support

For issues or questions:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review Render logs on dashboard
- Check MongoDB Atlas connection status
- Open an issue on GitHub

---

**Status**: ✅ Ready for production deployment on Render
