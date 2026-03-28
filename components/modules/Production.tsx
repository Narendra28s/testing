'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  History,
  TrendingUp,
  X,
  FileText,
  Download
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, addDoc, query, onSnapshot, orderBy, Timestamp, where } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const ProductionModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const user = context?.user;
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'batches' | 'inventory'>('batches');
  const [batches, setBatches] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([
    { id: '1', name: 'Raw Cotton', stock: 450, unit: 'kg', minStock: 100, status: 'in-stock' },
    { id: '2', name: 'Organic Honey', stock: 120, unit: 'liters', minStock: 50, status: 'in-stock' },
    { id: '3', name: 'Natural Dye (Blue)', stock: 15, unit: 'kg', minStock: 20, status: 'low-stock' },
    { id: '4', name: 'Silk Thread', stock: 85, unit: 'spools', minStock: 30, status: 'in-stock' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newBatch, setNewBatch] = useState({
    productName: '',
    quantity: 0,
    unit: 'kg',
    status: 'pending',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'production_batches'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'production_batches'), {
        ...newBatch,
        batchId: `BT-${Date.now().toString().slice(-6)}`,
        createdAt: Timestamp.now(),
        createdBy: user?.uid || 'anonymous',
        progress: 0
      });
      setShowAddModal(false);
      setNewBatch({ productName: '', quantity: 0, unit: 'kg', status: 'pending', priority: 'medium', notes: '' });
    } catch (error) {
      console.error("Error adding batch:", error);
    }
  };

  const filteredBatches = batches.filter(b => 
    b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.batchId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Production & Inventory
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Streamline your village manufacturing and stock management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
          >
            <Plus size={18} />
            New Batch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl w-fit border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <button 
          onClick={() => setActiveTab('batches')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'batches' 
              ? (isDark ? "bg-gray-800 text-white shadow-lg" : "bg-white text-gray-900 shadow-sm")
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <Layers size={16} />
          Production Batches
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'inventory' 
              ? (isDark ? "bg-gray-800 text-white shadow-lg" : "bg-white text-gray-900 shadow-sm")
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <Package size={16} />
          Inventory Stock
        </button>
      </div>

      {activeTab === 'batches' ? (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStat 
              title="Active Batches" 
              value={batches.filter(b => b.status === 'in-progress').length.toString()} 
              icon={<Clock className="text-blue-500" />} 
              isDark={isDark}
            />
            <QuickStat 
              title="Completed Today" 
              value="12" 
              icon={<CheckCircle2 className="text-green-500" />} 
              isDark={isDark}
            />
            <QuickStat 
              title="Efficiency Rate" 
              value="94.2%" 
              icon={<TrendingUp className="text-purple-500" />} 
              isDark={isDark}
            />
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Batch ID or Product..." 
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
                Export
              </button>
            </div>
          </div>

          {/* Batches List */}
          <div className={cn(
            "rounded-3xl border overflow-hidden",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"
          )}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={cn(
                    "text-[10px] uppercase tracking-widest font-bold",
                    isDark ? "bg-gray-900/50 text-gray-500" : "bg-gray-50 text-gray-400"
                  )}>
                    <th className="px-8 py-4">Batch ID</th>
                    <th className="px-8 py-4">Product Name</th>
                    <th className="px-8 py-4">Quantity</th>
                    <th className="px-8 py-4">Priority</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date Started</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.id} className={cn(
                      "group transition-colors",
                      isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                    )}>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-[#F27D26]">{batch.batchId}</span>
                      </td>
                      <td className="px-8 py-5">
                        <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>{batch.productName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Village Workshop A</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>
                          {batch.quantity} {batch.unit}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          batch.priority === 'high' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {batch.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            batch.status === 'completed' ? "bg-green-500" : batch.status === 'in-progress' ? "bg-blue-500" : "bg-orange-500"
                          )}></div>
                          <span className={cn("text-xs font-bold capitalize", isDark ? "text-gray-300" : "text-gray-700")}>
                            {batch.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-400">
                        {batch.createdAt?.toDate ? batch.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "p-6 rounded-3xl border shadow-sm transition-all",
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    item.status === 'low-stock' ? "bg-red-50 text-red-600" : "bg-[#F27D26]/10 text-[#F27D26]"
                  )}>
                    <Package size={20} />
                  </div>
                  {item.status === 'low-stock' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      <AlertCircle size={10} />
                      Low Stock
                    </span>
                  )}
                </div>
                <h4 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>{item.name}</h4>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Current Stock</p>
                    <p className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>
                      {item.stock} <span className="text-sm font-medium text-gray-400">{item.unit}</span>
                    </p>
                  </div>
                  <button className="text-xs font-bold text-[#F27D26] hover:underline">Reorder</button>
                </div>
                <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", item.status === 'low-stock' ? "bg-red-500" : "bg-green-500")}
                    style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
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
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Initialize New Batch</h3>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details to start village production.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddBatch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={newBatch.productName}
                        onChange={(e) => setNewBatch({...newBatch, productName: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="e.g., Organic Honey"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          required
                          value={newBatch.quantity}
                          onChange={(e) => setNewBatch({...newBatch, quantity: parseInt(e.target.value)})}
                          className={cn(
                            "flex-1 px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                            isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                          )}
                          placeholder="0"
                        />
                        <select 
                          value={newBatch.unit}
                          onChange={(e) => setNewBatch({...newBatch, unit: e.target.value})}
                          className={cn(
                            "w-24 px-2 py-4 rounded-2xl border outline-none transition-all",
                            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                          )}
                        >
                          <option value="kg">kg</option>
                          <option value="liters">L</option>
                          <option value="units">Units</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Priority Level</label>
                      <select 
                        value={newBatch.priority}
                        onChange={(e) => setNewBatch({...newBatch, priority: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Initial Status</label>
                      <select 
                        value={newBatch.status}
                        onChange={(e) => setNewBatch({...newBatch, status: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="pending">Pending Approval</option>
                        <option value="in-progress">Immediate Start</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Production Notes</label>
                    <textarea 
                      value={newBatch.notes}
                      onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all h-24 resize-none",
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      )}
                      placeholder="Add any special instructions..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Start Production <ArrowRight size={20} />
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

const QuickStat = ({ title, value, icon, isDark }: any) => (
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

export default ProductionModule;
