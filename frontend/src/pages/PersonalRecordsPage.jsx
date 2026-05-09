import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutHistory } from '../api/workoutService';
import Sidebar from '../components/Sidebar';
import { 
  Trophy, 
  Calendar, 
  Medal,
  Star,
  TrendingUp,
  Activity,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const PersonalRecordsPage = () => {
  const { data: history = [], isLoading, error } = useQuery({
    queryKey: ['workout-history'],
    queryFn: getWorkoutHistory,
  });

  // Calculate PRs from workout history on the frontend
  const records = React.useMemo(() => {
    const prMap = {};
    history.forEach(session => {
      if (!session.sets) return;
      session.sets.forEach(set => {
        if (!set.exercise) return;
        const exId = set.exercise.id;
        const weight = set.weight || 0;
        
        if (!prMap[exId] || weight > prMap[exId].weight) {
          prMap[exId] = {
            exerciseId: exId,
            exerciseName: set.exercise.name,
            bodyPart: set.exercise.bodyPart,
            weight: weight,
            reps: set.reps || 0,
            date: session.startTime,
          };
        }
      });
    });
    return Object.values(prMap).sort((a, b) => b.weight - a.weight);
  }, [history]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="bg-slate-950 px-6 py-12 lg:px-12 lg:py-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
           
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
                       <Trophy size={12} fill="currentColor" />
                       Hall of Achievement
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-4 uppercase italic">
                       Personal <br />
                       <span className="text-amber-500">Records</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg max-w-lg leading-relaxed">
                       Your greatest victories, documented. Every record here is a testament to your discipline and raw strength.
                    </p>
                 </div>
                 
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex items-center gap-6">
                    <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/20">
                       <Medal size={40} strokeWidth={2.5} />
                    </div>
                    <div>
                       <p className="text-amber-500 font-black uppercase tracking-widest text-[10px] mb-1">Total Records</p>
                       <h3 className="text-5xl font-black text-white leading-none tabular-nums tracking-tighter">{records.length}</h3>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 lg:p-12 -mt-10 lg:-mt-16 max-w-6xl mx-auto w-full relative z-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs text-center">Scanning the Archives for Greatness...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-10 rounded-[3rem] text-rose-500 text-center shadow-xl">
               <Activity className="h-10 w-10 mx-auto mb-4 opacity-50" />
               <h4 className="font-black uppercase italic text-xl text-center">Record Access Error</h4>
               <p className="text-sm font-medium mt-1 text-center">We couldn't load your workout history. Please try again.</p>
            </div>
          ) : records.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-24 text-center shadow-xl shadow-slate-200/50">
               <Star className="h-16 w-16 text-slate-200 mx-auto mb-6" />
               <h4 className="font-black uppercase italic text-2xl text-slate-950">No Records Yet</h4>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 mb-8">Complete a workout session to see your PRs here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <div 
                  key={record.exerciseId}
                  className="group bg-white border border-slate-200/60 hover:border-amber-500/30 rounded-[2.5rem] p-8 transition-all duration-500 shadow-xl shadow-slate-200/40 relative overflow-hidden active:scale-[0.98]"
                >
                  <Trophy className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{record.bodyPart}</span>
                       </div>
                       <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                          <Activity size={16} />
                       </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-950 uppercase italic leading-tight mb-4 group-hover:text-amber-600 transition-colors">
                      {record.exerciseName}
                    </h3>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-end justify-between">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Lift</p>
                          <div className="flex items-baseline gap-1">
                             <span className="text-4xl font-black text-slate-950 tabular-nums tracking-tighter">{record.weight}</span>
                             <span className="text-sm font-black text-slate-400">kg</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recorded On</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-950">
                             <Calendar size={14} className="text-amber-500" />
                             {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>{record.reps} reps achieved</span>
                       <div className="flex items-center gap-1 text-emerald-500">
                          <TrendingUp size={12} />
                          <span>PR Verified</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalRecordsPage;
