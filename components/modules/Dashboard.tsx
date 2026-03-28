'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  IndianRupee,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const DashboardModule: React.FC = () => {
  const context = useContext(ERPContext);
  const theme = context?.theme || 'dark';
  const profile = context?.profile;
  const isDark = theme === 'dark';

  const [stats, setStats] = useState({
    totalSales: 125400,
    activeWorkers: 45,
    inventoryCount: 120,
    productionBatches: 8,
    revenueGrowth: '+12.5%',
    workerGrowth: '+3',
    inventoryTrend: '-5%',
    batchStatus: 'Stable'
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!context) return;
    const q = query(collection(db, 'production_batches'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'production',
        title: `New Batch: ${doc.data().productName}`,
        time: 'Just now',
        status: doc.data().status,
        ...doc.data()
      }));
      setRecentActivity(activities);
    });

    return () => unsubscribe();
  }, [context]);

  if (!context) return null;

  const performanceData = [
    { name: 'Mon', sales: 4000, production: 2400, revenue: 3200 },
    { name: 'Tue', sales: 3000, production: 1398, revenue: 2800 },
    { name: 'Wed', sales: 2000, production: 9800, revenue: 4500 },
    { name: 'Thu', sales: 2780, production: 3908, revenue: 3100 },
    { name: 'Fri', sales: 1890, production: 4800, revenue: 2900 },
    { name: 'Sat', sales: 2390, production: 3800, revenue: 3400 },
    { name: 'Sun', sales: 3490, production: 4300, revenue: 4100 },
  ];

  const categoryData = [
    { name: 'Handicrafts', value: 400 },
    { name: 'Agriculture', value: 300 },
    { name: 'Textiles', value: 300 },
    { name: 'Dairy', value: 200 },
  ];

  const COLORS = ['#F27D26', '#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Village Dashboard
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Welcome back, {profile?.name}. Here&apos;s what&apos;s happening in your village today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium", isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600")}>
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="bg-[#F27D26] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#F27D26]/20 hover:bg-[#D96C1F] transition-all">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalSales.toLocaleString()}`} 
          icon={<IndianRupee className="w-5 h-5" />} 
          trend={stats.revenueGrowth} 
          isDark={isDark}
          color="blue"
        />
        <StatCard 
          title="Active Workforce" 
          value={stats.activeWorkers.toString()} 
          icon={<Users className="w-5 h-5" />} 
          trend={stats.workerGrowth} 
          isDark={isDark}
          color="purple"
        />
        <StatCard 
          title="Inventory Items" 
          value={stats.inventoryCount.toString()} 
          icon={<Package className="w-5 h-5" />} 
          trend={stats.inventoryTrend} 
          isDark={isDark}
          color="orange"
        />
        <StatCard 
          title="Active Batches" 
          value={stats.productionBatches.toString()} 
          icon={<ShoppingCart className="w-5 h-5" />} 
          trend={stats.batchStatus} 
          isDark={isDark}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "lg:col-span-2 p-8 rounded-3xl border shadow-sm transition-colors duration-300",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                Performance Analytics
              </h3>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                Weekly production vs sales comparison
              </p>
            </div>
            <select className={cn(
              "text-xs font-bold border-none rounded-lg px-3 py-2 focus:ring-0",
              isDark ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-600"
            )}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#F1F1F1"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: isDark ? '#9CA3AF' : '#6B7280'}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="sales" stroke="#F27D26" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-8 rounded-3xl border shadow-sm transition-colors duration-300",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          )}
        >
          <h3 className={cn("text-lg font-bold mb-8", isDark ? "text-white" : "text-gray-900")}>
            Revenue by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>{item.name}</span>
                </div>
                <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {Math.round((item.value / 1200) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-8 rounded-3xl border shadow-sm transition-colors duration-300",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
              Recent Activity
            </h3>
            <button className="text-sm font-bold text-[#F27D26] hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                  isDark ? "bg-gray-700" : "bg-orange-50"
                )}>
                  <Clock size={18} className="text-[#F27D26]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {activity.title}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">2h ago</span>
                  </div>
                  <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                    Status: <span className="text-[#F27D26] font-bold uppercase tracking-wider">{activity.status}</span>
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No recent activity detected</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Insights / Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-8 rounded-3xl border shadow-sm transition-colors duration-300",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          )}
        >
          <h3 className={cn("text-lg font-bold mb-8", isDark ? "text-white" : "text-gray-900")}>
            Critical Alerts
          </h3>
          <div className="space-y-4">
            <AlertItem 
              title="Low Inventory: Raw Cotton" 
              desc="Stock level below 15%. Reorder recommended." 
              type="warning" 
              isDark={isDark}
            />
            <AlertItem 
              title="Training Deadline Approaching" 
              desc="3 workers haven't completed safety certification." 
              type="info" 
              isDark={isDark}
            />
            <AlertItem 
              title="Compliance Document Expiring" 
              desc="Village Trade License expires in 12 days." 
              type="danger" 
              isDark={isDark}
            />
            <AlertItem 
              title="Production Target Met" 
              desc="Batch #BT-204 completed 4 hours ahead of schedule." 
              type="success" 
              isDark={isDark}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, isDark, color }: any) => {
  const isPositive = trend.startsWith('+');
  const isNeutral = trend === 'Stable';
  
  const colorClasses: any = {
    blue: isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600",
    purple: isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600",
    orange: isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600",
    green: isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn(
        "p-6 rounded-3xl border shadow-sm transition-all duration-300",
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", colorClasses[color])}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
          isNeutral ? "bg-gray-100 text-gray-500" : isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {isNeutral ? null : isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>{title}</p>
      <h4 className={cn("text-2xl font-black mt-1", isDark ? "text-white" : "text-gray-900")}>{value}</h4>
    </motion.div>
  );
};

const AlertItem = ({ title, desc, type, isDark }: any) => {
  const typeClasses: any = {
    warning: "border-orange-500/20 bg-orange-500/5 text-orange-600",
    info: "border-blue-500/20 bg-blue-500/5 text-blue-600",
    danger: "border-red-500/20 bg-red-500/5 text-red-600",
    success: "border-green-500/20 bg-green-500/5 text-green-600",
  };

  return (
    <div className={cn(
      "p-4 rounded-2xl border flex gap-4 items-start transition-all",
      typeClasses[type],
      isDark && "bg-opacity-10"
    )}>
      <div className="mt-1">
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className={cn("text-xs mt-0.5 opacity-80", isDark ? "text-gray-300" : "text-gray-600")}>{desc}</p>
      </div>
    </div>
  );
};

export default DashboardModule;
