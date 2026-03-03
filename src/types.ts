export interface User {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  full_name: string;
}

export interface Student {
  id: number;
  user_id: number;
  class_id: number;
  roll_number: string;
  grade_level: string;
  full_name: string;
  username: string;
  class_name?: string;
}

export interface DashboardStats {
  studentCount: number;
  teacherCount: number;
  classCount: number;
}
