'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award,
  ChevronRight,
  UserCheck,
  UserX,
  Calendar,
  Star,
  X,
  ArrowRight,
  Download
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, where, addDoc, Timestamp } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

const HRModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const isDark = theme === 'dark';

  const [workers, setWorkers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'worker',
    department: 'Production',
    skills: [] as string[],
    salary: 0
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'users'), where('role', '==', 'worker'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWorkers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        ...newWorker,
        uid: `WRK-${Date.now().toString().slice(-6)}`,
        createdAt: Timestamp.now(),
        status: 'active',
        performance: 4.5
      });
      setShowAddModal(false);
      setNewWorker({ name: '', email: '', phone: '', role: 'worker', department: 'Production', skills: [], salary: 0 });
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            HR & Workforce
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Manage your village talent, attendance, and skills development.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
          >
            <Plus size={18} />
            Add Worker
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HRStatCard 
          title="Total Workforce" 
          value={workers.length.toString()} 
          icon={<Users className="text-blue-500" />} 
          isDark={isDark}
        />
        <HRStatCard 
          title="On Duty Today" 
          value="38" 
          icon={<UserCheck className="text-green-500" />} 
          isDark={isDark}
        />
        <HRStatCard 
          title="On Leave" 
          value="4" 
          icon={<UserX className="text-red-500" />} 
          isDark={isDark}
        />
        <HRStatCard 
          title="Avg. Performance" 
          value="4.8/5" 
          icon={<Star className="text-yellow-500" />} 
          isDark={isDark}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search workers by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
              isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-white border-gray-200 text-gray-900 focus:border-[#F27D26]"
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className={cn(
            "p-3 rounded-xl border flex items-center gap-2 text-sm font-bold",
            isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
          )}>
            <Filter size={18} />
            Filter
          </button>
          <button className={cn(
            "p-3 rounded-xl border flex items-center gap-2 text-sm font-bold",
            isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
          )}>
            <Download size={18} />
            Payroll Export
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <motion.div 
            key={worker.id}
            whileHover={{ y: -4 }}
            className={cn(
              "p-8 rounded-[32px] border shadow-sm transition-all group relative overflow-hidden",
              isDark ? "bg-gray-800 border-gray-700 hover:border-[#F27D26]/50" : "bg-white border-gray-100 hover:border-[#F27D26]/50"
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border-2",
                  isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-white"
                )}>
                  {worker.photoURL ? (
                    <Image src={worker.photoURL} alt={worker.name} width={64} height={64} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>{worker.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-[#F27D26] uppercase tracking-widest">{worker.role}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{worker.department || 'Production'}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <MoreVertical size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-xs font-medium text-gray-500">
                <Mail className="w-4 h-4 mr-3 text-[#F27D26]" /> {worker.email}
              </div>
              <div className="flex items-center text-xs font-medium text-gray-500">
                <Phone className="w-4 h-4 mr-3 text-[#F27D26]" /> {worker.phone || 'N/A'}
              </div>
              <div className="flex items-center text-xs font-medium text-gray-500">
                <MapPin className="w-4 h-4 mr-3 text-[#F27D26]" /> {worker.address || 'Village Center'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {(worker.skills || ['General Labor', 'Quality Check']).map((skill: string, idx: number) => (
                <span key={idx} className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider",
                  isDark ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"
                )}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className={cn("text-xs font-black", isDark ? "text-white" : "text-gray-900")}>{worker.performance || '4.5'}</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-black text-[#F27D26] hover:underline">
                View Profile <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Worker Modal */}
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
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Register New Worker</h3>
                    <p className="text-sm text-gray-500 mt-1">Onboard a new member to the village workforce.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddWorker} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={newWorker.name}
                        onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="e.g., Rajesh Kumar"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={newWorker.email}
                        onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="rajesh@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        value={newWorker.phone}
                        onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</label>
                      <select 
                        value={newWorker.department}
                        onChange={(e) => setNewWorker({...newWorker, department: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="Production">Production</option>
                        <option value="Quality Control">Quality Control</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Register Worker <ArrowRight size={20} />
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

const HRStatCard = ({ title, value, icon, isDark }: any) => (
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

export default HRModule;
