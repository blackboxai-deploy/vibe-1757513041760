// Distinctive Academy Student Management Types

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  enrollmentDate: Date;
  program: 'Esthetician' | 'Advanced Esthetician' | 'Manicurist' | 'Eyelash Technician' | 'Esthetician + Manicurist';
  status: 'active' | 'graduated' | 'suspended' | 'withdrawn';
  totalHoursRequired: number;
  hoursCompleted: number;
  gpa: number;
  tuitionPaid: number;
  tuitionTotal: number;
  profileImage?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  clockIn: Date;
  clockOut?: Date;
  hoursWorked: number;
  location: 'main-campus' | 'lab-1' | 'lab-2';
  notes?: string;
  approved: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  assessmentType: 'practical' | 'written' | 'final';
  assessmentName: string;
  score: number;
  maxScore: number;
  dateGraded: Date;
  instructor: string;
  comments?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: Date;
}