import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Dumbbell, 
  Activity,
  Target,
  Flame,
  Shield,
  HeartPulse,
  Zap,
  ArrowUpRight
} from 'lucide-react';

const getCategoryDetails = (bodyPart) => {
  const part = bodyPart?.toUpperCase() || '';
  
  switch(part) {
    case 'CHEST':
      return { icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', hoverBg: 'group-hover:bg-blue-500/10' };
    case 'BACK':
      return { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50', hoverBg: 'group-hover:bg-emerald-500/10' };
    case 'LEGS':
      return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', hoverBg: 'group-hover:bg-amber-500/10' };
    case 'SHOULDERS':
      return { icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50', hoverBg: 'group-hover:bg-purple-500/10' };
    case 'ARMS':
      return { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50', hoverBg: 'group-hover:bg-rose-500/10' };
    case 'CORE':
      return { icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-50', hoverBg: 'group-hover:bg-cyan-500/10' };
    case 'CARDIO':
      return { icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50', hoverBg: 'group-hover:bg-red-500/10' };
    default:
      return { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-50', hoverBg: 'group-hover:bg-slate-500/10' };
  }
};

const getExerciseImage = (exerciseName) => {
  const name = exerciseName?.toLowerCase().trim() || '';
  switch(name) {
    case 'bench press': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif';
    case 'push-ups': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif';
    case 'incline dumbbell press': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif';
    case 'chest flys': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif';
    case 'cable crossover': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif';
    case 'chest dips': return 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif';
    case 'pull-ups': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif';
    case 'bent over row': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif';
    case 'lat pulldown': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif';
    case 'deadlift': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif';
    case 't-bar row': return 'https://fitnessprogramer.com/wp-content/uploads/2021/04/t-bar-rows.gif';
    case 'face pulls': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif';
    case 'back squat': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif';
    case 'leg press': return 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif';
    case 'romanian deadlift': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif';
    case 'leg extensions': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif';
    case 'leg curls': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif';
    case 'calf raises': return 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif';
    case 'lunges': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif';
    case 'overhead press': return 'https://fitnessprogramer.com/wp-content/uploads/2021/07/Barbell-Standing-Military-Press.gif';
    case 'lateral raises': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif';
    case 'arnold press': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif';
    case 'front raises': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif';
    case 'bicep curls': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif';
    case 'hammer curls': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif';
    case 'tricep pushdown': return 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Rope-Pushdown.gif';
    case 'skull crushers': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Triceps-Extension.gif';
    case 'preacher curls': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Z-Bar-Preacher-Curl.gif';
    case 'planks': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif';
    case 'leg raises': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif';
    case 'russian twists': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif';
    case 'crunches': return 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif';
    case 'running': return 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Treadmill-.gif';
    case 'cycling': return 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Bike.gif';
    case 'jump rope': return 'https://fitnessprogramer.com/wp-content/uploads/2023/10/Skip-Jump-Rope.gif';
    case 'burpees': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/burpees.gif';
    case 'row machine': return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Row-Machine.gif';
    default: return null;
  }
};

const ExerciseCard = ({ exercise }) => {
  const [imageError, setImageError] = useState(false);
  const category = getCategoryDetails(exercise.bodyPart);
  const Icon = category.icon;
  const imageUrl = getExerciseImage(exercise.name);

  return (
    <Link 
      to={`/exercises/${exercise.id}`}
      className="group bg-white border border-slate-200/60 rounded-[2.5rem] p-6 hover:border-primary-500/30 hover:bg-white transition-all duration-500 shadow-xl shadow-slate-200/40 relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20">
        <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-lg">
           <ArrowUpRight size={20} />
        </div>
      </div>

      <div className="relative mb-6">
        {/* GIF / Image Container */}
        <div className="w-full aspect-[4/3] rounded-3xl border border-slate-100 overflow-hidden relative transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200/50">
          <div className={`absolute inset-0 flex items-center justify-center ${category.bg} ${category.hoverBg} transition-colors duration-500`}>
             {imageUrl && !imageError ? (
               <img 
                 src={imageUrl} 
                 alt={exercise.name} 
                 className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                 onError={() => setImageError(true)}
               />
             ) : (
               <Icon className={`${category.color} opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100`} size={64} />
             )}
          </div>
          
          {/* Difficulty Badge - Absolute position */}
          {exercise.difficulty && (
            <div className="absolute bottom-4 left-4">
               <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md border
                 ${exercise.difficulty === 'BEGINNER' ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/20' : ''}
                 ${exercise.difficulty === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-600 border-amber-500/20' : ''}
                 ${exercise.difficulty === 'ADVANCED' ? 'bg-rose-500/20 text-rose-600 border-rose-500/20' : ''}
               `}>
                 {exercise.difficulty}
               </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
             <div className={`w-1.5 h-1.5 rounded-full ${category.color.replace('text-', 'bg-')}`} />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {exercise.bodyPart}
             </span>
          </div>
          <h3 className="text-2xl font-black text-slate-950 uppercase leading-none italic group-hover:text-primary-600 transition-colors duration-300">
            {exercise.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-6">
          <Dumbbell size={14} className="text-slate-300" />
          <span className="uppercase tracking-widest text-[10px]">{exercise.equipment || 'No Equipment'}</span>
        </div>

        {/* Muscle groups - Styled as modern tags */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap gap-2">
          {exercise.muscleGroups?.slice(0, 3).map(muscle => (
            <span key={muscle} className="text-[9px] px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg font-black uppercase tracking-widest hover:bg-slate-200 transition-colors cursor-default">
              {muscle}
            </span>
          ))}
          {exercise.muscleGroups?.length > 3 && (
            <span className="text-[9px] px-3 py-1.5 bg-slate-50 text-slate-300 rounded-lg font-black uppercase tracking-widest">
              +{exercise.muscleGroups.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExerciseCard;
