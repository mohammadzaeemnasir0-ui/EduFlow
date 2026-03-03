import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  MoreVertical,
  GraduationCap,
  UserCheck,
  BookOpen,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Student, DashboardStats } from './types';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  user: User,
  onLogout: () => void
}) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'teacher', 'student'] },
    { id: 'students', icon: Users, label: 'Students', roles: ['admin', 'teacher'] },
    { id: 'attendance', icon: CalendarCheck, label: 'Attendance', roles: ['admin', 'teacher'] },
    { id: 'classes', icon: BookOpen, label: 'Classes', roles: ['admin'] },
    { id: 'settings', icon: Settings, label: 'Settings', roles: ['admin', 'teacher', 'student'] },
  ];

  return (
    <div className="w-64 h-screen bg-brand-navy text-white flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/40">
          <GraduationCap className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">EduFlow</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full sidebar-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
            {user.full_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.full_name}</p>
            <p className="text-xs text-white/50 capitalize">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number | string, color: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex items-center gap-5"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={28} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-brand-navy">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = ({ stats }: { stats: DashboardStats | null }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome back to your school management portal.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 glass-card hover:bg-white transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-brand-blue text-white rounded-xl font-medium shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Students" value={stats?.studentCount || 0} color="bg-blue-500" />
        <StatCard icon={UserCheck} label="Active Teachers" value={stats?.teacherCount || 0} color="bg-emerald-500" />
        <StatCard icon={BookOpen} label="Total Classes" value={stats?.classCount || 0} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-2 h-2 rounded-full bg-brand-blue" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New student registered: John Doe</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 border-l-4 border-brand-blue bg-blue-50/50 rounded-r-xl">
                <div>
                  <p className="text-sm font-bold">Parent-Teacher Meeting</p>
                  <p className="text-xs text-gray-500">March 15, 2024 • 10:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsList = ({ students, onAdd }: { students: Student[], onAdd: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-navy">Student Management</h2>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-medium shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll number..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Roll Number</th>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Grade</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {student.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.roll_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.class_name || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.grade_level}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center shadow-xl shadow-brand-blue/30 mx-auto mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-navy">EduFlow</h1>
          <p className="text-gray-500">Sign in to manage your school</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400">Demo: admin / admin123</p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session (simplified)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchStudents();
    }
  }, [user]);

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setStats(data);
  };

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(data);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return null;

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 ml-64 p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'students' && (
              <StudentsList 
                students={students} 
                onAdd={() => alert('Add student modal would open here')} 
              />
            )}
            {activeTab === 'attendance' && (
              <div className="glass-card p-10 text-center">
                <CalendarCheck size={48} className="mx-auto text-brand-blue mb-4" />
                <h2 className="text-2xl font-bold">Attendance Tracking</h2>
                <p className="text-gray-500">Feature coming soon in the next update.</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="glass-card p-10 text-center">
                <Settings size={48} className="mx-auto text-brand-blue mb-4" />
                <h2 className="text-2xl font-bold">Account Settings</h2>
                <p className="text-gray-500">Manage your profile and preferences.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
