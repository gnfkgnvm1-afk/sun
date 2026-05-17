"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  equation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// 중1 일차방정식 문제 30개
const allQuestions: Question[] = [
  { equation: "x + 5 = 9", options: ["4", "-4", "14", "-14"], correctAnswer: "4", explanation: "5를 우변으로 이항하면 x = 9 - 5 이므로 x = 4 입니다." },
  { equation: "x - 3 = 4", options: ["7", "-7", "1", "-1"], correctAnswer: "7", explanation: "-3을 우변으로 이항하면 x = 4 + 3 이므로 x = 7 입니다." },
  { equation: "2x = 8", options: ["4", "2", "6", "16"], correctAnswer: "4", explanation: "양변을 x의 계수인 2로 나누면 x = 4 입니다." },
  { equation: "3x - 1 = 11", options: ["4", "3", "12", "-4"], correctAnswer: "4", explanation: "-1을 이항하면 3x = 12, 양변을 3으로 나누면 x = 4 입니다." },
  { equation: "2x + 5 = 1", options: ["-2", "2", "-3", "3"], correctAnswer: "-2", explanation: "5를 이항하면 2x = -4, 양변을 2로 나누면 x = -2 입니다." },
  { equation: "5x + 3 = 18", options: ["3", "-3", "15", "4"], correctAnswer: "3", explanation: "3을 이항하면 5x = 15, 양변을 5로 나누면 x = 3 입니다." },
  { equation: "-x + 4 = 7", options: ["-3", "3", "11", "-11"], correctAnswer: "-3", explanation: "4를 이항하면 -x = 3, 양변에 -1을 곱하면 x = -3 입니다." },
  { equation: "-2x = -10", options: ["5", "-5", "12", "-12"], correctAnswer: "5", explanation: "양변을 -2로 나누면 x = 5 입니다." },
  { equation: "3x + 7 = 1", options: ["-2", "2", "-8", "8"], correctAnswer: "-2", explanation: "7을 이항하면 3x = -6, 양변을 3으로 나누면 x = -2 입니다." },
  { equation: "4x - 5 = 7", options: ["3", "-3", "12", "4"], correctAnswer: "3", explanation: "-5를 이항하면 4x = 12, 양변을 4로 나누면 x = 3 입니다." },
  { equation: "x/2 + 1 = 4", options: ["6", "8", "5", "10"], correctAnswer: "6", explanation: "1을 이항하면 x/2 = 3, 양변에 2를 곱하면 x = 6 입니다." },
  { equation: "2(x - 3) = 6", options: ["6", "3", "9", "5"], correctAnswer: "6", explanation: "괄호를 풀면 2x - 6 = 6, 이항하면 2x = 12 이므로 x = 6 입니다." },
  { equation: "3(x + 1) = -6", options: ["-3", "3", "-9", "-2"], correctAnswer: "-3", explanation: "괄호를 풀면 3x + 3 = -6, 이항하면 3x = -9 이므로 x = -3 입니다." },
  { equation: "2x = x + 5", options: ["5", "-5", "10", "3"], correctAnswer: "5", explanation: "우변의 x를 좌변으로 이항하면 2x - x = 5 이므로 x = 5 입니다." },
  { equation: "3x - 2 = x + 6", options: ["4", "2", "8", "-4"], correctAnswer: "4", explanation: "이항하여 정리하면 3x - x = 6 + 2 => 2x = 8 이므로 x = 4 입니다." },
  { equation: "5x + 4 = 2x - 5", options: ["-3", "3", "-9", "9"], correctAnswer: "-3", explanation: "이항하여 정리하면 5x - 2x = -5 - 4 => 3x = -9 이므로 x = -3 입니다." },
  { equation: "4 - x = 2x + 10", options: ["-2", "2", "-6", "6"], correctAnswer: "-2", explanation: "이항하여 정리하면 -x - 2x = 10 - 4 => -3x = 6 이므로 x = -2 입니다." },
  { equation: "3x + 1 = -x + 9", options: ["2", "-2", "4", "8"], correctAnswer: "2", explanation: "이항하여 정리하면 3x + x = 9 - 1 => 4x = 8 이므로 x = 2 입니다." },
  { equation: "-2(x - 4) = 12", options: ["-2", "2", "-8", "10"], correctAnswer: "-2", explanation: "괄호를 풀면 -2x + 8 = 12 => -2x = 4 이므로 x = -2 입니다." },
  { equation: "3x = 0", options: ["0", "3", "-3", "1"], correctAnswer: "0", explanation: "어떤 수에 x를 곱해 0이 되려면 x는 0이어야 합니다." },
  { equation: "x/3 - 2 = -1", options: ["3", "-3", "9", "6"], correctAnswer: "3", explanation: "-2를 이항하면 x/3 = 1, 양변에 3을 곱하면 x = 3 입니다." },
  { equation: "x - 7 = -10", options: ["-3", "3", "-17", "17"], correctAnswer: "-3", explanation: "-7을 이항하면 x = -10 + 7 이므로 x = -3 입니다." },
  { equation: "4x + 6 = 2", options: ["-1", "1", "-2", "2"], correctAnswer: "-1", explanation: "6을 이항하면 4x = -4, 양변을 4로 나누면 x = -1 입니다." },
  { equation: "3x + 2 = 14", options: ["4", "-4", "12", "6"], correctAnswer: "4", explanation: "2를 이항하면 3x = 12, 양변을 3으로 나누면 x = 4 입니다." },
  { equation: "-5x + 3 = -12", options: ["3", "-3", "15", "-15"], correctAnswer: "3", explanation: "3을 이항하면 -5x = -15, 양변을 -5로 나누면 x = 3 입니다." },
  { equation: "2x - 9 = -3", options: ["3", "-3", "6", "-6"], correctAnswer: "3", explanation: "-9를 이항하면 2x = 6, 양변을 2로 나누면 x = 3 입니다." },
  { equation: "3(2x - 1) = 9", options: ["2", "1", "3", "5"], correctAnswer: "2", explanation: "괄호를 풀면 6x - 3 = 9 => 6x = 12 이므로 x = 2 입니다." },
  { equation: "-x/4 = 3", options: ["-12", "12", "-7", "7"], correctAnswer: "-12", explanation: "양변에 -4를 곱하면 x = -12 입니다." },
  { equation: "x + 8 = 2", options: ["-6", "6", "-10", "10"], correctAnswer: "-6", explanation: "8을 이항하면 x = 2 - 8 이므로 x = -6 입니다." },
  { equation: "7x - 4 = 3x + 12", options: ["4", "-4", "16", "8"], correctAnswer: "4", explanation: "이항하여 정리하면 7x - 3x = 12 + 4 => 4x = 16 이므로 x = 4 입니다." }
];

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function LinearEquationGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const getRandomQuestions = () => {
    const selected = shuffle(allQuestions).slice(0, 10);
    return selected.map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
  };

  useEffect(() => {
    // 30개 중 10개를 무작위로 뽑고 보기 순서도 섞습니다.
    setQuestions(getRandomQuestions());
  }, []);

  if (questions.length === 0) {
    return <div className="p-20 text-center text-lg font-bold text-slate-600">문제를 불러오는 중...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 10);
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
    setQuestions(getRandomQuestions());
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
          <p className="text-2xl text-slate-600 mb-4">최종 점수 (100점 만점)</p>
          <p className="text-6xl font-black text-pink-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-all shadow-lg shadow-pink-200"
            >
              다른 문제로 다시 하기
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
            className="bg-pink-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        일차방정식을 풀고 x의 값을 구해보세요!
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 text-center relative overflow-hidden">
        
        <div className="mb-12">
          <p className="text-5xl font-black text-slate-800 font-mono bg-slate-50 inline-block px-10 py-6 rounded-3xl border-2 border-slate-100">
            {currentQuestion.equation}
          </p>
        </div>

        {/* 선택 버튼들 */}
        {!showFeedback ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={`${option}-${idx}`}
                onClick={() => handleAnswer(option)}
                className="text-4xl font-bold font-mono bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border-2 border-slate-200 hover:border-pink-300 rounded-2xl py-6 transition-all hover:scale-105 active:scale-95"
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
