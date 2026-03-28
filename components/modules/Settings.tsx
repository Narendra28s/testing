'use client';

import React, { useState, useContext } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  UserCircle
} from 'lucide-react';
import { db, auth } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ERPContext } from '@/components/ERPLayout';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const SettingsModule: React.FC = () => {
  const context = useContext(ERPContext);
  if (!context) return null;
  const { theme, profile, setProfile } = context;
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    photoURL: profile?.photoURL || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', profile.uid);
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(userRef, updatedData);
      
      if (setProfile) {
        setProfile({ ...profile, ...formData });
      }
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Account Settings
          </h2>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Manage your profile, preferences, and village identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsNavButton icon={<User size={18} />} label="Profile Information" active isDark={isDark} />
          <SettingsNavButton icon={<Lock size={18} />} label="Security & Password" isDark={isDark} />
          <SettingsNavButton icon={<Bell size={18} />} label="Notifications" isDark={isDark} />
          <SettingsNavButton icon={<Globe size={18} />} label="Language & Region" isDark={isDark} />
          <SettingsNavButton icon={<Shield size={18} />} label="Privacy Policy" isDark={isDark} />
          
          <div className={cn("pt-4 mt-4 border-t", isDark ? "border-gray-800" : "border-gray-100")}>
            <button 
              onClick={() => auth.signOut()}
              className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
            >
              <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" /> 
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-8 rounded-[32px] border shadow-sm transition-all",
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              <div className="relative group self-center md:self-start">
                <div className={cn(
                  "w-32 h-32 rounded-[32px] flex items-center justify-center overflow-hidden border-4 shadow-xl transition-transform group-hover:scale-[1.02]",
                  isDark ? "bg-gray-700 border-gray-800" : "bg-gray-50 border-white"
                )}>
                  {formData.photoURL ? (
                    <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={64} className="text-gray-300" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-[#F27D26] text-white rounded-2xl shadow-lg hover:bg-[#D96C1F] transition-all hover:scale-110 active:scale-95">
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h3 className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>{profile?.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{profile?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  <span className="px-3 py-1 bg-[#F27D26]/10 text-[#F27D26] text-[10px] font-black rounded-lg uppercase tracking-widest">
                    {profile?.role.replace('_', ' ')}
                  </span>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest",
                    isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                  )}>
                    ID: {profile?.uid.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-2",
                  message.type === 'success' 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                )}
              >
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-bold">{message.text}</p>
              </motion.div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={cn(
                        "w-full pl-12 pr-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-900 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={cn(
                        "w-full pl-12 pr-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                        isDark ? "bg-gray-900 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                      )}
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>Short Bio</label>
                <textarea 
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl border outline-none transition-all h-24 resize-none focus:ring-2 focus:ring-[#F27D26]/20",
                    isDark ? "bg-gray-900 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                  )}
                  placeholder="Tell us about your role in the village..."
                />
              </div>

              <div className="space-y-2">
                <label className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>Village Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-5 text-gray-400" />
                  <textarea 
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={cn(
                      "w-full pl-12 pr-6 py-4 rounded-2xl border outline-none transition-all h-20 resize-none focus:ring-2 focus:ring-[#F27D26]/20",
                      isDark ? "bg-gray-900 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                    )}
                    placeholder="Sector, Village Name, District..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-gray-500" : "text-gray-400")}>Profile Photo URL</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="url" 
                    value={formData.photoURL}
                    onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
                    className={cn(
                      "w-full pl-12 pr-6 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-[#F27D26]/20",
                      isDark ? "bg-gray-900 border-gray-700 text-white focus:border-[#F27D26]" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F27D26]"
                    )}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-3 px-10 py-4 bg-[#F27D26] text-white font-black rounded-2xl hover:bg-[#D96C1F] transition-all shadow-xl shadow-[#F27D26]/20 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={20} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SettingsNavButton = ({ icon, label, active, isDark }: any) => (
  <button className={cn(
    "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group",
    active 
      ? "bg-[#F27D26] text-white shadow-lg shadow-[#F27D26]/20" 
      : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
  )}>
    <div className="flex items-center">
      <span className={cn("mr-4 transition-transform group-hover:scale-110", active ? "text-white" : "text-gray-400 group-hover:text-[#F27D26]")}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    <ChevronRight size={16} className={cn("transition-transform group-hover:translate-x-1", active ? "text-white/60" : "text-gray-400")} />
  </button>
);

export default SettingsModule;
