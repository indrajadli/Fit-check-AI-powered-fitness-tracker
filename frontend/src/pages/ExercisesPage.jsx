import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExercises } from '../api/exerciseService';
import ExerciseCard from '../components/ExerciseCard';
import { 
  Search, 
  Loader2, 
  Target, 
  Shield, 
  Zap, 
  Dumbbell, 
  Flame, 
  HeartPulse, 
  Activity,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const BODY_PARTS = ['ALL', 'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'CARDIO'];

const ExercisesPage = () => {
  const [selectedPart, setSelectedPart] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ['exercises', selectedPart],
    queryFn: () => getExercises(selectedPart),
  });

  const filteredExercises = exercises?.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Hero Section */}
        <div className="bg-slate-950 px-6 py-12 lg:px-12 lg:py-20 relative overflow-hidden">
           {/* Decorative Gradients */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
           
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                       <Activity size={12} fill="currentColor" />
                       Knowledge Base
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-4 uppercase italic">
                       Exercise <br />
                       <span className="text-primary-500">Mastery</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg max-w-lg leading-relaxed">
                       Explore our library of {exercises?.length || 0} professional movements. Refine your form, target specific muscles, and build your perfect workout.
                    </p>
                 </div>
                 
                 <div className="w-full lg:w-96">
                    <div className="relative group">
                       <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                       <input 
                         type="text"
                         placeholder="Search movements..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 font-bold tracking-tight"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 lg:p-12 gap-10">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0 -mt-16 lg:-mt-24 relative z-30">
            <div className="bg-white border border-slate-200/60 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 sticky top-12">
               <div className="flex items-center gap-2 mb-6 px-2">
                  <Filter size={16} className="text-primary-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</span>
               </div>
               <div className="space-y-1.5">
                 {BODY_PARTS.map(part => {
                   const getIcon = (p) => {
                     switch(p) {
                       case 'CHEST': return <Target size={16} />;
                       case 'BACK': return <Shield size={16} />;
                       case 'LEGS': return <Zap size={16} />;
                       case 'SHOULDERS': return <Dumbbell size={16} />;
                       case 'ARMS': return <Flame size={16} />;
                       case 'CORE': return <Target size={16} />;
                       case 'CARDIO': return <HeartPulse size={16} />;
                       default: return <Activity size={16} />;
                     }
                   };
                   
                   const isActive = selectedPart === part;
                   return (
                     <button
                       key={part}
                       onClick={() => setSelectedPart(part)}
                       className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black tracking-tight transition-all duration-300 flex items-center gap-4 ${
                         isActive 
                         ? 'text-white bg-slate-950 shadow-lg shadow-slate-900/20 scale-105 z-10' 
                         : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                       }`}
                     >
                       <span className={isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-500'}>
                         {getIcon(part)}
                       </span>
                       <span className="uppercase tracking-widest text-[10px]">{part}</span>
                       {isActive && <ArrowUpRight size={14} className="ml-auto opacity-40" />}
                     </button>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="flex-1 -mt-4 lg:-mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50">
                <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Library...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-500/10 border border-rose-500/20 p-10 rounded-[3rem] text-rose-500 text-center shadow-xl">
                 <Activity className="h-10 w-10 mx-auto mb-4 opacity-50" />
                 <h4 className="font-black uppercase italic text-xl">Connection Interrupted</h4>
                 <p className="text-sm font-medium mt-1">Failed to load exercises. Please check your network.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {filteredExercises?.length === 0 ? (
                  <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50">
                    <Search className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                    <h4 className="font-black uppercase italic text-xl text-slate-900">No Movements Found</h4>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredExercises?.map(exercise => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
