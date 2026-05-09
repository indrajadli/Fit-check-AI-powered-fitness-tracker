import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { addSetToWorkout, deleteSetFromWorkout, updateSetInWorkout } from '../api/workoutService';
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Timer, 
  Dumbbell, 
  TrendingUp,
  Loader2,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { toggleSetCompletion } from '../api/workoutService';

// Simple local debounce to avoid dependency issues
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const SetRow = ({ set, index, onDelete, onUpdate }) => {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Debounced update to backend
  const debouncedUpdate = useCallback(
    debounce(async (newWeight, newReps) => {
      setIsSaving(true);
      try {
        const updatedSet = await updateSetInWorkout(set.id, newWeight, newReps);
        onUpdate(updatedSet);
      } catch (err) {
        toast.error('Failed to save set');
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [set.id]
  );

  const handleWeightChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setWeight(val);
      const parsed = parseFloat(val) || 0;
      debouncedUpdate(parsed, parseInt(reps) || 0);
    }
  };

  const handleRepsChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*$/.test(val)) {
      setReps(val);
      const parsed = parseInt(val) || 0;
      debouncedUpdate(parseFloat(weight) || 0, parsed);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const updatedSet = await toggleSetCompletion(set.id);
      onUpdate(updatedSet);
    } catch (err) {
      toast.error('Failed to toggle set');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <tr className={`group transition-all duration-300 ${set.completed ? 'bg-emerald-50 opacity-80' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-4 font-bold text-slate-500 w-16">
        {set.completed ? (
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white scale-110 transition-transform">
            <Check size={14} strokeWidth={4} />
          </div>
        ) : (
          <span className="text-sm">{index + 1}</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <input 
            type="text" 
            inputMode="decimal"
            value={weight}
            onChange={handleWeightChange}
            className={`w-24 bg-slate-100 border border-slate-200 text-slate-900 font-mono font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all ${set.completed ? 'line-through text-slate-400' : ''}`}
            placeholder="0.0"
            disabled={set.completed}
          />
          {isSaving && (
            <div className="absolute -right-6 top-1/2 -translate-y-1/2">
              <Loader2 size={12} className="animate-spin text-primary-500" />
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <input 
          type="text" 
          inputMode="numeric"
          value={reps}
          onChange={handleRepsChange}
          className={`w-20 bg-slate-100 border border-slate-200 text-slate-900 font-mono font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all ${set.completed ? 'line-through text-slate-400' : ''}`}
          placeholder="0"
          disabled={set.completed}
        />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={handleToggle}
            disabled={isToggling}
            className={`p-2 rounded-lg transition-all ${
              set.completed 
              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
              : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {isToggling ? <Loader2 size={16} className="animate-spin" /> : (set.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />)}
          </button>
          
          <button 
            onClick={() => onDelete(set.id, set.weight, set.reps)}
            className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ActiveWorkoutPage = () => {
  const { activeSession, endWorkout, setActiveSession } = useWorkout();
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!activeSession) {
      navigate('/');
      return;
    }

    const start = new Date(activeSession.startTime).getTime();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, navigate]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (activeSession.sets.length === 0) {
      if (!window.confirm('You haven\'t logged any sets. Are you sure you want to finish?')) return;
    }
    
    setIsFinishing(true);
    try {
      await endWorkout();
      navigate('/');
    } catch (err) {
      setIsFinishing(false);
    }
  };

  const handleAddSet = async (exerciseId) => {
    // Default values for new set: use the last set of the same exercise if it exists
    const exerciseSets = activeSession.sets.filter(s => s.exercise.id === exerciseId);
    const lastSet = exerciseSets.length > 0 ? exerciseSets[exerciseSets.length - 1] : null;
    
    const newSetData = {
      exerciseId,
      weight: lastSet ? lastSet.weight : 40, // Default 40kg if new
      reps: lastSet ? lastSet.reps : 10,     // Default 10 reps if new
    };

    try {
      const savedSet = await addSetToWorkout(newSetData);
      setActiveSession(prev => ({
        ...prev,
        sets: [...prev.sets, savedSet],
        totalVolume: prev.totalVolume + (newSetData.weight * newSetData.reps)
      }));
      toast.success('Set added');
    } catch (err) {
      toast.error('Failed to add set');
    }
  };

  const handleDeleteSet = async (setId, weight, reps) => {
    try {
      await deleteSetFromWorkout(setId);
      setActiveSession(prev => ({
        ...prev,
        sets: prev.sets.filter(s => s.id !== setId),
        totalVolume: prev.totalVolume - (weight * reps)
      }));
      toast.success('Set removed');
    } catch (err) {
      toast.error('Failed to remove set');
    }
  };

  const handleUpdateSetInState = (updatedSet) => {
    setActiveSession(prev => {
      const newSets = prev.sets.map(s => s.id === updatedSet.id ? updatedSet : s);
      const newVolume = newSets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
      return {
        ...prev,
        sets: newSets,
        totalVolume: newVolume
      };
    });
  };

  // Group sets by exercise
  const exercisesInSession = activeSession?.sets.reduce((acc, set) => {
    const exerciseId = set.exercise.id;
    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        info: set.exercise,
        sets: []
      };
    }
    acc[exerciseId].sets.push(set);
    return acc;
  }, {});

  if (!activeSession) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary-500/10 rounded-xl text-primary-500">
              <Timer size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Active Session</p>
              <p className="text-2xl font-black font-mono">{formatTime(elapsedTime)}</p>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            disabled={isFinishing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isFinishing ? 'Finishing...' : (
              <>
                <CheckCircle2 size={20} />
                Finish
              </>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 mt-8 space-y-8">
        {/* Empty State */}
        {Object.keys(exercisesInSession || {}).length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <Dumbbell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-400">Your session is empty</h2>
            <p className="text-slate-400 mb-6">Go to the Exercise Library to add movements</p>
            <button 
              onClick={() => navigate('/exercises')}
              className="text-primary-400 font-bold hover:text-primary-300 transition-colors"
            >
              Browse Exercises →
            </button>
          </div>
        )}

        {/* Exercises List */}
        {Object.entries(exercisesInSession || {}).map(([id, group]) => (
          <div key={id} className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">{group.info.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500 font-bold uppercase">{group.info.bodyPart}</p>
                    {group.sets.length > 0 && group.sets.every(s => s.completed) && (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-emerald-500/30">
                        <Check size={10} strokeWidth={4} />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleAddSet(group.info.id)}
                className="p-2 hover:bg-primary-500/10 text-primary-500 rounded-lg transition-colors border border-transparent hover:border-primary-500/20"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-100">
                  <tr>
                    <th className="px-6 py-4">Set</th>
                    <th className="px-6 py-4">Weight (kg)</th>
                    <th className="px-6 py-4">Reps</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {group.sets.map((set, index) => (
                    <SetRow 
                      key={set.id} 
                      set={set} 
                      index={index} 
                      onDelete={handleDeleteSet} 
                      onUpdate={handleUpdateSetInState}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-slate-950/20 border-t border-slate-800/50 flex justify-center">
               <button 
                  onClick={() => handleAddSet(group.info.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-all text-xs font-bold uppercase tracking-widest"
               >
                 <Plus size={16} />
                 Add Set
               </button>
            </div>
          </div>
        ))}

        {/* Footer Actions */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/exercises')}
            className="w-full bg-slate-50 border border-slate-200 hover:border-primary-500/50 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </div>
      </main>

      {/* Stats Floating Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-full p-2 flex items-center justify-between shadow-2xl z-50">
        <div className="flex-1 flex justify-center border-r border-slate-200">
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-500 uppercase">Volume</p>
             <p className="text-sm font-bold text-emerald-600">{activeSession.totalVolume} kg</p>
           </div>
        </div>
        <div className="flex-1 flex justify-center">
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-500 uppercase">Sets</p>
             <p className="text-sm font-bold text-primary-600">{activeSession.sets.length}</p>
           </div>
        </div>
        <div className="flex-1 flex justify-center border-l border-slate-200">
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-500 uppercase">Exercises</p>
             <p className="text-sm font-bold text-purple-600">{Object.keys(exercisesInSession || {}).length}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkoutPage;
