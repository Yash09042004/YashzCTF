const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ctf_db';

// Simple in-code challenge list (can be extended or loaded from config)
const challenges = [
  { level: 1, flag: 'flag{welcome_to_the_game}', points: 100 },
  { level: 2, flag: 'flag{docker_is_fun}', points: 150 },
  { level: 3, flag: 'flag{sql_mastery_achieved}', points: 200 },
  { level: 4, flag: 'flag{reverse_engineering}', points: 250 },
  { level: 5, flag: 'flag{crypto_beginner}', points: 300 },
  { level: 6, flag: 'flag{forensics_time}', points: 350 },
  { level: 7, flag: 'flag{pwn_it}', points: 400 },
  { level: 8, flag: 'flag{web_2_0}', points: 450 },
  { level: 9, flag: 'flag{network_ninja}', points: 500 },
  { level: 10, flag: 'flag{ctf_mastery}', points: 1000 },
];

// Mongoose models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  score: { type: Number, default: 0 },
  solvedLevels: { type: [Number], default: [] },
});

const User = mongoose.model('User', userSchema);

async function connectDb() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

function getCurrentLevelForUser(user) {
  if (!user || !user.solvedLevels || user.solvedLevels.length === 0) return 1;
  const maxSolved = Math.max(...user.solvedLevels);
  return maxSolved + 1;
}

app.get('/api/test', (_req, res) => {
  res.send('CTF API is up and running!');
});

app.get('/getLevel', async (req, res) => {
  const username = req.query.userId;
  if (!username) return res.status(400).json({ error: 'userId is required' });

  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username });
    await user.save();
  }

  const level = getCurrentLevelForUser(user);
  return res.json({ level });
});

app.post('/checkFlag', async (req, res) => {
  const { flag, userId } = req.body;
  if (!userId || !flag) return res.status(400).json({ error: 'userId and flag are required' });

  const user = await User.findOne({ username: userId });
  if (!user) {
    // create user if not exists
    const newUser = new User({ username: userId });
    await newUser.save();
  }

  // Find challenge by flag
  const challenge = challenges.find((c) => c.flag === flag);
  const currentUser = await User.findOne({ username: userId });
  const currentLevel = getCurrentLevelForUser(currentUser);

  if (!challenge) {
    return res.json({ correct: false, newLevel: currentLevel });
  }

  const levelNum = challenge.level;
  if (currentUser.solvedLevels.includes(levelNum)) {
    // Already solved
    return res.json({ correct: true, newLevel: getCurrentLevelForUser(currentUser) });
  }

  // Mark solved
  currentUser.solvedLevels.push(levelNum);
  currentUser.score = (currentUser.score || 0) + (challenge.points || 0);
  await currentUser.save();

  return res.json({ correct: true, newLevel: getCurrentLevelForUser(currentUser) });
});

app.post('/resetUser', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const user = await User.findOne({ username: userId });
  if (!user) return res.status(404).json({ error: 'user not found' });

  user.score = 0;
  user.solvedLevels = [];
  await user.save();

  return res.json({ success: true });
});

app.post('/deleteUser', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const result = await User.deleteOne({ username: userId });
  return res.json({ deleted: result.deletedCount > 0 });
});

// Optional endpoints for leaderboard and challenges
app.get('/api/leaderboard', async (_req, res) => {
  const users = await User.find().sort({ score: -1 }).limit(100).select('-__v');
  res.json(users);
});

app.get('/api/challenges', (_req, res) => {
  res.json(challenges.map(({ level, points }) => ({ level, points })));
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
