import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutHistory } from '../api/workoutService';
import Sidebar from '../components/Sidebar';
import {
  History as HistoryIcon,
  Calendar,
  Dumbbell,
  Timer,
  ChevronRight,
  Trophy,
  Activity,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Loader2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const HistoryPage = () => {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['workout-history'],
    queryFn: getWorkoutHistory,
  });

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const duration = Math.floor((new Date(end) - new Date(start)) / 1000);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}m ${secs}s`;
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
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  <HistoryIcon size={12} fill="currentColor" />
                  Progression Journal
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-4 uppercase italic">
                  Warrior <br />
                  <span className="text-primary-500">Chronicles</span>
                </h2>
                <p className="text-slate-400 font-medium text-lg max-w-lg leading-relaxed">
                  Review your journey, analyze your volume, and celebrate every victory. Consistency is the foundation of greatness.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Completion Rate</p>
                <div className="flex items-center gap-4">
                  <h3 className="text-5xl font-black text-white leading-none tabular-nums tracking-tighter">100%</h3>
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-4 font-bold uppercase tracking-tight">Last 30 Days: <span className="text-emerald-400">Perfect</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-12 -mt-10 lg:-mt-16 max-w-5xl mx-auto w-full relative z-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50">
              <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs text-center">Decrypting Past Battles...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-10 rounded-[3rem] text-rose-500 text-center shadow-xl">
              <Activity className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <h4 className="font-black uppercase italic text-xl text-center">History Retrieval Error</h4>
              <p className="text-sm font-medium mt-1 text-center">We couldn't load your sessions. Please try again.</p>
            </div>
          ) : history?.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-24 text-center shadow-xl shadow-slate-200/50">
              <Activity className="h-16 w-16 text-slate-200 mx-auto mb-6" />
              <h4 className="font-black uppercase italic text-2xl text-slate-950">Empty Archive</h4>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 mb-8">Your legacy starts with your first session.</p>
              <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter shadow-xl">Start Training Now</button>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((session) => (
                <div
                  key={session.id}
                  className="group bg-white border border-slate-200/60 hover:border-primary-500/30 rounded-[2.5rem] p-8 lg:p-10 transition-all duration-500 shadow-xl shadow-slate-200/40 relative overflow-hidden active:scale-[0.99]"
                >
                  <Trophy className="absolute -right-8 -bottom-8 w-48 h-48 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center text-white border border-white/10 shadow-xl group-hover:bg-primary-600 transition-colors duration-500">
                        <span className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                          {format(new Date(session.startTime), 'MMM')}
                        </span>
                        <span className="text-3xl font-black leading-none">
                          {format(new Date(session.startTime), 'dd')}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-3xl font-black text-slate-950 group-hover:text-primary-600 transition-colors duration-300 uppercase italic leading-none mb-3">
                          {format(new Date(session.startTime), 'EEEE')}
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Clock size={14} className="text-primary-500" />
                            {format(new Date(session.startTime), 'p')}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Timer size={14} className="text-emerald-500" />
                            {formatDuration(session.startTime, session.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 bg-slate-50 px-8 py-6 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-primary-500/10 transition-all duration-500">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Volume</p>
                        <div className="flex items-center justify-end gap-2 text-3xl font-black text-slate-950 tracking-tighter tabular-nums group-hover:text-primary-600 transition-colors">
                          {session.totalVolume.toLocaleString()} <span className="text-xs font-bold text-slate-400">kg</span>
                        </div>
                      </div>

                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all duration-500 shadow-sm">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Exercises Quick View */}
                  <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                    {Array.from(new Set(session.sets.map(s => s.exercise.name))).slice(0, 6).map(name => (
                      <span key={name} className="bg-slate-100/50 text-slate-500 text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-300">
                        {name}
                      </span>
                    ))}
                    {new Set(session.sets.map(s => s.exercise.name)).size > 6 && (
                      <span className="text-slate-400 text-[9px] font-black self-center tracking-widest px-2 uppercase">
                        +{new Set(session.sets.map(s => s.exercise.name)).size - 6} more
                      </span>
                    )}
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

export default HistoryPage;
