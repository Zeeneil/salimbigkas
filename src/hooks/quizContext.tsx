import React, { createContext, useContext, useEffect, useState } from "react";

interface QuizContextType {
  selectedQuiz: any | null;
  setSelectedQuiz: (quizData: any | null) => void;
  results: any | null;
  setResults: (results: any | null) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizContext = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuizContext must be used within QuizProvider");
  return ctx;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedQuiz, setSelectedQuizState] = useState<any>(() => {
    const stored = sessionStorage.getItem("selectedQuiz");
    return stored ? JSON.parse(stored) : null;
  });
  const [results, setResultsState] = useState<any>(() => {
    const stored = sessionStorage.getItem("results");
    return stored ? JSON.parse(stored) : null;
  });
  const [selectedClassId, setSelectedClassIdState] = useState<any>(() => {
    const stored = sessionStorage.getItem("selectedClassId");
    return stored ? JSON.parse(stored) : "";
  });

  useEffect(() => {
    if (selectedQuiz) {
      sessionStorage.setItem("selectedQuiz", JSON.stringify(selectedQuiz));
    } else {
      sessionStorage.removeItem("selectedQuiz");
    }
  }, [selectedQuiz]);
  useEffect(() => {
    if (results) {
      sessionStorage.setItem("results", JSON.stringify(results));
    } else {
      sessionStorage.removeItem("results");
    }
  }, [results]);
  useEffect(() => {
    if (selectedClassId) {
      sessionStorage.setItem("selectedClassId", JSON.stringify(selectedClassId));
    } else {
      sessionStorage.removeItem("selectedClassId");
    }
  }, [selectedClassId]);

  const setSelectedQuiz = (quizData: any | null) => {
    setSelectedQuizState(quizData);
  };
  const setResults = (results: any | null) => {
    setResultsState(results);
  };
  const setSelectedClassId = (classId: string) => {
    setSelectedClassIdState(classId);
  };

  return (
    <QuizContext.Provider value={{ 
      selectedQuiz, 
      setSelectedQuiz, 
      results, 
      setResults, 
      selectedClassId, 
      setSelectedClassId,
    }}>
      {children}
    </QuizContext.Provider>
  );
};