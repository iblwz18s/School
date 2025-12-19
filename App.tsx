import React, { useState, useEffect, useRef } from 'react';
import { read, utils } from 'xlsx';
import { STUDENTS_DATA, VIOLATION_RULES, POSITIVE_RULES } from './data';
import { supabase } from './supabase';
import { Student, StudentRecord, ViolationRule, ViolationLevel, PositiveRule } from './types';
import {
  Users,
  Search,
  UserMinus,
  UserPlus,
  History,
  LogOut,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Gavel,
  ClipboardList,
  X,

  Award,
  Lock,
  UserCheck,
  Star,
  TrendingUp,
  Baby,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  Upload,
  FileSpreadsheet,
  CheckSquare,
  Edit3,
  Siren,
  Printer,
  Share2,
  MessageCircle,
  FileText,
  Moon,
  Sun
} from 'lucide-react';

// --- Theme Toggle Component ---
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 left-6 p-4 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-300 shadow-xl z-50 transition-all hover:scale-110 border border-gray-200 dark:border-gray-600 no-print"
      title={isDark ? "إيقاف الوضع الليلي" : "تشغيل الوضع الليلي"}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

// --- Login Component ---
const Login = ({
  onLogin,
  students
}: {
  onLogin: (type: 'admin' | 'parent', studentId?: string) => void;
  students: Student[];
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'parent'>('admin');

  // Admin State
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Parent State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [parentPass, setParentPass] = useState('');
  const [parentError, setParentError] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const filteredStudents = students.filter(s => s.name.includes(studentSearch));

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '2030') {
      onLogin('admin');
    } else {
      setAdminError('رمز الدخول غير صحيح');
    }
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);

    if (!student) {
      setParentError('الرجاء اختيار اسم الطالب');
      return;
    }

    // Check last 4 digits
    const lastFour = student.phone.slice(-4);
    if (parentPass === lastFour) {
      onLogin('parent', student.id);
    } else {
      setParentError('رمز الدخول (آخر 4 أرقام) غير صحيح');
    }
  };

  return (
    <div className="min-h-screen bg-moe-light dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <ThemeToggle />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-moe-primary overflow-hidden transition-colors">

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'admin' ? 'bg-white dark:bg-gray-800 text-moe-primary border-b-2 border-moe-primary' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          >
            الموجه الطلابي / الإدارة
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'parent' ? 'bg-white dark:bg-gray-800 text-moe-primary border-b-2 border-moe-primary' : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          >
            ولي الأمر
          </button>
        </div>

        <div className="p-8 pb-4">
          <div className="text-center mb-8">
            {activeTab === 'admin' ? (
              <div className="mb-6 flex justify-center">
                <img
                  src="/logo.png"
                  alt="شعار المدرسة"
                  className="h-56 object-contain drop-shadow-sm"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-moe-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-moe-primary">
                <Baby size={40} />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">نظام السلوك والمواظبة</h1>
            <p className="text-gray-500 mt-2">مدرسة سعد بن أبي وقاص</p>
          </div>

          {activeTab === 'admin' ? (
            <form onSubmit={handleAdminSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز دخول المسؤول
                </label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-moe-primary focus:border-moe-primary text-center tracking-widest text-lg shadow-sm"
                  placeholder="••••••"
                  inputMode="numeric"
                />
                {adminError && <p className="text-red-500 text-sm mt-2 text-center">{adminError}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-moe-primary hover:bg-moe-secondary text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-moe-primary/30"
              >
                دخول للنظام
              </button>
            </form>
          ) : (
            <form onSubmit={handleParentSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ابحث عن اسم الطالب
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      if (selectedStudentId) setSelectedStudentId('');
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-moe-primary text-right shadow-sm"
                    placeholder="اكتب الاسم هنا..."
                  />
                  {studentSearch && !selectedStudentId && (
                    <div className="absolute w-full bg-white border rounded-b-lg shadow-lg max-h-40 overflow-y-auto z-10 mt-1">
                      {filteredStudents.length > 0 ? filteredStudents.slice(0, 10).map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setStudentSearch(s.name);
                            setSelectedStudentId(s.id);
                          }}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm border-b dark:border-gray-600 last:border-0 text-gray-800 dark:text-gray-200"
                        >
                          {s.name}
                        </div>
                      )) : (
                        <div className="p-3 text-gray-400 text-sm">لا يوجد نتائج</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز الدخول (آخر 4 أرقام من الجوال)
                </label>
                <input
                  type="tel"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={parentPass}
                  onChange={(e) => setParentPass(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-moe-primary focus:border-moe-primary text-center tracking-widest text-2xl font-bold shadow-sm"
                  placeholder="••••"
                />
                <p className="text-xs text-gray-400 mt-1 text-center">استخدم لوحة المفاتيح الرقمية</p>
                {parentError && <p className="text-red-500 text-sm mt-2 text-center">{parentError}</p>}
              </div>

              <button
                type="submit"
                disabled={!selectedStudentId || parentPass.length < 4}
                className="w-full bg-moe-accent hover:bg-yellow-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-moe-accent/30"
              >
                دخول ولي الأمر
              </button>
            </form>
          )}

          {/* Credits Footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center animate-fade-in">
            <p className="text-[10px] text-gray-400 font-medium">برمجة</p>
            <p className="text-xs font-bold text-moe-secondary mt-0.5">الموجه الطلابي: أسامه سليمان البلوي</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Parent Dashboard View ---
const ParentDashboard = ({
  student,
  records,
  onLogout
}: {
  student: Student;
  records: StudentRecord[];
  onLogout: () => void;
}) => {
  const totalPositive = records.filter(r => r.type === 'POSITIVE').reduce((acc, curr) => acc + curr.points, 0);
  const totalNegative = records.filter(r => r.type === 'NEGATIVE').reduce((acc, curr) => acc + curr.points, 0);
  const finalScore = Math.min(100, Math.max(0, 80 + Math.min(20, totalPositive) - totalNegative));

  // Determine Level/Status
  let statusColor = 'text-moe-primary';
  let statusText = 'متميز';
  let progressColor = 'bg-moe-primary';

  if (finalScore >= 90) {
    statusColor = 'text-emerald-600';
    statusText = 'سلوك مثالي 🌟';
    progressColor = 'bg-emerald-500';
  } else if (finalScore >= 80) {
    statusColor = 'text-moe-primary';
    statusText = 'سلوك متميز';
    progressColor = 'bg-moe-primary';
  } else if (finalScore >= 60) {
    statusColor = 'text-yellow-600';
    statusText = 'جيد - يحتاج تحسين';
    progressColor = 'bg-yellow-500';
  } else {
    statusColor = 'text-red-600';
    statusText = 'يحتاج متابعة دقيقة';
    progressColor = 'bg-red-500';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 transition-colors duration-300">
      <ThemeToggle />
      <header className="bg-moe-secondary text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="font-bold flex items-center gap-2">
            <Baby size={20} />
            بوابة ولي الأمر
          </div>
          <button onClick={onLogout} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">خروج</button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">

        {/* Student Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors">
          <div className="bg-gradient-to-r from-moe-primary to-moe-secondary h-24"></div>
          <div className="px-6 pb-6 text-center relative">
            <div className="w-24 h-24 bg-white rounded-full p-1 mx-auto -mt-12 shadow-lg">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400">
                {student.name.split(' ')[0][0]}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-3">{student.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">الصف الدراسي</p>

            <div className="mt-6 flex flex-col items-center">
              <div className={`text-5xl font-black ${statusColor} mb-2`}>{finalScore}</div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full bg-gray-100 ${statusColor}`}>{statusText}</div>
            </div>

            <div className="mt-6 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
                style={{ width: `${finalScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
              <span>0</span>
              <span>الهدف: 100</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border-r-4 border-emerald-500 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <Star size={18} fill="currentColor" />
              <span className="font-bold text-sm">نقاط إيجابية</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">+{totalPositive}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border-r-4 border-red-500 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <ShieldAlert size={18} />
              <span className="font-bold text-sm">ملاحظات</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">-{totalNegative}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <History className="text-gray-400" size={20} />
            سجل السلوك والمكافآت
          </h3>

          <div className="space-y-6 relative before:absolute before:right-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {records.slice().reverse().map((record) => (
              <div key={record.id} className="relative pr-10">
                <div className={`absolute right-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10
                   ${record.type === 'POSITIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {record.type === 'POSITIVE' ? <Award size={18} /> : <ShieldAlert size={18} />}
                </div>
                <div className={`p-4 rounded-2xl ${record.type === 'POSITIVE' ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : 'bg-red-50/50 dark:bg-red-900/20'} transition-colors`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{record.details}</h4>
                    <span className={`text-sm font-bold ${record.type === 'POSITIVE' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {record.type === 'POSITIVE' ? '+' : '-'}{record.points}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>{new Date(record.date).toLocaleDateString('ar-SA')}</span>
                    <span>بواسطة: {record.observer}</span>
                  </div>
                  {record.procedureApplied && (
                    <div className="mt-2 text-xs bg-white/80 dark:bg-gray-700 p-2 rounded text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                      الإجراء: {record.procedureApplied}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                لا يوجد سجلات مسجلة حتى الآن
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Student Detail Component (Admin View) ---
const StudentDetail = ({
  student,
  records,
  onAddRecord,
  onBack
}: {
  student: Student;
  records: StudentRecord[];
  onAddRecord: (r: StudentRecord) => void;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'negative' | 'positive' | 'staff_offenses'>('negative');

  // Calculate Scores
  const totalPositive = records.filter(r => r.type === 'POSITIVE').reduce((acc, curr) => acc + curr.points, 0);
  const totalNegative = records.filter(r => r.type === 'NEGATIVE').reduce((acc, curr) => acc + curr.points, 0);
  const finalScore = Math.min(100, Math.max(0, 80 + Math.min(20, totalPositive) - totalNegative));

  // --- Negative Form State ---
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedViolation, setSelectedViolation] = useState<ViolationRule | null>(null);
  const [violationObserver, setViolationObserver] = useState('الموجه الطلابي');

  // --- Positive Form State ---
  const [selectedPositiveRule, setSelectedPositiveRule] = useState<PositiveRule | null>(null);
  const [positiveDesc, setPositiveDesc] = useState('');
  const [positivePoints, setPositivePoints] = useState(1);
  const [positiveObserver, setPositiveObserver] = useState('');

  // Handle preset selection
  const handleSelectPositiveRule = (rule: PositiveRule) => {
    setSelectedPositiveRule(rule);
    setPositiveDesc(rule.description);
    setPositivePoints(rule.points);
  };

  // Determine Procedure logic
  const getProcedure = (violation: ViolationRule) => {
    const count = records.filter(r => r.violationId === violation.id).length;
    const procIndex = Math.min(count, violation.procedures.length - 1);
    return {
      text: violation.procedures[procIndex],
      iteration: count + 1
    };
  };

  const handleAddNegative = () => {
    if (!selectedViolation) return;
    const procedureInfo = getProcedure(selectedViolation);

    const newRecord: StudentRecord = {
      id: Date.now().toString(),
      studentId: student.id,
      type: 'NEGATIVE',
      date: new Date().toISOString(),
      details: selectedViolation.description,
      points: selectedViolation.deduction,
      observer: violationObserver,
      procedureApplied: procedureInfo.text,
      violationId: selectedViolation.id
    };
    onAddRecord(newRecord);
    setSelectedViolation(null);
  };

  const handleAddPositive = () => {
    if (!positiveDesc || !positiveObserver) return;
    const newRecord: StudentRecord = {
      id: Date.now().toString(),
      studentId: student.id,
      type: 'POSITIVE',
      date: new Date().toISOString(),
      details: positiveDesc,
      points: Number(positivePoints),
      observer: positiveObserver
    };
    onAddRecord(newRecord);

    setPositiveDesc('');
    setPositivePoints(1);
    setPositiveObserver('');
    setSelectedPositiveRule(null);
  };

  // --- WhatsApp & Print Logic ---
  const getCleanPhone = (phone: string) => {
    // Basic cleanup for Saudi numbers (ensure start with 966)
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('05')) {
      clean = '966' + clean.substring(1);
    } else if (clean.startsWith('5')) {
      clean = '966' + clean;
    }
    return clean;
  };

  const handleSendRecordWhatsApp = (record: StudentRecord) => {
    const cleanPhone = getCleanPhone(student.phone);
    const date = new Date(record.date).toLocaleDateString('ar-SA');
    let message = '';

    if (record.type === 'NEGATIVE') {
      message = `المكرم ولي أمر الطالب ${student.name}،\n\nنود إشعاركم بأنه تم رصد مخالفة سلوكية على الطالب بتاريخ ${date}.\nنوع المخالفة: ${record.details}\nالإجراء المتخذ: ${record.procedureApplied || 'تنبيه'}\nالنقاط المحسومة: ${record.points}\n\nنأمل منكم التوجيه والمتابعة لتقويم سلوك الطالب.\n\nإدارة مدرسة سعد بن أبي وقاص`;
    } else {
      message = `المكرم ولي أمر الطالب ${student.name}،\n\nيسرنا إبلاغكم بتميز ابنكم سلوكياً بتاريخ ${date}.\nالسبب: ${record.details}\nنقاط التميز: +${record.points}\n\nنشكر لكم حسن متابعتكم وتربيتكم.\n\nإدارة مدرسة سعد بن أبي وقاص`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSendSummaryWhatsApp = () => {
    const cleanPhone = getCleanPhone(student.phone);
    const lastRecords = records.slice(-5).reverse();

    let message = `*تقرير السلوك والمواظبة*\nالطالب: ${student.name}\n`;
    message += `الدرجة الحالية: *${finalScore}* / 100\n`;
    message += `مجموع نقاط التميز: ${totalPositive}\n`;
    message += `مجموع نقاط المخالفات: ${totalNegative}\n\n`;
    message += `*آخر الملاحظات المسجلة:*\n`;

    if (lastRecords.length === 0) {
      message += "لا يوجد ملاحظات مسجلة حديثاً.";
    } else {
      lastRecords.forEach(r => {
        const typeSym = r.type === 'POSITIVE' ? '✅' : '❌';
        message += `${typeSym} ${r.details} (${r.type === 'POSITIVE' ? '+' : '-'}${r.points})\n`;
      });
    }

    message += `\nإدارة مدرسة سعد بن أبي وقاص`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in p-4 max-w-7xl mx-auto dark:text-gray-200">
      {/* Header / Nav (Hidden in Print) */}
      <div className="flex justify-between items-center mb-6 no-print">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-moe-primary transition-colors">
          <ChevronRight size={20} />
          <span className="mr-1 font-bold">العودة لقائمة الطلاب</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSendSummaryWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm"
          >
            <MessageCircle size={18} />
            إرسال تقرير مختصر
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm"
          >
            <Printer size={18} />
            طباعة / حفظ PDF
          </button>
        </div>
      </div>

      {/* Print Header (Visible Only in Print) */}
      <div className="print-only text-center mb-8 border-b-2 border-gray-800 pb-4">
        <div className="flex justify-between items-center px-8">
          <div className="text-right">
            <h2 className="font-bold text-lg">المملكة العربية السعودية</h2>
            <h3 className="text-sm">وزارة التعليم</h3>
            <h3 className="text-sm">مدرسة سعد بن أبي وقاص</h3>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black mb-1">تقرير السلوك والمواظبة</h1>
            <p className="text-sm text-gray-600">تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</p>
          </div>
          <div className="w-24 flex justify-end">
            <img src="/logo.png" alt="شعار المدرسة" className="h-24 object-contain" />
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-r-4 border-moe-primary flex flex-col md:flex-row justify-between items-center gap-6 print-break-inside border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-2xl border-2 border-gray-200 dark:border-gray-600 print:border-black">
            {student.name.split(' ')[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{student.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm print:bg-transparent print:border print:border-gray-300">جوال: {student.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">نقاط إيجابية</div>
            <div className="font-bold text-emerald-600 text-xl">+{Math.min(20, totalPositive)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">نقاط محسومة</div>
            <div className="font-bold text-red-600 text-xl">-{totalNegative}</div>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className={`w-28 h-28 rounded-full border-8 flex items-center justify-center
                ${finalScore >= 90 ? 'border-emerald-500 text-emerald-700' :
                finalScore >= 80 ? 'border-moe-primary text-moe-primary' :
                  finalScore >= 60 ? 'border-yellow-500 text-yellow-700' : 'border-red-500 text-red-700'
              }`}>
              <div className="text-center">
                <span className="text-3xl font-bold">{finalScore}</span>
                <span className="block text-xs text-gray-400">من 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Tabs (Hidden in Print) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 no-print">
        <button
          onClick={() => setActiveTab('negative')}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
            ${activeTab === 'negative' ? 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 ring-2 ring-red-500' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Gavel size={20} />
          رصد مخالفة سلوكية
        </button>
        <button
          onClick={() => setActiveTab('positive')}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
            ${activeTab === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Award size={20} />
          رصد سلوك إيجابي
        </button>
        <button
          onClick={() => { setActiveTab('staff_offenses'); setSelectedViolation(null); }}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
            ${activeTab === 'staff_offenses' ? 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 ring-2 ring-orange-500' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Siren size={20} />
          مخالفات تجاه الهيئة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Form (Hidden in Print) */}
        <div className="lg:col-span-2 no-print">
          {activeTab === 'negative' ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-red-500 animate-fade-in-up transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500" />
                سجل المخالفات والتأديب (الدرجة 1 - 4)
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">درجة المخالفة</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => { setSelectedLevel(lvl); setSelectedViolation(null); }}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors border
                          ${selectedLevel === lvl
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border-gray-200 dark:border-gray-600'}`}
                      >
                        الدرجة {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نوع المخالفة</label>
                  <select
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    onChange={(e) => {
                      const v = VIOLATION_RULES.find(r => r.id === e.target.value);
                      setSelectedViolation(v || null);
                    }}
                    value={selectedViolation?.id || ''}
                  >
                    <option value="">-- اختر المخالفة --</option>
                    {VIOLATION_RULES.filter(v => v.level === selectedLevel && v.category === 'general').map(v => (
                      <option key={v.id} value={v.id}>{v.description} (حسم {v.deduction} درجات)</option>
                    ))}
                  </select>
                </div>

                {selectedViolation && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-red-800 font-bold text-sm">الإجراء المتخذ (تلقائي):</span>
                      <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                        التكرار رقم: {getProcedure(selectedViolation).iteration}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {getProcedure(selectedViolation).text}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المسؤول (الراصد)</label>
                  <input
                    type="text"
                    value={violationObserver}
                    onChange={(e) => setViolationObserver(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <button
                  disabled={!selectedViolation}
                  onClick={handleAddNegative}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  تأكيد وحفظ المخالفة
                </button>
              </div>
            </div>
          ) : activeTab === 'staff_offenses' ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-orange-500 animate-fade-in-up transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Siren className="text-orange-500" />
                مخالفات تجاه الهيئة التعليمية والإدارية
              </h3>

              <div className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-sm text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/30">
                  <AlertTriangle size={16} className="inline ml-1 -mt-1" />
                  <strong>تنبيه:</strong> هذه المخالفات تصنف ضمن الدرجة الرابعة والخامسة وتستوجب إجراءات صارمة وحسم كبير من الدرجات.
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نوع المخالفة</label>
                  <select
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    onChange={(e) => {
                      const v = VIOLATION_RULES.find(r => r.id === e.target.value);
                      setSelectedViolation(v || null);
                    }}
                    value={selectedViolation?.id || ''}
                  >
                    <option value="">-- اختر المخالفة تجاه الهيئة --</option>
                    {VIOLATION_RULES.filter(v => v.category === 'staff').map(v => (
                      <option key={v.id} value={v.id}>
                        [الدرجة {v.level}] {v.description} (حسم {v.deduction} درجة)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedViolation && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-orange-800 font-bold text-sm">الإجراء النظامي:</span>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {getProcedure(selectedViolation).text}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المسؤول (الراصد)</label>
                  <input
                    type="text"
                    value={violationObserver}
                    onChange={(e) => setViolationObserver(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <button
                  disabled={!selectedViolation}
                  onClick={handleAddNegative}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                >
                  تأكيد وحفظ مخالفة الهيئة
                </button>

              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-emerald-500 animate-fade-in-up transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Award className="text-emerald-500" />
                تعزيز السلوك الإيجابي
              </h3>

              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-sm text-emerald-800 dark:text-emerald-300 mb-4 border border-emerald-100 dark:border-emerald-900/30">
                  <strong>قاعدة النظام:</strong> يضاف السلوك الإيجابي للدرجة الثابتة (80) بحد أقصى 20 درجة ليصبح المجموع 100.
                </div>

                {/* Section 1: Predefined Rules */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    اختر من قائمة السلوك المتميز (حسب الدليل):
                  </h4>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {POSITIVE_RULES.map(rule => (
                      <button
                        key={rule.id}
                        onClick={() => handleSelectPositiveRule(rule)}
                        className={`text-right p-3 rounded-xl border transition-all text-sm font-medium
                           ${selectedPositiveRule?.id === rule.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-[1.01]'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                          }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span>{rule.description}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold
                              ${selectedPositiveRule?.id === rule.id ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}
                            `}>
                            {rule.isVariable ? 'حتى 6 درجات' : `${rule.points} درجات`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Manual Entry / Editing */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                    <Edit3 size={16} />
                    تأكيد البيانات أو الإدخال اليدوي:
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">وصف السلوك</label>
                      <input
                        type="text"
                        value={positiveDesc}
                        onChange={(e) => {
                          setPositiveDesc(e.target.value);
                          // If user edits text, clear selection to treat as custom
                          if (selectedPositiveRule && e.target.value !== selectedPositiveRule.description) {
                            setSelectedPositiveRule(null);
                          }
                        }}
                        placeholder="اكتب وصف السلوك هنا..."
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">النقاط</label>
                        <input
                          type="number"
                          min="1"
                          max={selectedPositiveRule?.isVariable ? 6 : 20}
                          value={positivePoints}
                          onChange={(e) => setPositivePoints(Number(e.target.value))}
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold text-lg"
                        />
                        {selectedPositiveRule?.isVariable && (
                          <p className="text-xs text-orange-500 mt-1">يمكن تعديل الدرجة حتى 6 درجات لهذه الفئة.</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الراصد</label>
                        <input
                          type="text"
                          value={positiveObserver}
                          onChange={(e) => setPositiveObserver(e.target.value)}
                          placeholder="اسم المعلم..."
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!positiveDesc || !positiveObserver}
                  onClick={handleAddPositive}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  حفظ السلوك الإيجابي
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: History (Expands to Full Width in Print) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit max-h-[600px] print:max-h-none overflow-y-auto print:overflow-visible lg:col-span-1 print:col-span-3 w-full border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-4">
            <History className="text-moe-primary" />
            سجل العمليات التفصيلي
          </h3>

          {records.length === 0 ? (
            <div className="text-center text-gray-400 py-8">لا يوجد سجلات لهذا الطالب</div>
          ) : (
            <div className="space-y-4">
              {records.slice().reverse().map(record => (
                <div key={record.id} className={`p-4 rounded-xl border-r-4 relative ${record.type === 'POSITIVE' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'} print:bg-white print:border-gray-300 print:border`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${record.type === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'} print:bg-gray-100 print:text-black`}>
                      {record.type === 'POSITIVE' ? 'سلوك إيجابي' : 'مخالفة'}
                    </span>
                    <span className="text-xs text-gray-500" dir="ltr">{new Date(record.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mt-2">{record.details}</h4>
                  {record.procedureApplied && (
                    <p className="text-xs text-red-600 mt-1 font-medium bg-red-100/50 p-1 rounded inline-block print:bg-transparent print:text-black">
                      الإجراء: {record.procedureApplied}
                    </p>
                  )}
                  <div className="flex justify-between items-end mt-3">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Users size={12} />
                      {record.observer}
                    </div>
                    <div className={`font-bold text-lg ${record.type === 'POSITIVE' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {record.type === 'POSITIVE' ? '+' : '-'}{record.points}
                    </div>
                  </div>

                  {/* WhatsApp Action Button (Hidden in Print) */}
                  <button
                    onClick={() => handleSendRecordWhatsApp(record)}
                    className="absolute top-4 left-4 text-gray-400 hover:text-green-500 transition-colors no-print"
                    title="إرسال إشعار فوري لولي الأمر عبر واتساب"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Print Footer */}
      <div className="print-only mt-12 text-center text-sm">
        <div className="flex justify-between px-12 mt-20">
          <div>
            <p className="font-bold mb-8">مدير المدرسة</p>
            <p>.................................</p>
          </div>
          <div>
            <p className="font-bold mb-8">الموجه الطلابي</p>
            <p>.................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Add Student Modal ---
const AddStudentModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, phone: string) => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('الرجاء تعبئة جميع الحقول');
      return;
    }
    // Validation for phone (simple numeric check)
    if (!/^\d+$/.test(phone)) {
      setError('رقم الجوال يجب أن يحتوي على أرقام فقط');
      return;
    }

    onAdd(name, phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="text-moe-primary" />
            إضافة طالب جديد
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg flex gap-2 items-start text-sm text-yellow-700 mb-2">
            <AlertTriangle size={16} className="mt-1 flex-shrink-0" />
            سيتم إضافة الطالب للقائمة المحلية فوراً للتعويض عن أي نقص في البيانات.
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم الطالب رباعي</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-moe-primary outline-none"
              placeholder="مثال: محمد عبدالله سعود..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم جوال ولي الأمر</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Force numbers only
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-moe-primary outline-none text-left font-mono"
              placeholder="9665xxxxxxxx"
              dir="ltr"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-moe-primary text-white font-bold rounded-xl hover:bg-moe-secondary transition-colors shadow-lg shadow-moe-primary/20 flex justify-center items-center gap-2"
            >
              <Save size={18} />
              حفظ الطالب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// --- Main App Component ---
function App() {
  const [userSession, setUserSession] = useState<{ type: 'admin' | 'parent', studentId?: string } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Database Connection Status


  // Initialize records
  const [allRecords, setAllRecords] = useState<StudentRecord[]>([]);

  // Initialize students
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);


      // 1. Fetch Students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
        if (studentsError.code === '42P01') {
          alert('تنبيه: الجداول غير موجودة في قاعدة البيانات.\nالرجاء تشغيل ملف setup_database.sql في لوحة تحكم Supabase.');

          setLoading(false);
          return;
        }
        throw studentsError;
      }



      // Seed if empty
      if (!studentsData || studentsData.length === 0) {
        console.log('Seeding initial data...');
        const seedData = STUDENTS_DATA.map(s => ({
          name: s.name,
          phone: s.phone,
          base_score: s.baseScore
        }));

        const { data: newStudents, error: seedError } = await supabase
          .from('students')
          .insert(seedData)
          .select();

        if (seedError) console.error('Seeding error:', seedError);

        if (newStudents) {
          setAllStudents(newStudents.map((s: any) => ({
            id: s.id, name: s.name, phone: s.phone, baseScore: s.base_score
          })));
        }
      } else {
        setAllStudents(studentsData.map((s: any) => ({
          id: s.id, name: s.name, phone: s.phone, baseScore: s.base_score
        })));
      }

      // 2. Fetch Records
      const { data: recordsData, error: recordsError } = await supabase
        .from('student_records')
        .select('*');

      if (recordsError && recordsError.code !== '42P01') throw recordsError;

      if (recordsData) {
        setAllRecords(recordsData.map((r: any) => ({
          id: r.id,
          studentId: r.student_id,
          type: r.type,
          date: r.date,
          details: r.details,
          points: r.points,
          observer: r.observer,
          procedureApplied: r.procedure_applied,
          violationId: r.violation_id
        })));
      }

    } catch (err) {
      console.error('Error fetching data:', err);

      // Fallback to empty to allow UI to render (or keep loading state based on preference, but better to show UI)
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (record: StudentRecord) => {
    // Optimistic Update
    setAllRecords(prev => [...prev, record]);

    try {
      const { error } = await supabase.from('student_records').insert({
        student_id: record.studentId,
        type: record.type,
        date: record.date,
        details: record.details,
        points: record.points,
        observer: record.observer,
        procedure_applied: record.procedureApplied,
        violation_id: record.violationId
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Failed to add record:', err);
      alert('فشل حفظ السجل في قاعدة البيانات: ' + (err.message || 'خطأ غير معروف'));
      // Rollback
      setAllRecords(prev => prev.filter(r => r.id !== record.id));
    }
  };

  const handleAddNewStudent = async (name: string, phone: string) => {
    try {
      const { data, error } = await supabase.from('students').insert({
        name,
        phone,
        base_score: 80
      }).select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newS = data[0];
        setAllStudents(prev => [...prev, {
          id: newS.id,
          name: newS.name,
          phone: newS.phone,
          baseScore: newS.base_score
        }]);
      }
    } catch (err: any) {
      console.error('Failed to add student:', err);
      alert('فشل إضافة الطالب للقاعدة: ' + (err.message || 'خطأ غير معروف'));
    }
  };

  // --- Excel Import Handler ---
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Read as array of arrays to better handle headers
        const data = utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (data.length < 2) {
          alert('الملف فارغ أو لا يحتوي على بيانات كافية');
          return;
        }

        // Detect columns based on headers in first row, or default to 0 and 1
        const headerRow = data[0];
        let nameIdx = 0;
        let phoneIdx = 1;

        // Try to find columns by name keywords
        headerRow.forEach((cell: any, idx: number) => {
          if (typeof cell === 'string') {
            const val = cell.toLowerCase();
            if (val.includes('اسم') || val.includes('طالب') || val.includes('مستلم')) nameIdx = idx;
            if (val.includes('جوال') || val.includes('هاتف') || val.includes('رقم')) phoneIdx = idx;
          }
        });

        const newStudents: Student[] = [];
        let addedCount = 0;

        // Start from row 1 (skip header)
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0) continue;

          const rawName = row[nameIdx];
          const rawPhone = row[phoneIdx];

          if (rawName && rawPhone) {
            const name = String(rawName).trim();
            // Clean phone number: remove non-digits
            let phone = String(rawPhone).replace(/\D/g, '');

            // Ensure it handles 966 prefix if present in some form, or add it if missing (optional, based on prompt strictness we just trust the input or ensure it starts with 966)
            // The prompt says "number starts with 966" implies the file HAS it, so we just make sure we capture it correctly.

            if (name.length > 2 && phone.length > 5) {
              newStudents.push({
                id: Date.now().toString() + i + Math.random().toString(36).substr(2, 5),
                name,
                phone,
                baseScore: 80
              });
              addedCount++;
            }
          }
        }

        if (newStudents.length > 0) {
          // Prepare for Supabase (remove local IDs)
          const infoToInsert = newStudents.map(s => ({
            name: s.name,
            phone: s.phone,
            base_score: 80
          }));

          try {
            const { data, error } = await supabase.from('students').insert(infoToInsert).select();
            if (error) throw error;

            if (data) {
              setAllStudents(prev => [...prev, ...data.map((s: any) => ({
                id: s.id, name: s.name, phone: s.phone, baseScore: s.base_score
              }))]);
              alert(`تم استيراد ${data.length} طالب بنجاح!`);
            }
          } catch (err) {
            console.error('Import error:', err);
            alert('فشل استيراد البيانات لقاعدة البيانات');
          }
        } else {
          alert('لم يتم العثور على بيانات صالحة للاستيراد. تأكد من وجود عمودي الاسم ورقم الجوال.');
        }

      } catch (error) {
        console.error('Error parsing excel:', error);
        alert('حدث خطأ أثناء قراءة الملف. تأكد من صيغة الملف (Excel).');
      } finally {
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDeleteStudent = async (e: React.MouseEvent, studentId: string) => {
    e.stopPropagation(); // Stop row click
    if (!studentId) return;

    if (window.confirm('هل أنت متأكد من حذف هذا الطالب من النظام؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', studentId);
        if (error) throw error;

        setAllStudents(prev => prev.filter(s => s.id !== studentId));
        setAllRecords(prev => prev.filter(r => r.studentId !== studentId));
        if (selectedStudent?.id === studentId) setSelectedStudent(null);
        // Clean up selection
        const newSet = new Set(selectedIds);
        if (newSet.has(studentId)) {
          newSet.delete(studentId);
          setSelectedIds(newSet);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('فشل الحذف من قاعدة البيانات');
      }
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.size} طالب/طلاب؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      try {
        const ids = Array.from(selectedIds);
        const { error } = await supabase.from('students').delete().in('id', ids);
        if (error) throw error;

        setAllStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
        setAllRecords(prev => prev.filter(r => !selectedIds.has(r.studentId)));
        setSelectedIds(new Set());
        if (selectedStudent && selectedIds.has(selectedStudent.id)) {
          setSelectedStudent(null);
        }
      } catch (err) {
        console.error('Bulk delete error:', err);
        alert('فشل الحذف الجماعي');
      }
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const getStudentScore = (id: string) => {
    const sRecords = allRecords.filter(r => r.studentId === id);
    const pos = sRecords.filter(r => r.type === 'POSITIVE').reduce((a, b) => a + b.points, 0);
    const neg = sRecords.filter(r => r.type === 'NEGATIVE').reduce((a, b) => a + b.points, 0);
    return Math.min(100, Math.max(0, 80 + Math.min(20, pos) - neg));
  };

  const filteredStudents = allStudents.filter(s =>
    s.name.includes(searchTerm) || s.phone.includes(searchTerm)
  );

  // Handle Login
  const handleLogin = (type: 'admin' | 'parent', studentId?: string) => {
    setUserSession({ type, studentId });
  };

  const handleLogout = () => {
    setUserSession(null);
    setSelectedStudent(null);
  };

  // --- Render Views ---

  // 1. Not Logged In
  if (!userSession) {
    return <Login onLogin={handleLogin} students={allStudents} />;
  }

  // 2. Parent View
  if (userSession.type === 'parent' && userSession.studentId) {
    const student = allStudents.find(s => s.id === userSession.studentId);
    if (!student) return <div onClick={handleLogout} className="p-8 text-center cursor-pointer text-red-500">حدث خطأ: الطالب غير موجود. اضغط للخروج</div>;

    return (
      <ParentDashboard
        student={student}
        records={allRecords.filter(r => r.studentId === student.id)}
        onLogout={handleLogout}
      />
    );
  }

  // 3. Admin View - Student Detail
  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeToggle />
        <header className="bg-moe-primary text-white p-4 shadow-md sticky top-0 z-10 no-print">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="font-bold text-lg">نظام السلوك والمواظبة</div>
            <div className="text-sm opacity-90">المستخدم: مسؤول النظام</div>
          </div>
        </header>
        <StudentDetail
          student={selectedStudent}
          records={allRecords.filter(r => r.studentId === selectedStudent.id)}
          onAddRecord={handleAddRecord}
          onBack={() => setSelectedStudent(null)}
        />
      </div>
    );
  }

  // 4. Admin View - Dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddNewStudent}
        />
      )}



      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleImportExcel}
        className="hidden"
      />

      {/* Dashboard Header */}
      <header className="bg-moe-primary text-white shadow-lg pb-12 pt-6 px-4 no-print">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <ClipboardList />
              لوحة تحكم الموجه الطلابي
            </h1>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold shadow-lg"
                title="استيراد من ملف إكسل (الاسم، الجوال)"
              >
                <FileSpreadsheet size={18} />
                استيراد إكسل
              </button>
              <button
                onClick={() => setShowAddStudent(true)}
                className="bg-moe-accent hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold shadow-lg"
              >
                <Plus size={18} />
                إضافة طالب جديد
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <LogOut size={16} />
                خروج
              </button>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="بحث عن طالب بالاسم أو رقم الجوال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-12 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-xl focus:ring-4 focus:ring-moe-accent/50 outline-none placeholder-gray-400"
            />
            <Search className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-b-4 border-moe-primary transition-colors">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">إجمالي الطلاب</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{allStudents.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-b-4 border-red-500 transition-colors">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">طلاب لديهم مخالفات</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {new Set(allRecords.filter(r => r.type === 'NEGATIVE').map(r => r.studentId)).size}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-b-4 border-emerald-500 transition-colors">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">طلاب متميزون سلوكياً</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {new Set(allRecords.filter(r => r.type === 'POSITIVE').map(r => r.studentId)).size}
          </div>
        </div>
      </div>

      {/* Student List */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden transition-colors">
          {/* Bulk Action Bar (Visible when items selected) */}
          {selectedIds.size > 0 && (
            <div className="bg-red-50 p-3 flex justify-between items-center px-6 animate-fade-in">
              <span className="font-bold text-red-700 text-sm">تم تحديد {selectedIds.size} طالب</span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                حذف المحدد
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600 transition-colors">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                      onChange={toggleAll}
                      className="w-5 h-5 rounded border-gray-300 text-moe-primary focus:ring-moe-primary cursor-pointer accent-moe-primary"
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600 dark:text-gray-300">اسم الطالب</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600 dark:text-gray-300">رقم الجوال</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300">درجة السلوك</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300">الحالة</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map(student => {
                  const score = getStudentScore(student.id);
                  const isSelected = selectedIds.has(student.id);
                  return (
                    <tr key={student.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(student.id)}
                          className="w-5 h-5 rounded border-gray-300 text-moe-primary focus:ring-moe-primary cursor-pointer accent-moe-primary"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{student.name}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{student.phone}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold
                          ${score >= 90 ? 'bg-emerald-100 text-emerald-800' :
                            score >= 80 ? 'bg-blue-100 text-blue-800' :
                              score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {score === 100 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 size={14} /> مثالي
                          </span>
                        ) : score < 80 ? (
                          <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold">
                            <ShieldAlert size={14} /> يحتاج متابعة
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="bg-moe-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-moe-secondary transition-colors shadow-sm"
                          >
                            فتح الملف
                          </button>
                          <button
                            onClick={(e) => handleDeleteStudent(e, student.id)}
                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="حذف الطالب"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              لا يوجد طلاب مطابقين للبحث
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;