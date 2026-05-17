"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  equation: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// 정수의 곱셈 문제 30개
const allQuestions: Question[] = [
  { equation: "(+3) × (+5)", options: ["15", "-15", "8", "-8"], correctAnswer: "15", explanation: "양수와 양수를 곱하면 결과는 항상 양수(+)입니다." },
  { equation: "(-4) × (-2)", options: ["8", "-8", "-6", "6"], correctAnswer: "8", explanation: "음수와 음수를 곱하면 결과는 항상 양수(+)입니다." },
  { equation: "(+7) × (-3)", options: ["-21", "21", "4", "-4"], correctAnswer: "-21", explanation: "양수와 음수를 곱하면 부호가 다르므로 결과는 음수(-)입니다." },
  { equation: "(-8) × (+5)", options: ["-40", "40", "-3", "3"], correctAnswer: "-40", explanation: "음수와 양수를 곱하면 부호가 다르므로 결과는 음수(-)입니다." },
  { equation: "(-1) × (+1)", options: ["-1", "1", "0", "-2"], correctAnswer: "-1", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-6) × (-2)", options: ["12", "-12", "-8", "8"], correctAnswer: "12", explanation: "음수와 음수의 곱은 양수(+)가 됩니다." },
  { equation: "(+5) × (+3)", options: ["15", "-15", "8", "-8"], correctAnswer: "15", explanation: "양수끼리의 곱은 양수(+)입니다." },
  { equation: "(+4) × (-7)", options: ["-28", "28", "-3", "3"], correctAnswer: "-28", explanation: "부호가 다르므로 결과는 음수(-)입니다." },
  { equation: "(-2) × (+6)", options: ["-12", "12", "4", "-4"], correctAnswer: "-12", explanation: "부호가 다르므로 결과는 음수(-)입니다." },
  { equation: "0 × (-5)", options: ["0", "-5", "5", "1"], correctAnswer: "0", explanation: "어떤 수에 0을 곱해도 결과는 항상 0입니다." },
  { equation: "(-9) × (-9)", options: ["81", "-81", "0", "-18"], correctAnswer: "81", explanation: "같은 부호(음수)끼리의 곱은 양수(+)입니다." },
  { equation: "(+12) × (-5)", options: ["-60", "60", "7", "-7"], correctAnswer: "-60", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-15) × (-4)", options: ["60", "-60", "-19", "19"], correctAnswer: "60", explanation: "음수와 음수의 곱은 양수(+)입니다." },
  { equation: "(+8) × (+10)", options: ["80", "-80", "18", "-18"], correctAnswer: "80", explanation: "양수끼리의 곱은 양수(+)입니다." },
  { equation: "(-3) × (+12)", options: ["-36", "36", "9", "-9"], correctAnswer: "-36", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-14) × (-2)", options: ["28", "-28", "-16", "16"], correctAnswer: "28", explanation: "음수와 음수의 곱은 양수(+)입니다." },
  { equation: "(-7) × (+8)", options: ["-56", "56", "-15", "15"], correctAnswer: "-56", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "0 × (+11)", options: ["0", "11", "-11", "1"], correctAnswer: "0", explanation: "0을 곱하면 무조건 0이 됩니다." },
  { equation: "(-6) × (-13)", options: ["78", "-78", "-19", "19"], correctAnswer: "78", explanation: "음수와 음수의 곱은 양수(+)입니다." },
  { equation: "(+5) × (-15)", options: ["-75", "75", "-10", "10"], correctAnswer: "-75", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-20) × (-5)", options: ["100", "-100", "-25", "25"], correctAnswer: "100", explanation: "같은 부호끼리의 곱은 양수(+)입니다." },
  { equation: "(+9) × (+4)", options: ["36", "-36", "13", "-13"], correctAnswer: "36", explanation: "양수끼리의 곱은 양수(+)입니다." },
  { equation: "(-10) × (-10)", options: ["100", "-100", "-20", "20"], correctAnswer: "100", explanation: "음수끼리의 곱은 양수(+)입니다." },
  { equation: "(+18) × (-2)", options: ["-36", "36", "16", "-16"], correctAnswer: "-36", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-2) × (-2)", options: ["4", "-4", "0", "-8"], correctAnswer: "4", explanation: "음수끼리의 곱은 양수(+)입니다." },
  { equation: "(+7) × (-7)", options: ["-49", "49", "0", "14"], correctAnswer: "-49", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(-12) × (+4)", options: ["-48", "48", "-8", "8"], correctAnswer: "-48", explanation: "부호가 다르면 결과는 음수(-)입니다." },
  { equation: "(+11) × (+5)", options: ["55", "-55", "16", "-16"], correctAnswer: "55", explanation: "양수끼리의 곱은 양수(+)입니다." },
  { equation: "(-5) × (-10)", options: ["50", "-50", "-15", "15"], correctAnswer: "50", explanation: "음수와 음수의 곱은 양수(+)입니다." },
  { equation: "(-8) × 0", options: ["0", "-8", "8", "1"], correctAnswer: "0", explanation: "어떤 수에 0을 곱해도 결과는 항상 0입니다." }
];

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function IntegerMultiplicationGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // 30개 중 10개를 무작위로 뽑습니다.
    setQuestions(shuffle(allQuestions).slice(0, 10));
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
    setQuestions(shuffle(allQuestions).slice(0, 10));
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
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-100 border border-purple-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-4">최종 점수 (100점 만점)</p>
          <p className="text-6xl font-black text-purple-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all"
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
            className="bg-purple-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        정수의 곱셈을 풀어보세요!
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-purple-100 border border-purple-50 text-center relative overflow-hidden">
        
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
                className="text-4xl font-bold font-mono bg-slate-50 hover:bg-purple-50 hover:text-purple-600 border-2 border-slate-200 hover:border-purple-300 rounded-2xl py-6 transition-all hover:scale-105 active:scale-95"
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
              className="w-full px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xl transition-all shadow-lg shadow-purple-200"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
