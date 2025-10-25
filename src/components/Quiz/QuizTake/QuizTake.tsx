import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createAudioForJob, getClueLettersByGrade, getQuestionTimeByType, getSyllableClues, quizStepAudios } from "../../../utils/helpers";
import { useTimer } from "../../Timer/useTimer";
import { usePartialScoring } from "./usePartialScoring";
import useSpeedScoring from "./useSpeedScoring";
import { doSubmitQuizAnswers, doSubmitSeatworkAnswers } from "../../../api/functions";
import { useAuth } from "../../../hooks/authContext";
import QuestionWrapper from "./QuestionWrapper";
import { useQuizLogic } from "./useQuizLogic";
import { DragDropContext } from "@hello-pangea/dnd";
import QuizHeader from "./QuizHeader";
import Characters from "../../../pages/Characters";
import { useQuizContext } from "../../../hooks/quizContext";
import { useNavigate } from "react-router-dom";
import LottieTrophy from "../../LottieAnimation/LottieTrophy";
import { useClassContext } from "../../../hooks/classContext";
import { useAudioQueue } from "../../Lesson/useAudioQueue";
import { useLogReg } from "../../Modals/LogRegProvider";
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import JoyrideCustomTooltip from "../../Modals/JoyrideCustomTooltip";

const QuizTake = () => {
  const navigate = useNavigate();
  const [run, setRun] = useState<boolean>(true);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const steps: Step[] = [
    {
      target: '[data-joyride="quiz-type"]',
      content: 'Makikita mo dito kung anong uri ng pagsusulit ang iyong ginagawa. Galingan at gawin ang iyong makakaya!',
      placement: 'auto',
      disableBeacon: true,
    },
    {
      target: '[data-joyride="quiz-question-number"]',
      content: 'Makikita mo dito ang bilang ng tanong na iyong sinasagutan. Huwag kalimutang suriin ito!',
      placement: 'auto',
    },
    {
      target: '[data-joyride="quiz-timer"]',
      content: 'Makikita mo dito ang natitirang oras para sagutan ang tanong. Mabilis lang, kaya mo ’yan!',
      placement: 'auto',
    },
    {
      target: '[data-joyride="quiz-score"]',
      content: 'Makikita mo dito ang iyong kasalukuyang iskor. Ipakita ang iyong galing!',
      placement: 'auto',
    },
    {
      target: '[data-joyride="quiz-question"]',
      content: 'Makikita mo dito ang tanong na kailangan mong sagutin. Basahin ito nang mabuti!',
      placement: 'auto',
    },
    {
      target: '[data-joyride="quiz-question-image"]',
      content: 'Kung may larawan ang tanong, pindutin ito para makikita. Pansinin ang mga detalye sa larawan!',
      placement: 'auto',
    },
    { 
      target: '[data-joyride="quiz-question-speaker"]',
      content: 'Pindutin ito at pumili ng isang opsyon para marinig ang tanong. Makinig nang mabuti!',
      placement: 'auto',
    },
  ];
  const { currentUser, role, gradeLevel, setLoading } = useAuth();
  const { formattedGradeLevel } = useLogReg();
  const { selectedQuiz, setResults } = useQuizContext();
  const { isSeatWork } = useClassContext();
  const getInitialAnswers = useCallback(() => {
    const initialAnswers: { [key: string]: any } = {};
    if (selectedQuiz?.questions) {
      selectedQuiz.questions.forEach((question: any) => {
        if (question.type === 'identification') {
          const cluePositions = getClueLettersByGrade(question.answer, selectedQuiz.gradeLevel);
          initialAnswers[`${question.id}-cluePositions`] = cluePositions;
        }
        if (question.type === 'syllable') {
          const syllableCluePositions = getSyllableClues(question.syllableParts || [], selectedQuiz.gradeLevel);
          initialAnswers[`${question.id}-syllableCluePositions`] = syllableCluePositions;
        }
      });
    }
    return initialAnswers;
  }, [selectedQuiz]);
  const [answers, setAnswersState] = useState<{ [key: string]: any }>(getInitialAnswers());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const memoizedQuestions = useMemo(() => selectedQuiz?.questions, [selectedQuiz?.questions]);
  const currentQuestion = memoizedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === memoizedQuestions?.length - 1;
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const QUESTION_TIME = useMemo(() => getQuestionTimeByType(currentQuestion.type), [currentQuestion?.type]);
  const [timer, setTimer] = useState<number>(QUESTION_TIME);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const audioQueue = useAudioQueue(createAudioForJob);

  useEffect(() => {
    if (currentQuestion) {
      setTimer(QUESTION_TIME);
      setQuestionAnswered(false);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentQuestion]);

  const answersRef = useRef(answers);
  const totalScoreRef = useRef(totalScore);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { totalScoreRef.current = totalScore; }, [totalScore]);

  const setAnswers = useCallback((updater: any) => {
    setAnswersState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      answersRef.current = updated;
      return updated;
    });
  }, []);

  const { calculateScoreForQuestion } = usePartialScoring(memoizedQuestions);
  const { calculateScore: calculateSpeedScore } = useSpeedScoring();

  const handleTimeUp = useCallback(() => {
    if (!questionAnswered) {
      setQuestionAnswered(true);
      const accuracyScore = calculateScoreForQuestion(currentQuestionIndex, answersRef.current);
      const questionScore = Math.round(accuracyScore * 1000);
      setTotalScore((prev) => prev + questionScore);
      setTimeout(() => {
        if (isLastQuestion) {
          handleQuizComplete();
        } else {
          handleNextQuestion();
        }
      }, 1500);
    }
  }, [
    questionAnswered,
    answersRef.current,
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    calculateScoreForQuestion,
  ]);

  const { clearTimer } = useTimer({
    timer,
    isActive: !questionAnswered && currentQuestion && !run,
    onTick: () => setTimer((t) => t - 1),
    onTimeout: handleTimeUp,
  });

  const handleNextQuestion = useCallback(() => {
    audioQueue.stop();
    clearTimer();
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [clearTimer, audioQueue]);

  const handleAnswer = useCallback((answers: any) => {
    if (questionAnswered) return;
    setQuestionAnswered(true);
    const answerTime = Date.now() - questionStartTime;
    const accuracyScore = calculateScoreForQuestion(currentQuestionIndex, answers);
    const speedBonus = accuracyScore > 0
      ? calculateSpeedScore(answerTime, true, QUESTION_TIME)
      : 0;
    const questionScore = Math.round(accuracyScore * 1000) + speedBonus;
    setTotalScore((prev) => prev + questionScore);
    setTimeout(() => {
      if (isLastQuestion) {
        handleQuizComplete();
      } else {
        handleNextQuestion();
      }
    }, 1500);
  }, [questionAnswered, questionStartTime, currentQuestionIndex, isLastQuestion, calculateSpeedScore, calculateScoreForQuestion, currentQuestion?.id, handleNextQuestion]);

  const { 
    handleDragEnd, 
    cluePositions, 
    availableOptions,
    letterBank, 
    availableLetters,
    availableEnumerationItems,
    availableMatchingItems,
    shuffledSyllableIndexes,
  } = useQuizLogic({
    currentQuestion,
    answers: answersRef.current,
    setAnswers,
    isAnswered: questionAnswered,
    onAnswer: handleAnswer,
  });

  const totalScorePossible = useMemo(() => {
    if (!memoizedQuestions) return 0;
    return memoizedQuestions.length * 2000;
  }, [memoizedQuestions]);

  const handleQuizComplete = useCallback(async () => {
    audioQueue.stop();
    clearTimer();
    setIsSubmitting(true);
    setLoading(true);
    try {
      if (role === "Student") {
        if (isSeatWork) {
          await doSubmitSeatworkAnswers(
            currentUser?.uid || "",
            selectedQuiz.category,
            selectedQuiz.classId,
            selectedQuiz.id,
            answersRef.current,
            totalScoreRef.current,
            totalScorePossible,
            memoizedQuestions.length,
            gradeLevel || ""
          );
        } else {
          await doSubmitQuizAnswers(
            currentUser?.uid || "",
            selectedQuiz.category,
            selectedQuiz.classId,
            selectedQuiz.id,
            answersRef.current,
            totalScoreRef.current,
            totalScorePossible,
            memoizedQuestions.length,
            gradeLevel || ""
          );
        }
      }
      setQuizCompleted(true);
      setTimeout(() => {
        setResults({
          score: totalScoreRef.current, 
          totalQuizScore: totalScorePossible, 
          totalQuestions: memoizedQuestions.length,
          quizId: selectedQuiz.id,
          answers: answersRef.current, 
        });
        navigate(`/${role?.toLowerCase()}/${formattedGradeLevel}/quizzes/${selectedQuiz.category}/${selectedQuiz.id}/results`);
      }, 3000);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [clearTimer, answersRef.current, totalScoreRef.current, memoizedQuestions, totalScorePossible, currentUser?.uid, selectedQuiz, role, formattedGradeLevel, setResults, navigate, audioQueue]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (run && steps[stepIndex] && quizStepAudios[stepIndex]) {
      const audio = new Audio(quizStepAudios[stepIndex]);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [run, stepIndex, steps, quizStepAudios]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, action, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRun(false);
    } else if (type === 'step:after' && typeof index === 'number') {
      setStepIndex(action === 'prev' ? index - 1 : index + 1);
    }
  }, []);
  
  return (
    <div className={`relative flex-1 flex items-center justify-center ${role !== "Student" ? "bg-[#F8F8F8]" : "bg-[#FFA600]"}`}>
      <Joyride
        tooltipComponent={JoyrideCustomTooltip}
        callback={handleJoyrideCallback}
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        spotlightClicks
        styles={{
          options: {
            width: 300,
            arrowColor: '#a3380d',
            zIndex: 1000,
          },
        }}
      />
      <div className="flex-1 flex items-center justify-center z-50">
        <div className="w-full lg:h-[760px] p-6 py-4 space-y-8 transition-all duration-300">
          <QuizHeader
            isSubmitting={isSubmitting}
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={memoizedQuestions.length}
            totalScore={totalScore}
            timer={timer}
            questionTime={QUESTION_TIME}
            run={run}
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <QuestionWrapper
              key={currentQuestion?.id}
              question={currentQuestion}
              answers={answersRef.current}
              isAnswered={questionAnswered}
              cluePositions={cluePositions}
              availableOptions={availableOptions}
              letterBank={letterBank}
              availableLetters={availableLetters}
              availableEnumerationItems={availableEnumerationItems}
              availableMatchingItems={availableMatchingItems}
              shuffledSyllableIndexes={shuffledSyllableIndexes}
              audioQueue={audioQueue}
              run={run}
            />
          </DragDropContext>
        </div>
      </div>
      {quizCompleted && (
        <div className={"fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center overflow-hidden"}>
          <LottieTrophy />
        </div>
      )}
      {role !== "Student" && <Characters />}
    </div>
  );
};

export default QuizTake;
