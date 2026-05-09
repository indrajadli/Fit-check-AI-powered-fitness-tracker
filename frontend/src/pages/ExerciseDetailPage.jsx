import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getExerciseById } from '../api/exerciseService';
import { useWorkout } from '../context/WorkoutContext';
import { addSetToWorkout } from '../api/workoutService';
import { ArrowLeft, Dumbbell, Info, Target, Zap, PlayCircle, Plus, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AiCoachSection from '../components/AiCoachSection';
import AiChatBox from '../components/AiChatBox';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeSession, setActiveSession } = useWorkout();

  const { data: exercise, isLoading, error } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => getExerciseById(id),
  });

  const handleAddToSession = async () => {
    if (!activeSession) {
      toast.error('Start a workout session first!');
      return;
    }

    try {
      const savedSet = await addSetToWorkout({
        exerciseId: id,
        weight: 0,
        reps: 0,
        rpe: 8
      });
      setActiveSession(prev => ({
        ...prev,
        sets: [...prev.sets, savedSet]
      }));
      toast.success(`${exercise.name} added to session!`);
      navigate('/active-workout');
    } catch (err) {
      toast.error('Failed to add exercise to session');
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Exercise not found</h2>
        <button onClick={() => navigate('/exercises')} className="text-primary-500 hover:underline">Back to library</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 border border-primary-200 rounded-full text-xs font-black tracking-widest uppercase">
                  {exercise.bodyPart}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                  {exercise.difficulty}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">{exercise.name}</h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                {exercise.description || 'No description available for this exercise yet. Stay tuned for AI-powered insights!'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-3 text-primary-600">
                  <Target size={20} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Muscle Groups</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups?.map(muscle => (
                    <span key={muscle} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-3 text-primary-600">
                  <Dumbbell size={20} />
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Equipment</h3>
                </div>
                <p className="text-slate-600">{exercise.equipment || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
            <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/20">
              <h3 className="text-xl font-bold mb-4">Ready to start?</h3>
              <p className="text-primary-100 mb-6 text-sm">
                {activeSession ? "Add this to your current session and start tracking." : "Start a new session to add this exercise."}
              </p>
              <button 
                onClick={handleAddToSession}
                className="w-full bg-white text-primary-600 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add to Session
              </button>
            </div>

            {!exercise.videoUrl && (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                  <PlayCircle size={18} className="text-slate-400" />
                  Tutorial Status
                </h3>
                <p className="text-slate-400 text-sm italic">Video tutorial coming soon for this movement.</p>
              </div>
            )}
          </div>
        </div>
        {/* Video Tutorial Section */}
        {exercise.videoUrl && (
          <section className="mt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                <PlayCircle size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Video Tutorial</h2>
                <p className="text-slate-500">Master the movement with a visual guide</p>
              </div>
            </div>

            <div className="aspect-video w-full bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(exercise.videoUrl)}
                title={`${exercise.name} Tutorial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        )}

        <AiCoachSection exerciseId={exercise.id} exerciseName={exercise.name} />
        
        {/* Floating AI Chat Box */}
        <AiChatBox exerciseId={exercise.id} exerciseName={exercise.name} />
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
