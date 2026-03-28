'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Download,
  MoreVertical,
  ExternalLink,
  X,
  ArrowRight,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const ComplianceModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const isDark = theme === 'dark';

  const [docs, setDocs] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newDoc, setNewDoc] = useState({
    title: '',
    type: 'License',
    status: 'active',
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'compliance_docs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'compliance_docs'), {
        ...newDoc,
        createdAt: Timestamp.now()
      });
      setShowAddModal(false);
      setNewDoc({ title: '', type: 'License', status: 'active', expiryDate: '', description: '' });
    } catch (error) {
      console.error("Error adding doc:", error);
    }
  };

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Compliance & Legal
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Manage certifications, licenses, and legal documentation for your village enterprise.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
        >
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-6 rounded-3xl border flex items-start gap-4",
            isDark ? "bg-orange-950/20 border-orange-900/50" : "bg-orange-50 border-orange-100"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="text-orange-600" size={20} />
          </div>
          <div>
            <h4 className={cn("text-sm font-black uppercase tracking-widest", isDark ? "text-orange-400" : "text-orange-800")}>
              License Expiring Soon
            </h4>
            <p className={cn("text-xs mt-1 leading-relaxed", isDark ? "text-orange-300/70" : "text-orange-700/70")}>
              The &quot;Organic Certification&quot; for Village Unit A expires in 12 days. Please initiate renewal to avoid production halts.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-6 rounded-3xl border flex items-start gap-4",
            isDark ? "bg-green-950/20 border-green-900/50" : "bg-green-50 border-green-100"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
            <FileCheck className="text-green-600" size={20} />
          </div>
          <div>
            <h4 className={cn("text-sm font-black uppercase tracking-widest", isDark ? "text-green-400" : "text-green-800")}>
              All Audits Passed
            </h4>
            <p className={cn("text-xs mt-1 leading-relaxed", isDark ? "text-green-300/70" : "text-green-700/70")}>
              The quarterly safety and hygiene audit was completed successfully on March 15th, 2026. No non-conformities found.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search documents or types..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
            isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-white border-gray-200 text-gray-900 focus:border-[#F27D26]"
          )}
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <motion.div 
            key={doc.id}
            whileHover={{ y: -4 }}
            className={cn(
              "p-8 rounded-[32px] border shadow-sm transition-all group relative overflow-hidden flex flex-col",
              isDark ? "bg-gray-800 border-gray-700 hover:border-[#F27D26]/50" : "bg-white border-gray-100 hover:border-[#F27D26]/50"
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "p-4 rounded-2xl",
                isDark ? "bg-gray-700" : "bg-orange-50"
              )}>
                <FileText className="text-[#F27D26]" size={24} />
              </div>
              <div className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                doc.status === 'active' 
                  ? (isDark ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-600")
                  : (isDark ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600")
              )}>
                {doc.status}
              </div>
            </div>
            
            <h3 className={cn("text-xl font-black mb-1", isDark ? "text-white" : "text-gray-900")}>
              {doc.title}
            </h3>
            <span className="text-xs text-[#F27D26] font-bold uppercase tracking-widest mb-4 block">
              {doc.type}
            </span>
            
            <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">
              {doc.description || 'No description provided for this legal document.'}
            </p>

            <div className="grid grid-cols-1 gap-3 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Calendar size={14} className="text-[#F27D26]" />
                Expires: {doc.expiryDate || 'Permanent'}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Clock size={14} className="text-[#F27D26]" />
                Added: {doc.createdAt?.toDate().toLocaleDateString() || 'Recently'}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-[#F27D26] transition-colors">
                <Download size={14} /> Download PDF
              </button>
              <button className="flex items-center gap-2 text-xs font-black text-[#F27D26] hover:underline">
                View Details <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
        {filteredDocs.length === 0 && (
          <div className={cn(
            "md:col-span-2 lg:col-span-3 py-20 text-center border-2 border-dashed rounded-[40px]",
            isDark ? "border-gray-800" : "border-gray-100"
          )}>
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={cn("text-xl font-black", isDark ? "text-white" : "text-gray-900")}>No Documents Found</h3>
            <p className="text-gray-500 mt-2">Start by uploading your first compliance document.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-6 text-[#F27D26] font-black hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              Upload Now <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add Doc Modal */}
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
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Upload Document</h3>
                    <p className="text-sm text-gray-500 mt-1">Add a new license or certification to the system.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddDoc} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Title</label>
                    <input 
                      type="text" 
                      required
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="e.g., FSSAI License"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</label>
                      <select 
                        value={newDoc.type}
                        onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="License">License</option>
                        <option value="Certification">Certification</option>
                        <option value="Legal">Legal</option>
                        <option value="Audit">Audit</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
                      <input 
                        type="date" 
                        value={newDoc.expiryDate}
                        onChange={(e) => setNewDoc({...newDoc, expiryDate: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                      />
                    </div>
                  </div>

                  <div className={cn(
                    "p-10 border-2 border-dashed rounded-3xl text-center transition-all",
                    isDark ? "border-gray-800 hover:border-[#F27D26]/50" : "border-gray-100 hover:border-[#F27D26]/50"
                  )}>
                    <Download className="w-10 h-10 text-gray-300 mx-auto mb-4 rotate-180" />
                    <p className="text-xs text-gray-500 font-bold">Drag and drop PDF here or click to browse</p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Upload Document <ArrowRight size={20} />
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

export default ComplianceModule;
