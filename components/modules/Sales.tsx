'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronRight,
  TrendingUp,
  Users,
  Megaphone,
  Target,
  BarChart3,
  Globe,
  X,
  ArrowRight,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const SalesModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const isDark = theme === 'dark';

  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'marketing'>('orders');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    totalAmount: 0,
    status: 'pending',
    items: ''
  });

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'sales_orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'sales_orders'), {
        ...newOrder,
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: Timestamp.now()
      });
      setShowAddModal(false);
      setNewOrder({ customerName: '', totalAmount: 0, status: 'pending', items: '' });
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Sales & Marketing
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Grow your village brand and manage customer orders globally.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#F27D26] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all"
          >
            <Plus size={18} />
            New Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('orders')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            activeTab === 'orders' 
              ? "bg-white dark:bg-gray-700 text-[#F27D26] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <ShoppingBag size={16} />
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('marketing')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
            activeTab === 'marketing' 
              ? "bg-white dark:bg-gray-700 text-[#F27D26] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <Megaphone size={16} />
          Marketing
        </button>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SalesStatCard 
              title="Total Revenue" 
              value="₹1,24,500" 
              icon={<TrendingUp className="text-green-500" />} 
              isDark={isDark}
            />
            <SalesStatCard 
              title="Active Orders" 
              value={orders.length.toString()} 
              icon={<Package className="text-blue-500" />} 
              isDark={isDark}
            />
            <SalesStatCard 
              title="New Customers" 
              value="12" 
              icon={<Users className="text-purple-500" />} 
              isDark={isDark}
            />
            <SalesStatCard 
              title="Avg. Order Value" 
              value="₹2,450" 
              icon={<CreditCard className="text-orange-500" />} 
              isDark={isDark}
            />
          </div>

          {/* Controls */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by customer or order ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-white border-gray-200 text-gray-900 focus:border-[#F27D26]"
              )}
            />
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <motion.div 
                key={order.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "p-8 rounded-[32px] border shadow-sm transition-all group relative overflow-hidden",
                  isDark ? "bg-gray-800 border-gray-700 hover:border-[#F27D26]/50" : "bg-white border-gray-100 hover:border-[#F27D26]/50"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    order.status === 'delivered' ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  )}>
                    {order.status}
                  </div>
                  <span className="text-xs font-bold text-gray-400">#{order.orderId}</span>
                </div>

                <h3 className={cn("text-xl font-black mb-2", isDark ? "text-white" : "text-gray-900")}>
                  {order.customerName}
                </h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  {order.items || 'General Village Products'}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Amount</p>
                    <p className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>₹{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black text-[#F27D26] hover:underline">
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarketingCard 
            title="Global Reach" 
            description="Your products are being viewed in 12 different countries."
            icon={<Globe className="text-blue-500" />}
            isDark={isDark}
          />
          <MarketingCard 
            title="Campaign Performance" 
            description="The 'Village Harvest' campaign has a 4.2% conversion rate."
            icon={<Target className="text-red-500" />}
            isDark={isDark}
          />
          <MarketingCard 
            title="Social Engagement" 
            description="Instagram followers grew by 15% this month."
            icon={<BarChart3 className="text-purple-500" />}
            isDark={isDark}
          />
        </div>
      )}

      {/* Add Order Modal */}
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
                    <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>Create New Order</h3>
                    <p className="text-sm text-gray-500 mt-1">Record a new sale for your village products.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddOrder} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Ordered</label>
                    <input 
                      type="text" 
                      required
                      value={newOrder.items}
                      onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="e.g., 5kg Organic Honey, 2 Silk Scarves"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={newOrder.totalAmount}
                        onChange={(e) => setNewOrder({...newOrder, totalAmount: Number(e.target.value)})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                          isDark ? "bg-gray-800 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                        )}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</label>
                      <select 
                        value={newOrder.status}
                        onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border outline-none transition-all",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                        )}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-3 text-lg"
                  >
                    Confirm Order <ArrowRight size={20} />
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

const SalesStatCard = ({ title, value, icon, isDark }: any) => (
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

const MarketingCard = ({ title, description, icon, isDark }: any) => (
  <div className={cn(
    "p-8 rounded-[32px] border shadow-sm transition-all flex flex-col items-center text-center",
    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
  )}>
    <div className={cn(
      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
      isDark ? "bg-gray-700" : "bg-gray-50"
    )}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className={cn("text-xl font-black mb-3", isDark ? "text-white" : "text-gray-900")}>{title}</h3>
    <p className="text-sm text-gray-500 font-medium leading-relaxed">{description}</p>
  </div>
);

export default SalesModule;
