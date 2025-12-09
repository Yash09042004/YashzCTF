Backend implemented in Go. How to run locally:

1. Set env: MONGODB_URI (your Atlas string) and PORT (optional, default 10000)
2. go run main.go

Routes implemented (matching play.py expectations):
- GET /api/test
- GET /getLevel?userId=...
- POST /checkFlag { userId, flag }
- POST /resetUser { userId }
- POST /deleteUser { userId }
- GET /api/leaderboard
- GET /api/challenges

Remember to set MONGODB_URI to your Atlas connection string on Render.
