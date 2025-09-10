import { Student, User, AttendanceRecord, Grade } from './types';

// Distinctive Academy Programs with exact pricing
export const DISTINCTIVE_PROGRAMS = [
  { name: 'Esthetician', hours: 750, price: 7000, description: 'Comprehensive skin care training' },
  { name: 'Advanced Esthetician', hours: 750, price: 8770, description: 'Advanced techniques and medical esthetics' },
  { name: 'Manicurist', hours: 600, price: 6150, description: 'Complete nail technology training' },
  { name: 'Eyelash Technician', hours: 320, price: 3900, description: 'Specialized eyelash extension training' },
  { name: 'Esthetician + Manicurist', hours: 1350, price: 9550, description: 'Dual certification program' }
];

// Storage keys
const STORAGE_KEYS = {
  USERS: 'distinctive_users',
  STUDENTS: 'distinctive_students', 
  ATTENDANCE: 'distinctive_attendance',
  GRADES: 'distinctive_grades',
  CURRENT_USER: 'distinctive_current_user'
};

export class Database {
  static DISTINCTIVE_PROGRAMS = DISTINCTIVE_PROGRAMS;
  // User Management
  static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : this.getDefaultUsers();
  }

  static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Student Management
  static getStudents(): Student[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : this.getDefaultStudents();
  }

  static saveStudents(students: Student[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  // Attendance Management
  static getAttendanceRecords(): AttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  }

  static saveAttendanceRecords(records: AttendanceRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }

  // Grade Management
  static getGrades(): Grade[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : this.getDefaultGrades();
  }

  static saveGrades(grades: Grade[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }

  // Default data for demo
  static getDefaultUsers(): User[] {
    const users = [
      {
        id: 'admin-1',
        email: 'admin@distinctiveacademy.com',
        name: 'Distinctive Academy Admin',
        role: 'admin' as const,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'student-1',
        email: 'maria.gonzalez@email.com',
        name: 'Maria Gonzalez',
        role: 'student' as const,
        createdAt: new Date('2024-02-15')
      }
    ];
    this.saveUsers(users);
    return users;
  }

  static getDefaultStudents(): Student[] {
    const students = [
      {
        id: 'student-1',
        firstName: 'Maria',
        lastName: 'Gonzalez',
        email: 'maria.gonzalez@email.com',
        phone: '(713) 555-0123',
        dateOfBirth: new Date('1995-03-15'),
        address: {
          street: '123 Houston St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77068'
        },
        emergencyContact: {
          name: 'Carlos Gonzalez',
          phone: '(713) 555-0124',
          relationship: 'Husband'
        },
        enrollmentDate: new Date('2024-02-15'),
        program: 'Esthetician' as const,
        status: 'active' as const,
        totalHoursRequired: 750,
        hoursCompleted: 320,
        gpa: 3.7,
        tuitionPaid: 3500,
        tuitionTotal: 7000
      },
      {
        id: 'student-2',
        firstName: 'Ashley',
        lastName: 'Johnson',
        email: 'ashley.johnson@email.com',
        phone: '(832) 555-0198',
        dateOfBirth: new Date('1998-07-22'),
        address: {
          street: '456 Cypress Ave',
          city: 'Houston',
          state: 'TX',
          zipCode: '77068'
        },
        emergencyContact: {
          name: 'Linda Johnson',
          phone: '(832) 555-0199',
          relationship: 'Mother'
        },
        enrollmentDate: new Date('2024-01-10'),
        program: 'Advanced Esthetician' as const,
        status: 'active' as const,
        totalHoursRequired: 750,
        hoursCompleted: 580,
        gpa: 3.9,
        tuitionPaid: 8770,
        tuitionTotal: 8770
      }
    ];
    this.saveStudents(students);
    return students;
  }

  static getDefaultGrades(): Grade[] {
    return [
      {
        id: 'grade-1',
        studentId: 'student-1',
        subject: 'Facial Treatments',
        assessmentType: 'practical',
        assessmentName: 'Basic Facial Techniques',
        score: 88,
        maxScore: 100,
        dateGraded: new Date('2024-11-01'),
        instructor: 'Ms. Rodriguez',
        comments: 'Excellent technique, needs practice on timing'
      },
      {
        id: 'grade-2',
        studentId: 'student-2',
        subject: 'Advanced Skin Analysis',
        assessmentType: 'written',
        assessmentName: 'Skin Disorders Exam',
        score: 94,
        maxScore: 100,
        dateGraded: new Date('2024-10-28'),
        instructor: 'Dr. Martinez',
        comments: 'Outstanding knowledge of skin conditions'
      }
    ];
  }
}