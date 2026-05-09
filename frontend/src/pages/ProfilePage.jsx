import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../api/userService';
import Sidebar from '../components/Sidebar';
import { User, Mail, Ruler, Weight, UserCircle, Save, Loader2, Zap, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    heightCm: '',
    weightKg: '',
    gender: '',
    bio: ''
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        heightCm: profile.heightCm || '',
        weightKg: profile.weightKg || '',
        gender: profile.gender || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Hero Section */}
        <div className="bg-slate-950 px-6 py-12 lg:px-12 lg:py-20 relative overflow-hidden">
           {/* Decorative Gradients */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
           
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-primary-400 border border-white/10 shadow-2xl">
                       <UserCircle size={64} strokeWidth={1} />
                    </div>
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 backdrop-blur-md rounded-full border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
                          <ShieldCheck size={12} fill="currentColor" />
                          Verified Athlete
                       </div>
                       <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight uppercase italic tabular-nums">
                          @{profile?.username}
                       </h2>
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1">
                          <Mail size={16} className="text-primary-500" />
                          {profile?.email}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 lg:p-12 -mt-10 lg:-mt-16 max-w-5xl mx-auto w-full relative z-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50">
              <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs text-center">Syncing Biometrics...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Stats Preview Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: 'Height', value: formData.heightCm ? `${formData.heightCm} cm` : '--', icon: Ruler, color: 'text-blue-500' },
                   { label: 'Weight', value: formData.weightKg ? `${formData.weightKg} kg` : '--', icon: Weight, color: 'text-emerald-500' },
                   { label: 'Gender', value: formData.gender || '--', icon: User, color: 'text-purple-500' },
                   { label: 'Activity', value: 'Active', icon: Activity, color: 'text-amber-500' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-lg shadow-slate-200/40">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="flex items-center gap-3">
                         <stat.icon size={18} className={stat.color} />
                         <span className="text-xl font-black text-slate-950 uppercase tracking-tight">{stat.value}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-6 bg-white border border-slate-200/60 p-8 lg:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-slate-950 rounded-xl text-white">
                        <User size={20} />
                     </div>
                     <h3 className="font-black uppercase tracking-tight text-slate-950 italic">Personal Intel</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">First Identity</label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Last Identity</label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                        placeholder="Last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Gender Class</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Physical Metrics */}
                <div className="space-y-6 bg-white border border-slate-200/60 p-8 lg:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-primary-600 rounded-xl text-white">
                        <Zap size={20} />
                     </div>
                     <h3 className="font-black uppercase tracking-tight text-slate-950 italic">Physical Matrix</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Vertical Height (cm)</label>
                      <div className="relative group">
                        <Ruler className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                          type="number"
                          name="heightCm"
                          value={formData.heightCm}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-100 pl-14 pr-5 py-4 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                          placeholder="180"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Mass Weight (kg)</label>
                      <div className="relative group">
                        <Weight className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                          type="number"
                          step="0.1"
                          name="weightKg"
                          value={formData.weightKg}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-100 pl-14 pr-5 py-4 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                          placeholder="75.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white border border-slate-200/60 p-8 lg:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Warrior's Creed / Training Goals</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[2rem] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-700 leading-relaxed"
                  placeholder="Define your fitness path..."
                ></textarea>
              </div>

              <div className="flex justify-center md:justify-end pt-4">
                <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="group bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-tighter shadow-2xl shadow-slate-950/20 hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center gap-3 text-lg"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Save size={24} className="group-hover:scale-110 transition-transform" />
                      Commit Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
