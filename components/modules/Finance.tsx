'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  IndianRupee, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download,
  PieChart,
  Wallet,
  CreditCard,
  Banknote,
  X,
  ArrowRight,
  BarChart3,
  History,
  Target
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const FinanceModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const isDark = theme === 'dark';

  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: 0,
    type: 'income',
    category: 'Sales'
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'financial_transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'financial_transactions'), {
        ...newTransaction,
        date: Timestamp.now()
      });
      setShowAddModal(false);
      setNewTransaction({ description: '', amount: 0, type: 'income', category: 'Sales' });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Financial Management
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Track your village&apos;s financial health and profitability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className={cn(
            "p-3 rounded-2xl border transition-all",
            isDark ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white" : "bg-white border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm"
          )}>
            <Download size={20} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            activeTab === 'overview' 
              ? "bg-white dark:bg-gray-700 text-[#F27D26] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <PieChart size={16} />
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            activeTab === 'transactions' 
              ? "bg-white dark:bg-gray-700 text-[#F27D26] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <History size={16} />
          History
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            activeTab === 'budget' 
              ? "bg-white dark:bg-gray-700 text-[#F27D26] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <Target size={16} />
          Budget
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Main Balance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-10 bg-[#F27D26] rounded-[40px] text-white shadow-2xl shadow-[#F27D26]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet size={200} />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Total Balance</p>
                <h3 className="text-5xl font-black mb-8">₹{balance.toLocaleString()}</h3>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Income</p>
                    <p className="text-xl font-black flex items-center gap-2">
                      <ArrowUpRight size={20} className="text-green-300" />
                      ₹{totalIncome.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Expenses</p>
                    <p className="text-xl font-black flex items-center gap-2">
                      <ArrowDownRight size={20} className="text-red-300" />
                      ₹{totalExpense.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-8 rounded-[40px] border flex flex-col justify-between",
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"
            )}>
              <div>
                <h4 className={cn("text-lg font-black mb-4", isDark ? "text-white" : "text-gray-900")}>Quick Actions</h4>
                <div className="space-y-3">
                  <QuickActionButton icon={<CreditCard size={18} />} label="Pay Salaries" isDark={isDark} />
                  <QuickActionButton icon={<Banknote size={18} />} label="Buy Materials" isDark={isDark} />
                  <QuickActionButton icon={<TrendingUp size={18} />} label="View Reports" isDark={isDark} />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 font-medium">Last sync: Just now</p>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinanceStatCard 
              title="Profit Margin" 
              value="24.5%" 
              trend="+2.1%" 
              icon={<BarChart3 className="text-blue-500" />} 
              isDark={isDark} 
            />
            <FinanceStatCard 
              title="Operating Costs" 
              value="₹45,200" 
              trend="-5.4%" 
              icon={<TrendingDown className="text-red-500" />} 
              isDark={isDark} 
            />
            <FinanceStatCard 
              title="Cash Flow" 
              value="₹79,300" 
              trend="+12%" 
              icon={<TrendingUp className="text-green-500" />} 
              isDark={isDark} 
            />
          </div>
        </>
      ) : activeTab === 'transactions' ? (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-white border-gray-200 text-gray-900 focus:border-[#F27D26]"
              )}
            />
          </div>

          <div className={cn(
            "rounded-[32px] border overflow-hidden",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"
          )}>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      t.type === 'income' ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                    )}>
                      {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <p className={cn("font-black", isDark ? "text-white" : "text-gray-900")}>{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.category}</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {t.date?.toDate ? t.date.toDate().toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-black",
                      t.type === 'income' ? "text-green-500" : "text-red-500"
                    )}>
                      {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div className="p-20 text-center">
                  <Banknote size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
          <Target size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className={cn("text-xl font-black mb-2", isDark ? "text-white" : "text-gray-900")}>Budget Planning</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">Set financial goals and track your spending limits for each module.</p>
          <button className="mt-6 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm">
            Create Budget
          </button>
        </div>
      )}

      {/* Add Transaction Modal */}
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
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Add Transaction</h3>
                    <p className="text-sm text-gray-500 mt-1">Record a new financial entry for the village.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddTransaction} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <input 
                      type="text" 
                      required
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="e.g., Sale of Honey Batch #102"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</label>
                      <select 
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <select 
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      )}
                    >
                      <option value="Sales">Sales</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Save Transaction <ArrowRight size={20} />
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

const FinanceStatCard = ({ title, value, trend, icon, isDark }: any) => (
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
      <div className="flex items-baseline gap-2">
        <p className={cn("text-xl font-black", isDark ? "text-white" : "text-gray-900")}>{value}</p>
        <span className={cn(
          "text-[10px] font-black",
          trend.startsWith('+') ? "text-green-500" : "text-red-500"
        )}>{trend}</span>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, isDark }: any) => (
  <button className={cn(
    "w-full p-4 rounded-2xl border flex items-center gap-3 transition-all font-bold text-sm",
    isDark ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
  )}>
    {icon}
    {label}
  </button>
);

export default FinanceModule;
