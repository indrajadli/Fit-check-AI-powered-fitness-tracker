import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveWorkout, startWorkout as apiStartWorkout, finishWorkout as apiFinishWorkout } from '../api/workoutService';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  // Check for active session on mount or user change
  useEffect(() => {
    const fetchActiveSession = async () => {
      if (!user) {
        setIsLoading(false);
        setActiveSession(null);
        return;
      }
      
      try {
        const session = await getActiveWorkout();
        if (session) {
          setActiveSession(session);
        }
      } catch (err) {
        console.error('Failed to fetch active session', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSession();
  }, [user]);

  const startNewWorkout = async () => {
    try {
      const session = await apiStartWorkout();
      setActiveSession(session);
      toast.success('Workout started! Let\'s go! 🔥');
      return session;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start workout');
      throw err;
    }
  };

  const endWorkout = async () => {
    try {
      const summary = await apiFinishWorkout();
      setActiveSession(null);
      toast.success('Workout finished! Great job! 🏆');
      return summary;
    } catch (err) {
      // If the error is that no active session was found, it might have finished successfully
      // but the response failed (circular JSON, etc). Let's clear the state anyway.
      if (err.response?.data?.message?.includes('No active session found')) {
        setActiveSession(null);
        toast.success('Workout finished!');
        return null;
      }
      toast.error('Failed to finish workout');
      throw err;
    }
  };

  return (
    <WorkoutContext.Provider value={{ 
      activeSession, 
      setActiveSession, 
      startNewWorkout, 
      endWorkout,
      isLoading 
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
