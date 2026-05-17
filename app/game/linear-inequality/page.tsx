"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  equation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const questions: Question[] = [
  {
    equation: "2x < 8",
    options: ["x < 4", "x > 4", "x < 6", "x > 6"],
    correctAnswer: "x < 4",
    explanation: "양변을 2로 나누면 부등호 방향은 그대로 유지되며 x < 4 가 됩니다.",
  },
  {
    equation: "-3x > 12",
    options: ["x > -4", "x < -4", "x > 4", "x < 4"],
    correctAnswer: "x < -4",
    explanation: "🔥 양변을 음수(-3)로 나누면 부등호의 방향이 반대로 바뀝니다!",
  },
  {
    equation: "x + 5 ≤ 2",
    options: ["x ≤ 3", "x ≥ 3", "x ≤ -3", "x ≥ -3"],
    correctAnswer: "x ≤ -3",
    explanation: "+5를 우변으로 이항하면 x ≤ 2 - 5 가 되어 x ≤ -3 이 됩니다.",
  },
  {
    equation: "-2x + 1 ≥ 7",
    options: ["x ≥ 3", "x ≤ 3", "x ≥ -3", "x ≤ -3"],
    correctAnswer: "x ≤ -3",
    explanation: "1을 이항하면 -2x ≥ 6, 양변을 -2로 나누면 부등호가 바뀌어 x ≤ -3 이 됩니다.",
  },
  {
    equation: "3x - 4 < x + 6",
    options: ["x < 1", "x > 1", "x < 5", "x > 5"],
    correctAnswer: "x < 5",
    explanation: "x를 왼쪽으로, 숫자를 오른쪽으로 이항하면 2x < 10 이 되고, 양변을 2로 나누면 x < 5 가 됩니다.",
  },
];

export default function LinearInequalityGame() {
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
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-4">최종 점수</p>
          <p className="text-6xl font-black text-blue-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg transition-all"
            >
              다시 하기
            </button>
            <Link href="/playground" className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all">
              놀이터로 돌아가기
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
            className="bg-blue-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        다음 일차부등식을 풀어보세요!
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 text-center relative overflow-hidden">
        
        <div className="mb-12">
          <p className="text-5xl font-black text-slate-800 font-mono bg-slate-50 inline-block px-10 py-6 rounded-3xl border-2 border-slate-100">
            {currentQuestion.equation}
          </p>
        </div>

        {/* 선택 버튼들 */}
        {!showFeedback ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="text-3xl font-bold font-mono bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border-2 border-slate-200 hover:border-blue-300 rounded-2xl py-6 transition-all hover:scale-105 active:scale-95"
              >
                {option}
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
              className="w-full px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl transition-all shadow-lg shadow-blue-200"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
