import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  Zap, 
  CheckCircle2, 
  Info, 
  Move, 
  ShieldCheck 
} from 'lucide-react';

const AiCoachSection = ({ exerciseId, exerciseName }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ai-coach', exerciseId],
    queryFn: async () => {
      const response = await apiClient.get(`/ai/coach/exercise/${exerciseId}`);
      return response.data;
    },
    enabled: !!exerciseId,
    staleTime: Infinity,
  });

  const parseAdvice = (text) => {
    if (!text) return [];
    const sections = text.split('###').filter(s => s.trim());
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      return { title, content };
    });
  };

  const getSectionIcon = (title) => {
    const t = title.toUpperCase();
    if (t.includes('OVERVIEW')) return <Info size={18} className="text-blue-600" />;
    if (t.includes('SETUP')) return <Move size={18} className="text-emerald-600" />;
    if (t.includes('FORM')) return <ShieldCheck size={18} className="text-amber-600" />;
    if (t.includes('ELITE')) return <Zap size={18} className="text-purple-600" />;
    return <CheckCircle2 size={18} className="text-slate-400" />;
  };

  const adviceSections = parseAdvice(data?.advice);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 border border-purple-200">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">AI Coach Master Manual</h2>
            <p className="text-slate-500">Exhaustive neural analysis & biomechanical guide</p>
          </div>
        </div>
        
        {data && (
          <button 
            onClick={() => refetch()}
            className="text-[10px] font-black text-slate-500 hover:text-purple-600 uppercase tracking-widest transition-colors flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"
          >
            <Sparkles size={12} />
            Re-Analyze
          </button>
        )}
      </div>

      <div className="relative">
        {/* Background Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl rounded-[3rem] opacity-30 pointer-events-none"></div>

        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-24">
              <div className="relative">
                <Loader2 className="h-20 w-20 text-purple-600 animate-spin" />
                <Brain className="absolute inset-0 m-auto h-8 w-8 text-purple-400 animate-pulse" />
              </div>
              <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
                Synthesizing Master-Level Training Manual...
              </p>
            </div>
          ) : isError ? (
            <div className="w-full text-center py-20 bg-rose-50 rounded-3xl border border-rose-200">
              <p className="text-rose-500 font-bold text-lg mb-2">Neural Link Interrupted</p>
              <p className="text-slate-500 text-sm mb-6">The AI Coach is temporarily unreachable.</p>
              <button 
                onClick={() => refetch()} 
                className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                Retry Uplink
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {/* Form Image Display (Real Web Image) */}
              {data?.exercise?.formImageUrl && (
                <div className="w-full group">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <ShieldCheck size={18} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                      Technical Form Blueprint
                    </h3>
                  </div>
                  <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl bg-white">
                    <img 
                      src={data.exercise.formImageUrl} 
                      alt={`${exerciseName} form`}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                {adviceSections.map((section, idx) => (
                  <div 
                    key={idx} 
                    className="group transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4 px-2">
                      <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:border-primary-500/30 transition-colors shadow-sm">
                        {getSectionIcon(section.title)}
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        {section.title}
                      </h3>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/60 hover:border-primary-500/20 transition-all duration-300 shadow-xl shadow-slate-200/40">
                      <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiCoachSection;
