import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutHistory } from '../api/workoutService';
import { History as HistoryIcon, Dumbbell, Play, TrendingUp, Clock, Timer, ChevronRight, Activity, Calendar, Award, Zap, ArrowUpRight, BrainCircuit, Trophy } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const { activeSession, startNewWorkout, isLoading: isWorkoutLoading } = useWorkout();
  const navigate = useNavigate();

  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['workout-history'],
    queryFn: getWorkoutHistory,
  });

  const handleStartWorkout = async () => {
    if (activeSession) {
      navigate('/active-workout');
    } else {
      try {
        await startNewWorkout();
        navigate('/active-workout');
      } catch (err) {
        // Error handled in context
      }
    }
  };

  // Calculate Stats
  const totalWorkouts = history.length;
  
  const totalTimeMs = history.reduce((acc, workout) => {
    if (workout.startTime && workout.endTime) {
      return acc + (new Date(workout.endTime) - new Date(workout.startTime));
    }
    return acc;
  }, 0);

  const avgDurationMs = totalWorkouts > 0 ? totalTimeMs / totalWorkouts : 0;

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const lastWorkout = history[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Hero Section */}
        <div className="bg-slate-950 px-6 py-12 lg:px-12 lg:py-20 relative overflow-hidden">
           {/* Decorative Gradients */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
           
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-6">
                       <Zap size={12} fill="currentColor" />
                       Active Status: Elite
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-4 uppercase italic">
                       Unleash Your <br />
                       <span className="text-primary-500">Peak Potential</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg max-w-lg leading-relaxed">
                       Welcome back, {user?.username}. Your fitness journey is evolving. You've logged <span className="text-white font-bold">{totalWorkouts} sessions</span> so far.
                    </p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleStartWorkout}
                      disabled={isWorkoutLoading}
                      className={`${
                        activeSession ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary-600 hover:bg-primary-700'
                      } text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter shadow-2xl shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg min-w-[240px] group`}
                    >
                      {activeSession ? (
                        <>
                          <TrendingUp size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                          Resume Session
                        </>
                      ) : (
                        <>
                          <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                          Start Training
                        </>
                      )}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats & Activity Grid */}
        <div className="p-6 lg:p-12 -mt-10 lg:-mt-16 max-w-7xl mx-auto w-full relative z-20">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Workouts', value: totalWorkouts, icon: Activity, color: 'text-primary-500', trend: 'Steady Growth' },
              { label: 'Time in Gym', value: formatDuration(totalTimeMs), icon: Clock, color: 'text-emerald-500', trend: 'Consistency King' },
              { label: 'Avg. Duration', value: formatDuration(avgDurationMs), icon: Timer, color: 'text-amber-500', trend: 'Session Power' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200/60 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 group hover:border-primary-500/20 transition-all duration-300 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
                    <stat.icon size={100} />
                 </div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color}`}>
                       <stat.icon size={24} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px]">{stat.label}</p>
                 </div>
                 <h3 className="text-5xl font-black text-slate-950 leading-none tracking-tighter mb-4">{stat.value}</h3>
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                    <TrendingUp size={14} className={stat.color} />
                    <span>{stat.trend}</span>
                 </div>
              </div>
            ))}
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Last Workout Card */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-500 rounded-lg text-white">
                         <Calendar size={18} />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 italic">Latest Activity</h3>
                   </div>
                   <button onClick={() => navigate('/history')} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group uppercase tracking-widest">
                      Full History <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </button>
                </div>

                {lastWorkout ? (
                  <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 relative group overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                           <div className="w-24 h-24 bg-slate-950 rounded-3xl flex flex-col items-center justify-center text-white border border-white/10 shadow-2xl">
                              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                                {format(new Date(lastWorkout.startTime), 'MMM')}
                              </span>
                              <span className="text-4xl font-black leading-none">
                                {format(new Date(lastWorkout.startTime), 'dd')}
                              </span>
                           </div>
                           <div>
                              <h4 className="text-3xl font-black text-slate-900 uppercase leading-none mb-3 italic">
                                {format(new Date(lastWorkout.startTime), 'EEEE')}
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                 <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock size={12} /> {format(new Date(lastWorkout.startTime), 'p')}
                                 </div>
                                 <div className="px-3 py-1 bg-primary-50 rounded-full text-[10px] font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1.5">
                                    <Award size={12} /> Session Complete
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-10 bg-slate-50 px-8 py-6 rounded-3xl border border-slate-100">
                           <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ex. Volume</p>
                              <p className="text-3xl font-black text-slate-950 tabular-nums">
                                {lastWorkout.sets?.length ? new Set(lastWorkout.sets.map(s => s.exercise?.id)).size : 0}
                              </p>
                           </div>
                           <div className="w-px h-10 bg-slate-200" />
                           <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Sets</p>
                              <p className="text-3xl font-black text-slate-950 tabular-nums">
                                {lastWorkout.sets?.length || 0}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-16 text-center border-dashed border-2 shadow-xl shadow-slate-200/50">
                     <Activity className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                     <h4 className="font-black uppercase italic text-2xl text-slate-950">No Battles Logged</h4>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Start your first session to see your stats here!</p>
                  </div>
                )}
             </div>

             {/* Quick Actions / Upgrades Card */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-slate-950 rounded-lg text-white">
                      <TrendingUp size={18} />
                   </div>
                   <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 italic">Quick Links</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <button 
                     onClick={() => navigate('/history')}
                     className="group flex items-center justify-between p-6 bg-slate-900 rounded-3xl text-white hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/20"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-primary-500 transition-colors">
                            <HistoryIcon size={24} />
                         </div>
                         <div className="text-left">
                            <h4 className="font-black uppercase tracking-tighter text-lg">History</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Review Past Gains</p>
                         </div>
                      </div>
                      <ChevronRight className="group-hover:translate-x-2 transition-transform text-slate-600" size={24} />
                   </button>

                   <button 
                     onClick={() => navigate('/exercises')}
                     className="group flex items-center justify-between p-6 bg-slate-950 rounded-3xl text-white hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-slate-950/20"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-primary-500 transition-colors">
                            <Dumbbell size={24} />
                         </div>
                         <div className="text-left">
                            <h4 className="font-black uppercase tracking-tighter text-lg">Exercises</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Browse Library</p>
                         </div>
                      </div>
                      <ChevronRight className="group-hover:translate-x-2 transition-transform text-slate-600" size={24} />
                   </button>

                   <button 
                     onClick={() => navigate('/records')}
                     className="group flex items-center justify-between p-6 bg-amber-500 rounded-3xl text-slate-900 hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/20"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white transition-colors">
                            <Trophy size={24} />
                         </div>
                         <div className="text-left">
                            <h4 className="font-black uppercase tracking-tighter text-lg">PR Hall</h4>
                            <p className="text-amber-900/60 text-[10px] font-bold uppercase tracking-widest">Hall of Achievement</p>
                         </div>
                      </div>
                      <ChevronRight className="group-hover:translate-x-2 transition-transform text-amber-900/40" size={24} />
                   </button>

                   <div className="p-8 bg-primary-600 rounded-3xl text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-primary-600/20">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                         <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <BrainCircuit size={28} />
                         </div>
                         <h4 className="text-xl font-black uppercase tracking-tighter mb-1 leading-tight">AI Coaching <br />Premium</h4>
                         <p className="text-primary-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Unlock personalized form analysis</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
