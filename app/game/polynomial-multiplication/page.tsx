"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  a: number;
  b: number;
  c: number;
  d: number;
};

// 사용자가 요청한 사진에 있는 16개 문제 + 추가 4개 = 총 20개
const allQuestions: Question[] = [
  { a: 1, b: 5, c: 2, d: 3 },      // (x+5)(2x+3)
  { a: 3, b: 5, c: 2, d: -5 },     // (3x+5)(2x-5)
  { a: -1, b: 7, c: 3, d: 7 },     // (-x+7)(3x+7)
  { a: 4, b: 5, c: 2, d: -5 },     // (4x+5)(2x-5)
  
  { a: 4, b: 15, c: -2, d: 3 },    // (4x+15)(-2x+3)
  { a: 3, b: 2, c: 2, d: 3 },      // (3x+2)(2x+3)
  { a: 6, b: 1, c: -2, d: 3 },     // (6x+1)(-2x+3)
  { a: 3, b: 5, c: 2, d: -9 },     // (3x+5)(2x-9)
  
  { a: 4, b: 3, c: 3, d: 2 },      // (4x+3)(3x+2)
  { a: 2, b: -3, c: 2, d: 3 },     // (2x-3)(2x+3)
  { a: 2, b: -5, c: 2, d: 5 },     // (2x-5)(2x+5)
  { a: 3, b: 5, c: 3, d: -5 },     // (3x+5)(3x-5)
  
  { a: -2, b: 7, c: -2, d: -7 },   // (-2x+7)(-2x-7)
  { a: 3, b: 5, c: 3, d: 5 },      // (3x+5)(3x+5)
  { a: 2, b: -7, c: 2, d: -7 },    // (2x-7)(2x-7)
  { a: 5, b: -2, c: 5, d: -2 },    // (5x-2)(5x-2)
  
  // 추가 문제
  { a: 1, b: 2, c: 1, d: 3 },      // (x+2)(x+3)
  { a: 2, b: -1, c: 1, d: 4 },     // (2x-1)(x+4)
  { a: 3, b: -2, c: 3, d: 2 },     // (3x-2)(3x+2)
  { a: -1, b: 4, c: -1, d: -4 }    // (-x+4)(-x-4)
];

function formatPoly(a: number, b: number) {
  const ax = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const sign = b > 0 ? "+" : "-";
  const absB = Math.abs(b);
  return `${ax} ${sign} ${absB}`;
}

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PolynomialMultiplicationGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // 입력값 상태
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");
  const [valC, setValC] = useState("");

  useEffect(() => {
    // 20개 중 10개를 무작위로 뽑습니다.
    setQuestions(shuffle(allQuestions).slice(0, 10));
  }, []);

  if (questions.length === 0) {
    return <div className="p-20 text-center">문제를 불러오는 중...</div>;
  }

  const currentQ = questions[currentIndex];
  
  // 정답 계산
  const correctA = currentQ.a * currentQ.c;
  const correctB = currentQ.a * currentQ.d + currentQ.b * currentQ.c;
  const correctC = currentQ.b * currentQ.d;

  const handleSubmit = () => {
    // 입력값이 없으면 0으로 처리하지 않고 오답으로 처리하거나 경고를 줄 수 있지만, 여기서는 빈칸은 무시하도록 Number 변환 시 체크
    if (valA === "" || valB === "" || valC === "") {
      alert("세 칸을 모두 채워주세요! (0인 경우 0을 입력하세요)");
      return;
    }

    const isA = parseInt(valA) === correctA;
    const isB = parseInt(valB) === correctB;
    const isC = parseInt(valC) === correctC;

    const correct = isA && isB && isC;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setValA("");
    setValB("");
    setValC("");
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
    setValA("");
    setValB("");
    setValC("");
  };

  if (gameOver) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          🎉 게임 완료! 🎉
        </h1>
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-amber-100 border border-amber-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-4">최종 점수 (100점 만점)</p>
          <p className="text-6xl font-black text-amber-500 mb-8">{score}점</p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all"
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
            className="bg-amber-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
        식의 곱셈 (세로 계산)
      </h1>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-amber-100 border border-amber-50 text-center relative overflow-hidden">
        
        {/* 세로 식 UI */}
        <div className="flex flex-col items-center mb-10">
          <div className="font-mono text-3xl md:text-4xl text-slate-800 tracking-wider">
            <div className="flex justify-end mb-2">
              <div className="w-48 text-right">{formatPoly(currentQ.a, currentQ.b)}</div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b-4 border-slate-800 w-64">
              <span className="text-slate-400">×</span>
              <div className="w-48 text-right">{formatPoly(currentQ.c, currentQ.d)}</div>
            </div>
          </div>
        </div>

        {/* 입력 칸 UI */}
        {!showFeedback ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 md:gap-4 font-mono text-2xl md:text-3xl mb-8">
              <input 
                type="number" 
                value={valA} 
                onChange={(e) => setValA(e.target.value)}
                className="w-16 h-16 md:w-20 md:h-20 text-center border-4 border-amber-200 focus:border-amber-500 outline-none rounded-2xl bg-amber-50 text-slate-800 transition-colors"
                placeholder="?"
              />
              <span className="text-slate-700">x²</span>
              
              <span className="text-slate-400 font-black">+</span>
              
              <input 
                type="number" 
                value={valB} 
                onChange={(e) => setValB(e.target.value)}
                className="w-16 h-16 md:w-20 md:h-20 text-center border-4 border-amber-200 focus:border-amber-500 outline-none rounded-2xl bg-amber-50 text-slate-800 transition-colors"
                placeholder="?"
              />
              <span className="text-slate-700">x</span>
              
              <span className="text-slate-400 font-black">+</span>
              
              <input 
                type="number" 
                value={valC} 
                onChange={(e) => setValC(e.target.value)}
                className="w-16 h-16 md:w-20 md:h-20 text-center border-4 border-amber-200 focus:border-amber-500 outline-none rounded-2xl bg-amber-50 text-slate-800 transition-colors"
                placeholder="?"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="px-10 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition-all shadow-lg shadow-amber-200 active:scale-95"
            >
              정답 확인 🚀
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className={`text-3xl font-bold mb-4 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? "🎉 정답입니다! 🎉" : "🥲 아쉽네요, 틀렸어요!"}
            </div>
            
            {/* 정답 해설 표시 */}
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left border border-slate-100 flex flex-col items-center">
              <p className="text-lg text-slate-500 font-bold mb-2">올바른 계산 결과</p>
              <div className="font-mono text-2xl text-slate-800">
                {correctA}x² {correctB >= 0 ? '+' : '-'} {Math.abs(correctB)}x {correctC >= 0 ? '+' : '-'} {Math.abs(correctC)}
              </div>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition-all shadow-lg shadow-amber-200 active:scale-95"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
