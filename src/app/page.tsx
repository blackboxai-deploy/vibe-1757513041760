'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/lib/database';

export default function HomePage() {
  const { user, login, logout, isLoading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setStudents(Database.getStudents());
      setAttendanceRecords(Database.getAttendanceRecords());
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(loginForm.email, loginForm.password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">DA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Distinctive Academy</h1>
            <p className="text-gray-600">School Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Sign In to School System
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Demo Login:</h4>
            <div className="text-sm text-gray-600">
              <div><strong>Email:</strong> admin@distinctiveacademy.com</div>
              <div><strong>Password:</strong> admin123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  const activeStudents = students.filter(s => s.status === 'active');
  const totalHoursLogged = attendanceRecords.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
  const currentlyOnCampus = attendanceRecords.filter(record => record.clockIn && !record.clockOut).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">DA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Distinctive Academy</h1>
                <p className="text-sm text-gray-600">School Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-600">{students.length}</h3>
                <p className="text-gray-600">Total Students</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">{activeStudents.length}</h3>
                <p className="text-gray-600">Active Students</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-purple-600">{currentlyOnCampus}</h3>
                <p className="text-gray-600">On Campus Now</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🏫</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-pink-600">{totalHoursLogged.toFixed(0)}</h3>
                <p className="text-gray-600">Total Hours</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/admin/enrollment'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>📝</span>
                <span>Enroll New Student</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/students'}
                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>👥</span>
                <span>Manage Students</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/kiosk'}
                className="w-full bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>⏰</span>
                <span>Open Kiosk (Clock In/Out)</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/reports'}
                className="w-full bg-orange-600 text-white p-4 rounded-lg font-semibold hover:bg-orange-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>📊</span>
                <span>View Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Students</h2>
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {student.hoursCompleted}/{student.totalHoursRequired}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {((student.hoursCompleted / student.totalHoursRequired) * 100).toFixed(0)}% Complete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Overview */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distinctive Academy Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Database.DISTINCTIVE_PROGRAMS.map((program) => (
              <div key={program.name} className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-2">{program.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{program.hours} hours</div>
                  <div>${program.price.toLocaleString()}</div>
                  <div className="text-xs">{program.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}