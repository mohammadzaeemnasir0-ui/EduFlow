import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/database.ts";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // --- API Routes ---

  // Auth
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    
    if (user) {
      // In a real app, use JWT. For this demo, we return user info.
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const teacherCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'").get().count;
    const classCount = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
    
    res.json({ studentCount, teacherCount, classCount });
  });

  // Students CRUD
  app.get("/api/students", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, u.full_name, u.username, c.name as class_name 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      LEFT JOIN classes c ON s.class_id = c.id
    `).all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { full_name, username, password, class_id, roll_number, grade_level } = req.body;
    
    const transaction = db.transaction(() => {
      const userResult = db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
        .run(username, password || 'student123', 'student', full_name);
      
      db.prepare('INSERT INTO students (user_id, class_id, roll_number, grade_level) VALUES (?, ?, ?, ?)')
        .run(userResult.lastInsertRowid, class_id, roll_number, grade_level);
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Attendance
  app.get("/api/attendance/:date", (req, res) => {
    const { date } = req.params;
    const attendance = db.prepare(`
      SELECT a.*, u.full_name, s.roll_number 
      FROM attendance a 
      JOIN students s ON a.student_id = s.id 
      JOIN users u ON s.user_id = u.id 
      WHERE a.date = ?
    `).all(date);
    res.json(attendance);
  });

  app.post("/api/attendance", (req, res) => {
    const { student_id, date, status } = req.body;
    db.prepare(`
      INSERT INTO attendance (student_id, date, status) 
      VALUES (?, ?, ?) 
      ON CONFLICT(student_id, date) DO UPDATE SET status = excluded.status
    `).run(student_id, date, status);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
