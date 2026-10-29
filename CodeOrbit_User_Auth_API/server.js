// Task 2: Simple signup/login API.
// Passwords are hashed with bcryptjs; plaintext passwords are never saved.
const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, "data", "users.json");
app.use(express.json());

function readUsers() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
}
function saveUsers(users) { fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2)); }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }; }
function validEmail(email) { return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

app.get("/", (_req, res) => res.json({
  message: "CodeOrbit User Auth API is running",
  endpoints: ["POST /api/auth/signup", "POST /api/auth/login"]
}));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Name must contain at least 2 characters" });
    }
    if (!validEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: users.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name: name.trim(), email: normalizedEmail, passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    res.status(201).json({ success: true, message: "Account created successfully", user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!validEmail(email) || typeof password !== "string" || password.length === 0) {
      return res.status(400).json({ success: false, message: "A valid email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = readUsers().find((item) => item.email === normalizedEmail);
    // Use the same error for unknown emails and wrong passwords.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    res.json({ success: true, message: "Login successful", user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ success: false, message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

if (require.main === module) app.listen(PORT, () => console.log(`Auth API running at http://localhost:${PORT}`));
module.exports = app;
