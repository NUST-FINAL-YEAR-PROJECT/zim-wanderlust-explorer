
import { useState } from 'react';

interface ProcessState {
  isOpen: boolean;
  title: string;
  description?: string;
  progress: number;
  steps: string[];
  currentStep: number;
}

export const useProcessDialog = () => {
  const [state, setState] = useState<ProcessState>({
    isOpen: false,
    title: '',
    description: '',
    progress: 0,
    steps: [],
    currentStep: 0
  });

  const startProcess = (title: string, steps: string[], description?: string) => {
    setState({
      isOpen: true,
      title,
      description,
      progress: 0,
      steps,
      currentStep: 0
    });
  };

  const updateProgress = (stepIndex: number, progress?: number) => {
    setState(prev => ({
      ...prev,
      currentStep: stepIndex,
      progress: progress ?? ((stepIndex + 1) / prev.steps.length) * 100
    }));
  };

  const completeProcess = () => {
    setState(prev => ({
      ...prev,
      progress: 100,
      currentStep: prev.steps.length - 1
    }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isOpen: false }));
    }, 1000);
  };

  const closeProcess = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    ...state,
    startProcess,
    updateProgress,
    completeProcess,
    closeProcess
  };
};
