'use client';

import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '@/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Package, 
  GraduationCap, 
  ShoppingCart, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'motion/react';
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
  Cell
} from 'recharts';
import ERPLayout, { ERPContext } from '@/components/ERPLayout';
import Dashboard from '@/components/modules/Dashboard';
import Production from '@/components/modules/Production';
import HR from '@/components/modules/HR';
import Training from '@/components/modules/Training';
import Finance from '@/components/modules/Finance';
import Sales from '@/components/modules/Sales';
import Compliance from '@/components/modules/Compliance';
import Settings from '@/components/modules/Settings';
import Image from 'next/image';

// --- Main Page ---
export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-[#F27D26] rounded-2xl shadow-xl shadow-[#F27D26]/20"
      />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row overflow-hidden">
      <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-xl"
        >
          <div className="w-16 h-16 bg-[#F27D26] rounded-2xl flex items-center justify-center font-bold text-3xl text-white mb-12 shadow-2xl shadow-[#F27D26]/30">M</div>
          <h1 className="text-6xl font-bold text-[#151619] leading-tight mb-6 tracking-tighter">
            Empowering Villages, <br />
            <span className="text-[#F27D26]">One Batch at a Time.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            Professional ERP platform for &quot;Mera Pind Balle Balle&quot;. 
            Manage production, workforce, and finances with precision.
          </p>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-4 bg-[#151619] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-2xl shadow-black/20 group"
          >
            <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={24} height={24} />
            Sign in with Google
            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
      <div className="flex-1 bg-[#151619] relative lg:block hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F27D26] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="w-full aspect-square border border-white/10 rounded-3xl relative overflow-hidden bg-white/5 backdrop-blur-3xl p-8">
             <div className="grid grid-cols-2 gap-4 h-full">
               <div className="bg-white/5 rounded-2xl border border-white/10"></div>
               <div className="bg-white/5 rounded-2xl border border-white/10"></div>
               <div className="col-span-2 bg-white/5 rounded-2xl border border-white/10"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ERPLayout>
      <ERPContext.Consumer>
        {(context) => {
          if (!context) return null;
          const { activeModule } = context;
          
          switch(activeModule) {
            case 'dashboard': return <Dashboard />;
            case 'production': return <Production />;
            case 'hr': return <HR />;
            case 'training': return <Training />;
            case 'finance': return <Finance />;
            case 'sales': return <Sales />;
            case 'compliance': return <Compliance />;
            case 'settings': return <Settings />;
            default: return <Dashboard />;
          }
        }}
      </ERPContext.Consumer>
    </ERPLayout>
  );
}
