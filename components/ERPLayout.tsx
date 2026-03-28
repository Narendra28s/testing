'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Package, 
  GraduationCap, 
  ShoppingCart, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  Bell,
  User as UserIcon,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/components/ErrorBoundary';

import Image from 'next/image';

// --- Types ---
export type Role = 'admin' | 'village_head' | 'trainer' | 'worker';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  bio?: string;
  address?: string;
  photoURL?: string;
  villageId?: string;
  skills?: string[];
  createdAt: string;
}

// --- Translations ---
const translations = {
  en: {
    dashboard: "Dashboard",
    production: "Production & Inventory",
    training: "Training & Skills",
    sales: "Sales & Marketing",
    finance: "Financial Management",
    hr: "HR & Workforce",
    compliance: "Compliance & Legal",
    settings: "Settings",
    logout: "Logout",
    welcome: "Welcome",
    notifications: "Notifications",
    language: "Language",
    village: "Village",
    role: "Role",
    theme: "Theme"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    production: "उत्पादन और सूची",
    training: "प्रशिक्षण और कौशल",
    sales: "बिक्री और विपणन",
    finance: "वित्तीय प्रबंधन",
    hr: "एचआर और कार्यबल",
    compliance: "अनुपालन और कानूनी",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    notifications: "सूचनाएं",
    language: "भाषा",
    village: "गांव",
    role: "भूमिका",
    theme: "थीम"
  },
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    production: "ਉਤਪਾਦਨ ਅਤੇ ਵਸਤੂ ਸੂਚੀ",
    training: "ਸਿਖਲਾਈ ਅਤੇ ਹੁਨਰ",
    sales: "ਵਿੱਕਰੀ ਅਤੇ ਮਾਰਕੀਟਿੰਗ",
    finance: "ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ",
    hr: "ਐਚਆਰ ਅਤੇ ਵਰਕਫੋਰਸ",
    compliance: "ਪਾਲਣਾ ਅਤੇ ਕਾਨੂੰਨੀ",
    settings: "ਸੈਟਿੰਗਾਂ",
    logout: "ਲੌਗ ਆਉਟ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    language: "ਭਾਸ਼ਾ",
    village: "ਪਿੰਡ",
    role: "ਭੂਮਿਕਾ",
    theme: "ਥੀਮ"
  }
};

type Lang = keyof typeof translations;

// --- Context ---
export const ERPContext = React.createContext<{
  user: User | null;
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  activeModule: string;
  setActiveModule: (m: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
} | null>(null);

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: u.uid,
            name: u.displayName || 'User',
            email: u.email || '',
            role: 'worker',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'production', icon: Package, label: t.production },
    { id: 'training', icon: GraduationCap, label: t.training },
    { id: 'sales', icon: ShoppingCart, label: t.sales },
    { id: 'finance', icon: IndianRupee, label: t.finance },
    { id: 'hr', icon: Users, label: t.hr },
    { id: 'compliance', icon: ShieldCheck, label: t.compliance },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const isDark = theme === 'dark';

  if (!user) return <div className={cn("min-h-screen flex items-center justify-center transition-colors duration-300", isDark ? "bg-gray-900" : "bg-gray-50")}>{children}</div>;

  return (
    <ERPContext.Provider value={{ 
      user, 
      profile, 
      setProfile, 
      lang, 
      setLang, 
      activeModule, 
      setActiveModule,
      theme,
      toggleTheme
    }}>
      <ErrorBoundary>
        <div className={cn(
          "min-h-screen flex transition-colors duration-300 font-sans",
          isDark ? "bg-gray-900 text-white" : "bg-[#F8F9FA] text-[#1A1A1A]"
        )}>
          {/* Sidebar */}
          <AnimatePresence mode="wait">
            {(isSidebarOpen || !isMobile) && (
              <motion.aside
                initial={isMobile ? { x: -300 } : false}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={cn(
                  "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl lg:relative lg:translate-x-0 transition-all duration-300",
                  isDark ? "bg-[#151619] text-white" : "bg-white text-gray-900 border-r border-gray-200",
                  !isSidebarOpen && !isMobile && "w-20"
                )}
              >
                <div className={cn("p-6 flex items-center justify-between border-b", isDark ? "border-white/10" : "border-gray-100")}>
                  <div className={cn("flex items-center gap-3", !isSidebarOpen && !isMobile && "hidden")}>
                    <div className="w-10 h-10 bg-[#F27D26] rounded-lg flex items-center justify-center font-bold text-xl text-white">M</div>
                    <span className="font-bold text-lg tracking-tight">Mera Pind</span>
                  </div>
                  {isMobile && (
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                      <X size={20} />
                    </button>
                  )}
                </div>

                <nav className="mt-8 px-4 space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all group",
                        activeModule === item.id 
                          ? "bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/20" 
                          : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon size={22} className={cn("shrink-0", activeModule === item.id ? "text-white" : "group-hover:text-white")} />
                      {(isSidebarOpen || isMobile) && <span className="font-medium text-sm">{item.label}</span>}
                    </button>
                  ))}
                </nav>

                <div className="absolute bottom-8 left-0 w-full px-4 space-y-2">
                  <button 
                    onClick={toggleTheme}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl transition-all",
                      isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {isDark ? <Sun size={22} /> : <Moon size={22} />}
                    {(isSidebarOpen || isMobile) && <span className="font-medium text-sm">{t.theme}</span>}
                  </button>
                  <button 
                    onClick={() => auth.signOut()}
                    className="w-full flex items-center gap-4 p-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                  >
                    <LogOut size={22} />
                    {(isSidebarOpen || isMobile) && <span className="font-medium text-sm">{t.logout}</span>}
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <header className={cn(
              "h-20 border-b flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300",
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            )}>
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={24} />
                  </button>
                )}
                <h1 className={cn("text-xl font-bold lg:block hidden", isDark ? "text-white" : "text-gray-800")}>
                  {navItems.find(i => i.id === activeModule)?.label}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className={cn("flex items-center gap-2 p-1 rounded-lg border", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100")}>
                  {(['en', 'hi', 'pa'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                        lang === l 
                          ? isDark ? "bg-gray-700 text-[#F27D26] shadow-sm" : "bg-white text-[#F27D26] shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button className={cn("p-2 rounded-full relative", isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500")}>
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className={cn("h-10 w-px mx-2", isDark ? "bg-gray-800" : "bg-gray-200")}></div>

                <div className="flex items-center gap-3">
                  <div className="text-right lg:block hidden">
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>{profile?.name}</p>
                    <p className="text-[10px] font-bold text-[#F27D26] uppercase tracking-wider">{profile?.role.replace('_', ' ')}</p>
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border",
                    isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
                  )}>
                    {profile?.photoURL ? (
                      <Image src={profile.photoURL} alt={profile.name} width={40} height={40} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </ERPContext.Provider>
  );
}
