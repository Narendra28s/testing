'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  Award,
  ChevronRight,
  Star,
  X,
  ArrowRight,
  Layers,
  BarChart3
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const TrainingModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const isDark = theme === 'dark';

  const [modules, setModules] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    category: 'Agriculture',
    duration: '2 Weeks',
    instructor: 'Village Expert',
    level: 'Beginner'
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'training_courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setModules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'training_courses'), {
        ...newModule,
        enrolled: 0,
        rating: 4.8,
        createdAt: Timestamp.now(),
        status: 'active'
      });
      setShowAddModal(false);
      setNewModule({ title: '', description: '', category: 'Agriculture', duration: '2 Weeks', instructor: 'Village Expert', level: 'Beginner' });
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Training & Skills
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Empower your village workforce with modern skills and certifications.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TrainingStatCard 
          title="Active Courses" 
          value={modules.length.toString()} 
          icon={<BookOpen className="text-blue-500" />} 
          isDark={isDark}
        />
        <TrainingStatCard 
          title="Total Enrolled" 
          value="156" 
          icon={<Users className="text-green-500" />} 
          isDark={isDark}
        />
        <TrainingStatCard 
          title="Certifications" 
          value="42" 
          icon={<Award className="text-yellow-500" />} 
          isDark={isDark}
        />
        <TrainingStatCard 
          title="Avg. Progress" 
          value="72%" 
          icon={<BarChart3 className="text-purple-500" />} 
          isDark={isDark}
        />
      </div>

      {/* Controls */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search courses or categories..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
            isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-white border-gray-200 text-gray-900 focus:border-[#F27D26]"
          )}
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <motion.div 
            key={module.id}
            whileHover={{ y: -4 }}
            className={cn(
              "p-8 rounded-[32px] border shadow-sm transition-all group relative overflow-hidden flex flex-col",
              isDark ? "bg-gray-800 border-gray-700 hover:border-[#F27D26]/50" : "bg-white border-gray-100 hover:border-[#F27D26]/50"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <span className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                isDark ? "bg-gray-700 text-[#F27D26]" : "bg-orange-50 text-[#F27D26]"
              )}>
                {module.category}
              </span>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-gray-400">{module.rating || '4.8'}</span>
              </div>
            </div>

            <h3 className={cn("text-xl font-black mb-3", isDark ? "text-white" : "text-gray-900")}>
              {module.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">
              {module.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Clock size={14} className="text-[#F27D26]" />
                {module.duration}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Layers size={14} className="text-[#F27D26]" />
                {module.level || 'Beginner'}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Users size={14} className="text-[#F27D26]" />
                {module.enrolled || 24} Enrolled
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Award size={14} className="text-[#F27D26]" />
                Certificate
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Users size={14} className="text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-500">{module.instructor || 'Village Expert'}</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-black text-[#F27D26] hover:underline">
                Start Learning <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden",
                isDark ? "bg-gray-900 border border-gray-800" : "bg-white"
              )}
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Create New Course</h3>
                    <p className="text-sm text-gray-500 mt-1">Design a new training program for the community.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddModule} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Title</label>
                    <input 
                      type="text" 
                      required
                      value={newModule.title}
                      onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="e.g., Advanced Organic Farming"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newModule.description}
                      onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="Describe what workers will learn..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                      <select 
                        value={newModule.category}
                        onChange={(e) => setNewModule({...newModule, category: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="Agriculture">Agriculture</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Dairy">Dairy</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</label>
                      <input 
                        type="text" 
                        required
                        value={newModule.duration}
                        onChange={(e) => setNewModule({...newModule, duration: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="e.g., 2 Weeks"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Publish Course <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrainingStatCard = ({ title, value, icon, isDark }: any) => (
  <div className={cn(
    "p-6 rounded-3xl border flex items-center gap-4 transition-all",
    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"
  )}>
    <div className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
      isDark ? "bg-gray-700" : "bg-gray-50"
    )}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{title}</p>
      <p className={cn("text-xl font-black", isDark ? "text-white" : "text-gray-900")}>{value}</p>
    </div>
  </div>
);

export default TrainingModule;
