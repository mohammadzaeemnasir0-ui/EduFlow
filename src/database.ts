import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('school.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'teacher', 'student')) NOT NULL,
    full_name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teacher_id INTEGER,
    FOREIGN KEY(teacher_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    class_id INTEGER,
    roll_number TEXT UNIQUE,
    grade_level TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(class_id) REFERENCES classes(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT NOT NULL,
    status TEXT CHECK(status IN ('present', 'absent', 'late')) NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );
`);

// Seed initial admin if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
    .run('admin', 'admin123', 'admin', 'System Administrator');
  
  // Seed a teacher
  const teacherResult = db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
    .run('teacher1', 'teacher123', 'teacher', 'Sarah Johnson');
  
  // Seed a class
  const classResult = db.prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)')
    .run('Grade 10 - Science', teacherResult.lastInsertRowid);
  
  // Seed some students
  const studentsToSeed = [
    { name: 'John Doe', roll: 'S1001', grade: '10th' },
    { name: 'Jane Smith', roll: 'S1002', grade: '10th' },
    { name: 'Michael Brown', roll: 'S1003', grade: '10th' }
  ];

  studentsToSeed.forEach(s => {
    const userResult = db.prepare('INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)')
      .run(s.roll.toLowerCase(), 'student123', 'student', s.name);
    
    db.prepare('INSERT INTO students (user_id, class_id, roll_number, grade_level) VALUES (?, ?, ?, ?)')
      .run(userResult.lastInsertRowid, classResult.lastInsertRowid, s.roll, s.grade);
  });
}

export default db;
