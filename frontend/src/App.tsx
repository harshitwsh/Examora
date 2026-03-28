import React, { useState } from 'react';
import { 
  Upload, 
  Calendar as CalendarIcon, 
  List as ListIcon, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Download,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { cn } from './lib/utils';
import { CourseEvent, EventCategory, ViewMode } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Components ---

const CategoryBadge = ({ category }: { category: EventCategory }) => {
  const styles = {
    Exam: 'bg-red-100 text-red-700 border-red-200',
    Assignment: 'bg-blue-100 text-blue-700 border-blue-200',
    Quiz: 'bg-amber-100 text-amber-700 border-amber-200',
    Lecture: 'bg-purple-100 text-purple-700 border-purple-200',
    Other: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider", styles[category] || styles.Other)}>
      {category}
    </span>
  );
};

const EventCard = ({ event }: { event: CourseEvent }) => (
  <div className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4">
    <div className={cn(
      "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
      event.category === 'Exam' ? "bg-red-50 text-red-500" :
      event.category === 'Assignment' ? "bg-blue-50 text-blue-500" :
      event.category === 'Quiz' ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-500"
    )}>
      {event.category === 'Exam' ? <FileText size={20} /> : 
       event.category === 'Assignment' ? <CheckCircle2 size={20} /> : 
       <Clock size={20} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <CategoryBadge category={event.category} />
        <span className="text-xs text-slate-500 font-medium">
          {isNaN(event.date.getTime()) ? event.rawDate : format(event.date, 'MMM d, yyyy')}
        </span>
      </div>
      <h4 className="font-semibold text-slate-900 truncate">{event.title}</h4>
      {event.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.description}</p>}
    </div>
  </div>
);

const CalendarView = ({ events }: { events: CourseEvent[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon size={18} className="text-indigo-600" />
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const dayEvents = events.filter(e => !isNaN(e.date.getTime()) && isSameDay(e.date, day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "min-h-[100px] p-2 border-r border-b border-slate-100 last:border-r-0 transition-colors",
                !isCurrentMonth && "bg-slate-50/30",
                isToday(day) && "bg-indigo-50/30"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                  isToday(day) ? "bg-indigo-600 text-white" : isCurrentMonth ? "text-slate-700" : "text-slate-300"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded border truncate font-medium",
                      event.category === 'Exam' ? "bg-red-50 text-red-700 border-red-100" :
                      event.category === 'Assignment' ? "bg-blue-50 text-blue-700 border-blue-100" :
                      "bg-slate-50 text-slate-700 border-slate-100"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimelineView = ({ events }: { events: CourseEvent[] }) => {
  const sortedEvents = [...events].filter(e => !isNaN(e.date.getTime())).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sortedEvents.map((event, idx) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          <div className={cn(
            "absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10",
            event.category === 'Exam' ? "bg-red-500" :
            event.category === 'Assignment' ? "bg-blue-500" :
            event.category === 'Quiz' ? "bg-amber-500" : "bg-slate-400"
          )} />
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600">{format(event.date, 'MMM d')}</span>
              <CategoryBadge category={event.category} />
            </div>
            <h4 className="font-bold text-slate-900">{event.title}</h4>
            {event.description && <p className="text-sm text-slate-500 mt-1">{event.description}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [events, setEvents] = useState<CourseEvent[]>([]);
  const [filterCat, setFilterCat] = useState<EventCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response.");
      }

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }
      
      const formattedEvents: CourseEvent[] = data.events.map((e: any, idx: number) => {
        let category: EventCategory = 'Other';
        const rawCat = (e.category || '').toLowerCase();
        if (rawCat.includes('exam')) category = 'Exam';
        if (rawCat.includes('assignment')) category = 'Assignment';
        if (rawCat.includes('quiz')) category = 'Quiz';
        if (rawCat.includes('lecture')) category = 'Lecture';
        
        let dateObj = new Date(NaN);
        const isValidDate = /^\\d{4}-\\d{2}-\\d{2}$/.test(e.date || "");
        if (isValidDate) {
          const [year, month, day] = e.date.split('-');
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        
        return {
          id: String(idx + 1),
          title: e.event,
          date: dateObj,
          rawDate: e.date,
          category,
        };
      });
      
      setEvents(formattedEvents);
      setView('dashboard');
    } catch (error: any) {
      console.error("Error formatting events:", error);
      alert(`Extraction failed: ${error.message || "Ensure your backend is running and you uploaded a valid PDF."}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-200 bg-slate-900 pb-0.5">
              <img src="/logo.png" alt="Examora Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Examora</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <button 
              onClick={() => setView('dashboard')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Demo Dashboard
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Automated Extraction
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-slate-900 mb-8">
              Turn Your Course Syllabus Into a <span className="text-indigo-600">Smart Schedule</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Stop manually typing dates. Upload your syllabus PDF and let our system extract every exam, assignment, and quiz into a beautiful, synced calendar.
            </p>

            {/* Upload Area */}
            <div className="relative group">
              <input type="file" accept=".pdf" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div 
                className={cn(
                  "relative bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center transition-all",
                  isAnalyzing ? "cursor-wait" : "hover:border-indigo-400 cursor-pointer"
                )}
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              >
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      <h3 className="text-xl font-bold text-slate-800">Analyzing Syllabus...</h3>
                      <p className="text-sm text-slate-500 mt-2">We are finding your important dates</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Syllabus PDF</h3>
                      <p className="text-sm text-slate-500 mb-6">Drag and drop or click to browse files</p>
                      <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
                        Select File
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Visual Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-2 w-32 bg-slate-100 rounded-full" />
              </div>
              <div className="space-y-4">
                {[
                  { t: 'Midterm Exam', d: 'Oct 15', c: 'Exam' },
                  { t: 'Research Paper', d: 'Oct 22', c: 'Assignment' },
                  { t: 'Weekly Quiz', d: 'Oct 29', c: 'Quiz' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
                      item.c === 'Exam' ? "bg-red-100 text-red-600" : 
                      item.c === 'Assignment' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                    )}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-50">{item.c}</div>
                      <div className="font-bold text-slate-800">{item.t}</div>
                    </div>
                    <div className="ml-auto text-sm font-bold text-slate-400">{item.d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    +2k
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
                <div className="text-sm font-bold text-slate-800">12 Dates Found</div>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Steps Section */}
        <section className="bg-white py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">How it works</h2>
              <p className="text-slate-500">Three simple steps to academic organization.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { i: <Upload />, t: 'Upload PDF', d: 'Drop your syllabus or course handout into our secure uploader.' },
                { i: <Search />, t: 'Automated Analysis', d: 'We automatically scan the text to identify dates, titles, and categories.' },
                { i: <CalendarPlus />, t: 'Sync & Study', d: 'Review your schedule and export it directly to Google Calendar.' },
              ].map((step, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {step.i}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.t}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 pb-0.5">
              <img src="/logo.png" alt="Examora Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-400 group-hover:text-slate-900 transition-colors">Examora</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Examora. Built for students.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-slate-900 pb-0.5">
                <img src="/logo.png" alt="Examora Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="text-lg font-black tracking-tight">Examora</span>
            </div>
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  viewMode === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <ListIcon size={16} /> List
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  viewMode === 'calendar' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <CalendarIcon size={16} /> Calendar
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  viewMode === 'timeline' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Clock size={16} /> Timeline
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.open(`https://calendar.google.com/calendar/render?cid=${API_BASE_URL}/calendar`, "_blank")} className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              <CalendarPlus size={18} /> Add to Google Calendar
            </button>
            <button onClick={() => window.location.href=`${API_BASE_URL}/calendar`} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Dashboard Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Course Schedule</h2>
            <p className="text-slate-500 mt-1">Extracted from <span className="font-bold text-slate-700">CS101_Syllabus.pdf</span></p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Events</div>
              <div className="text-2xl font-black text-slate-900">{events.length}</div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Event</div>
              <div className="text-2xl font-black text-indigo-600">In 8 Days</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {viewMode === 'list' && (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Upcoming Dates</h3>
                    <div className="flex gap-2">
                      <select 
                        value={filterCat}
                        onChange={(e) => setFilterCat(e.target.value as any)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none"
                      >
                        <option value="All">All Categories</option>
                        <option value="Exam">Exam</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Other">Other</option>
                      </select>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100"
                      >
                        <Plus size={14} /> Add Manual
                      </button>
                    </div>
                  </div>
                  {events.filter(e => filterCat === 'All' || e.category === filterCat).map(event => (
                    <motion.div 
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {viewMode === 'calendar' && (
                <motion.div 
                  key="calendar"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <CalendarView events={events} />
                </motion.div>
              )}

              {viewMode === 'timeline' && (
                <motion.div 
                  key="timeline"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <TimelineView events={events} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Summary Card */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-xl font-bold mb-4">Export Schedule</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Sync all extracted dates with your preferred calendar app to never miss a deadline.
              </p>
              <div className="space-y-3">
                <button onClick={() => window.open(`https://calendar.google.com/calendar/render?cid=${API_BASE_URL}/calendar`, "_blank")} className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all active:scale-95">
                  <CalendarPlus size={18} /> Google Calendar
                </button>
                <button onClick={() => window.location.href=`${API_BASE_URL}/calendar`} className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-400 transition-all active:scale-95">
                  <Download size={18} /> Download .ICS
                </button>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Course Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Exams', count: events.filter(e => e.category === 'Exam').length, color: 'bg-red-500' },
                  { label: 'Assignments', count: events.filter(e => e.category === 'Assignment').length, color: 'bg-blue-500' },
                  { label: 'Quizzes', count: events.filter(e => e.category === 'Quiz').length, color: 'bg-amber-500' },
                  { label: 'Other', count: events.filter(e => e.category === 'Lecture' || e.category === 'Other').length, color: 'bg-slate-400' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-500 uppercase tracking-wider">{stat.label}</span>
                      <span className="text-slate-900">{stat.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.count / Math.max(events.length, 1)) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={cn("h-full rounded-full", stat.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <FileText size={20} className="text-indigo-400" />
              </div>
              <h4 className="font-bold mb-2">Missing a date?</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Automated extraction is highly accurate. If something looks wrong, you can manually edit or add events.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Manual Event</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              const rawDate = formData.get('date') as string;
              const category = formData.get('category') as EventCategory;
              
              let dateObj = new Date(NaN);
              if (rawDate) {
                const [year, month, day] = rawDate.split('-');
                dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              }
              
              setEvents([...events, {
                id: Date.now().toString(),
                title,
                date: dateObj,
                rawDate: rawDate || "TBA",
                category
              }]);
              setShowAddModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Event Title</label>
                  <input required name="title" className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Extra Credit Project" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Date (Optional)</label>
                  <input type="date" name="date" className="w-full border rounded-lg p-2 text-sm text-slate-700 font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select name="category" className="w-full border rounded-lg p-2 text-sm bg-white text-slate-700">
                    <option value="Exam">Exam</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Add Event</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
