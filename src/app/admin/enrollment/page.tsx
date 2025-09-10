'use client';

import { useState } from 'react';
import { Database, DISTINCTIVE_PROGRAMS } from '@/lib/database';

export default function EnrollmentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: 'Houston',
      state: 'TX',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    program: '' as any,
    totalHoursRequired: 750,
    tuitionTotal: 7000
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleProgramChange = (programName: string) => {
    const program = DISTINCTIVE_PROGRAMS.find(p => p.name === programName);
    if (program) {
      setFormData(prev => ({
        ...prev,
        program: programName as any,
        totalHoursRequired: program.hours,
        tuitionTotal: program.price
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.program) {
        throw new Error('Please fill in all required fields');
      }

      const students = Database.getStudents();
      const newStudent = {
        id: `student-${Date.now()}`,
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
        enrollmentDate: new Date(),
        status: 'active' as const,
        hoursCompleted: 0,
        gpa: 0,
        tuitionPaid: 0
      };

      const updatedStudents = [...students, newStudent];
      Database.saveStudents(updatedStudents);
      
      setMessage({
        type: 'success',
        text: `🎉 ${newStudent.firstName} ${newStudent.lastName} successfully enrolled in ${newStudent.program}!`
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: { street: '', city: 'Houston', state: 'TX', zipCode: '' },
        emergencyContact: { name: '', phone: '', relationship: '' },
        program: '' as any,
        totalHoursRequired: 750,
        tuitionTotal: 7000
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Enrollment failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-6 border border-purple-200 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Enrollment</h1>
                <p className="text-gray-600">Register new students at Distinctive Academy</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Enrollment Form */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 border border-purple-200 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-purple-200 pb-2">
                👤 Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                  <input
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                  <input
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(713) 555-0123"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Program Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-purple-200 pb-2">
                🎓 Program Selection
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Program *</label>
                  <select
                    value={formData.program}
                    onChange={(e) => handleProgramChange(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a program</option>
                    {DISTINCTIVE_PROGRAMS.map(program => (
                      <option key={program.name} value={program.name}>
                        {program.name} - {program.hours} hours (${program.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                
                {formData.program && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Program Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Hours Required:</span>
                        <div className="text-purple-700 font-bold">{formData.totalHoursRequired}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total Tuition:</span>
                        <div className="text-purple-700 font-bold">${formData.tuitionTotal.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Includes:</span>
                        <div className="text-purple-700">Starter Kit + Online Access</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-purple-200 pb-2">
                🚨 Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Name</label>
                  <input
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
                  <input
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Relationship</label>
                  <input
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                    }))}
                    placeholder="Parent, Spouse, etc."
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-purple-200 pb-2">
                🏠 Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                  <input
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">City</label>
                  <input
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                  <input
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, zipCode: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-purple-200">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? '✏️ Enrolling Student...' : '🎓 Enroll Student at Distinctive Academy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}