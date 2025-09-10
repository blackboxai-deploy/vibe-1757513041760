'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/lib/database';

export default function KioskPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setStudents(Database.getStudents());
    setAttendanceRecords(Database.getAttendanceRecords());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredStudents = searchTerm 
    ? students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : students.slice(0, 6);

  const isStudentClockedIn = (studentId: string) => {
    return attendanceRecords.some(record => 
      record.studentId === studentId && record.clockIn && !record.clockOut
    );
  };

  const handleClockAction = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    try {
      const isClockedIn = isStudentClockedIn(studentId);
      
      if (isClockedIn) {
        // Clock out
        const activeRecord = attendanceRecords.find(record => 
          record.studentId === studentId && !record.clockOut
        );
        
        if (activeRecord) {
          const clockOutTime = new Date();
          const hoursWorked = (clockOutTime.getTime() - new Date(activeRecord.clockIn).getTime()) / (1000 * 60 * 60);
          
          const updatedRecord = {
            ...activeRecord,
            clockOut: clockOutTime,
            hoursWorked: Math.round(hoursWorked * 100) / 100
          };

          const updatedRecords = attendanceRecords.map(record =>
            record.id === activeRecord.id ? updatedRecord : record
          );

          // Update student's total hours
          const updatedStudents = students.map(s => {
            if (s.id === studentId) {
              return { ...s, hoursCompleted: s.hoursCompleted + updatedRecord.hoursWorked };
            }
            return s;
          });

          Database.saveAttendanceRecords(updatedRecords);
          Database.saveStudents(updatedStudents);
          setAttendanceRecords(updatedRecords);
          setStudents(updatedStudents);

          setMessage({
            type: 'success',
            text: `✅ ${student.firstName} ${student.lastName} clocked out! Session: ${updatedRecord.hoursWorked.toFixed(2)} hours`
          });
        }
      } else {
        // Clock in
        const newRecord = {
          id: `attendance-${Date.now()}`,
          studentId,
          clockIn: new Date(),
          hoursWorked: 0,
          location: 'main-campus' as const,
          approved: true
        };

        const updatedRecords = [...attendanceRecords, newRecord];
        Database.saveAttendanceRecords(updatedRecords);
        setAttendanceRecords(updatedRecords);

        setMessage({
          type: 'success',
          text: `✅ ${student.firstName} ${student.lastName} clocked in successfully!`
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        setSearchTerm('');
      }, 3000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error processing clock action. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-purple-600 font-bold text-3xl">DA</span>
            </div>
            <div className="text-white">
              <h1 className="text-4xl font-bold">Distinctive Academy</h1>
              <p className="text-xl opacity-90">Student Clock In/Out Kiosk</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 inline-block border border-white/30">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xl">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-8 p-6 rounded-2xl text-center text-2xl font-bold ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {message.text}
          </div>
        )}

        {/* Student Search and Clock Actions */}
        {!message && (
          <>
            {/* Search */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-8 mb-8 border border-white/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Find Your Name</h2>
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-2xl p-6 text-center border-2 border-purple-300 focus:border-purple-500 rounded-xl outline-none"
                autoFocus
              />
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => {
                const isClockedIn = isStudentClockedIn(student.id);
                
                return (
                  <div 
                    key={student.id}
                    onClick={() => handleClockAction(student.id)}
                    className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 border border-white/50"
                  >
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 ${
                        isClockedIn ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {student.firstName} {student.lastName}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">{student.program}</p>

                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                        isClockedIn 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
                      </div>

                      <button 
                        className={`w-full text-white font-bold py-4 text-xl rounded-xl transition-all ${
                          isClockedIn 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {searchTerm && filteredStudents.length === 0 && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-8 text-center border border-white/50 shadow-xl">
                <div className="text-gray-600 text-2xl mb-4">
                  No students found matching "{searchTerm}"
                </div>
                <p className="text-gray-500 text-lg">
                  Try searching with a different name or student ID
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30 px-8 py-4 text-xl rounded-xl font-semibold transition-all"
          >
            Return to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}