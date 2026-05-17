"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  initialCondition: string;
  operation: string;
  correctAnswer: string;
  explanation: string;
};

const questions: Question[] = [
  {
    initialCondition: "a < b",
    operation: "양변에 2를 더하면?",
    correctAnswer: "<",
    explanation: "같은 수를 더해도 부등호 방향은 그대로 유지됩니다!",
  },
  {
    initialCondition: "x > y",
    operation: "양변에 -5를 곱하면?",
    correctAnswer: "<",
    explanation: "🔥주의! 음수를 곱하면 부등호 방향이 반대로 바뀝니다!",
  },
  {
    initialCondition: "-2a ≤ -2b",
    operation: "양변을 -2로 나누면?",
    correctAnswer: "≥",
    explanation: "🔥주의! 음수로 나누면 부등호 방향이 반대로 바뀝니다!",
  },
  {
    initialCondition: "3x ≥ 3y",
    operation: "양변을 3으로 나누면?",
    correctAnswer: "≥",
    explanation: "양수로 나누면 부등호 방향은 그대로 유지됩니다!",
  },
  {
    initialCondition: "a < b",
    operation: "양변에서 10을 빼면?",
    correctAnswer: "<",
    explanation: "같은 수를 빼도 부등호 방향은 그대로 유지됩니다!",
  },
];

export default function InequalityGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 20);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          🎉 게임 완료! 🎉
        </h1>
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-4">최종 점수</p>
          <p className="text-6xl font-black text-pink-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-all"
            >
              다시 하기
            </button>
            <Link href="/" className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      
      {/* 진행 상황 바 */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
          <span>문제 {currentIndex + 1} / {questions.length}</span>
          <span>점수: {score}점</span>
        </div>
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-pink-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        부등식의 방향은 어떻게 될까요?
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 text-center relative overflow-hidden">
        
        <div className="mb-8">
          <p className="text-slate-500 font-medium mb-2">기본 조건</p>
          <p className="text-4xl font-black text-slate-800 font-mono bg-slate-50 inline-block px-6 py-3 rounded-2xl">
            {currentQuestion.initialCondition}
          </p>
        </div>

        <div className="mb-12">
          <p className="text-2xl font-bold text-blue-600">
            👉 {currentQuestion.operation}
          </p>
        </div>

        {/* 선택 버튼들 */}
        {!showFeedback ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["<", ">", "≤", "≥"].map((sign) => (
              <button
                key={sign}
                onClick={() => handleAnswer(sign)}
                className="text-4xl font-black font-mono bg-slate-50 hover:bg-pink-50 hover:text-pink-500 border-2 border-slate-200 hover:border-pink-300 rounded-2xl py-6 transition-all hover:scale-105 active:scale-95"
              >
                {sign}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className={`text-3xl font-bold mb-4 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? "🎉 정답입니다! 🎉" : "🥲 아쉽네요, 틀렸어요!"}
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left border border-slate-100">
              <p className="text-lg text-slate-700 font-medium">
                💡 <span className="font-bold">해설:</span> {currentQuestion.explanation}
              </p>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl transition-all shadow-lg shadow-pink-200"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
