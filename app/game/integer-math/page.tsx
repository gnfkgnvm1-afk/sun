"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  equation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// 정수의 덧셈 뺄셈 문제 30개
const allQuestions: Question[] = [
  { equation: "(+3) + (+5)", options: ["8", "-8", "2", "-2"], correctAnswer: "8", explanation: "양수끼리의 덧셈은 절댓값의 합에 + 부호를 붙입니다." },
  { equation: "(-4) + (-2)", options: ["-6", "6", "-2", "2"], correctAnswer: "-6", explanation: "음수끼리의 덧셈은 절댓값의 합에 - 부호를 붙입니다." },
  { equation: "(+7) + (-3)", options: ["4", "-4", "10", "-10"], correctAnswer: "4", explanation: "부호가 다른 덧셈은 절댓값의 차에 절댓값이 큰 쪽의 부호를 붙입니다. (7-3=4)" },
  { equation: "(-8) + (+5)", options: ["-3", "3", "-13", "13"], correctAnswer: "-3", explanation: "절댓값이 큰 쪽의 부호(-)를 붙이고 차이를 구합니다. (8-5=3)" },
  { equation: "(-1) + (+1)", options: ["0", "2", "-2", "1"], correctAnswer: "0", explanation: "절댓값이 같고 부호가 다르면 합은 0이 됩니다." },
  { equation: "(+6) - (+2)", options: ["4", "-4", "8", "-8"], correctAnswer: "4", explanation: "뺄셈은 빼는 수의 부호를 바꾸어 덧셈으로 고칩니다. (+6) + (-2) = 4" },
  { equation: "(-5) - (-3)", options: ["-2", "2", "-8", "8"], correctAnswer: "-2", explanation: "(-5) + (+3) 으로 고쳐 계산하면 -2 입니다." },
  { equation: "(+4) - (-7)", options: ["11", "-11", "-3", "3"], correctAnswer: "11", explanation: "(+4) + (+7) 로 부호가 바뀌어 11이 됩니다." },
  { equation: "(-2) - (+6)", options: ["-8", "8", "4", "-4"], correctAnswer: "-8", explanation: "(-2) + (-6) 이 되어 -8이 됩니다." },
  { equation: "0 - (-5)", options: ["5", "-5", "0", "1"], correctAnswer: "5", explanation: "0 + (+5) 로 바뀌어 5가 됩니다." },
  { equation: "(-9) + (+9)", options: ["0", "-18", "18", "9"], correctAnswer: "0", explanation: "절댓값이 같고 부호가 다르면 합은 0입니다." },
  { equation: "(+12) + (-5)", options: ["7", "-7", "17", "-17"], correctAnswer: "7", explanation: "절댓값이 큰 쪽의 부호(+)를 붙이고 차를 구합니다." },
  { equation: "(-15) + (-4)", options: ["-19", "19", "-11", "11"], correctAnswer: "-19", explanation: "음수끼리 더하므로 절댓값의 합에 - 를 붙입니다." },
  { equation: "(+8) - (+10)", options: ["-2", "2", "-18", "18"], correctAnswer: "-2", explanation: "(+8) + (-10) 이 되어 -2가 됩니다." },
  { equation: "(-3) - (-12)", options: ["9", "-9", "-15", "15"], correctAnswer: "9", explanation: "(-3) + (+12) 로 바뀌어 9가 됩니다." },
  { equation: "(+14) - (-6)", options: ["20", "-20", "8", "-8"], correctAnswer: "20", explanation: "(+14) + (+6) 으로 바뀌어 20이 됩니다." },
  { equation: "(-7) - (+8)", options: ["-15", "15", "-1", "1"], correctAnswer: "-15", explanation: "(-7) + (-8) 이 되어 -15가 됩니다." },
  { equation: "0 + (-11)", options: ["-11", "11", "0", "-1"], correctAnswer: "-11", explanation: "0에 어떤 수를 더해도 그 수 자체가 됩니다." },
  { equation: "(-6) + (+13)", options: ["7", "-7", "-19", "19"], correctAnswer: "7", explanation: "절댓값이 큰 쪽의 부호(+)를 붙이고 차를 구합니다." },
  { equation: "(+5) + (-15)", options: ["-10", "10", "-20", "20"], correctAnswer: "-10", explanation: "절댓값이 큰 쪽의 부호(-)를 붙이고 차를 구합니다." },
  { equation: "(-20) - (-5)", options: ["-15", "15", "-25", "25"], correctAnswer: "-15", explanation: "(-20) + (+5) 로 바뀌어 -15가 됩니다." },
  { equation: "(+9) - (+4)", options: ["5", "-5", "13", "-13"], correctAnswer: "5", explanation: "(+9) + (-4) 로 계산하여 5가 됩니다." },
  { equation: "(-10) + (-10)", options: ["-20", "20", "0", "-100"], correctAnswer: "-20", explanation: "음수끼리의 합이므로 -20이 됩니다." },
  { equation: "(+18) + (-8)", options: ["10", "-10", "26", "-26"], correctAnswer: "10", explanation: "절댓값의 차 10에 큰 쪽 부호(+)를 붙입니다." },
  { equation: "(-2) - (-2)", options: ["0", "-4", "4", "2"], correctAnswer: "0", explanation: "(-2) + (+2) 가 되어 0이 됩니다." },
  { equation: "(+7) - (-7)", options: ["14", "-14", "0", "7"], correctAnswer: "14", explanation: "(+7) + (+7) 로 바뀌어 14가 됩니다." },
  { equation: "(-12) + (+4)", options: ["-8", "8", "-16", "16"], correctAnswer: "-8", explanation: "차이 8에 큰 쪽 부호(-)를 붙입니다." },
  { equation: "(+11) - (+15)", options: ["-4", "4", "26", "-26"], correctAnswer: "-4", explanation: "(+11) + (-15) 가 되어 -4가 됩니다." },
  { equation: "(-5) - (+10)", options: ["-15", "15", "-5", "5"], correctAnswer: "-15", explanation: "(-5) + (-10) 이 되어 -15가 됩니다." },
  { equation: "0 - (+8)", options: ["-8", "8", "0", "1"], correctAnswer: "-8", explanation: "0 + (-8) 로 바뀌어 -8이 됩니다." }
];

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function IntegerMathGame() {
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
    return <div className="p-20 text-center">문제를 불러오는 중...</div>;
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
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-4">최종 점수 (100점 만점)</p>
          <p className="text-6xl font-black text-emerald-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-all"
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
            className="bg-emerald-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        정수의 덧셈과 뺄셈을 풀어보세요!
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-50 text-center relative overflow-hidden">
        
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
                className="text-4xl font-bold font-mono bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border-2 border-slate-200 hover:border-emerald-300 rounded-2xl py-6 transition-all hover:scale-105 active:scale-95"
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
              className="w-full px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl transition-all shadow-lg shadow-emerald-200"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
