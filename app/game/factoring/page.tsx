"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import Link from "next/link";

// 인수분해 문제: ax²+bx+c = (p·x+q)(r·x+s) 형태
// 식의 곱셈 게임에서 그대로 가져온 문제를 역방향으로 사용
type Question = {
  // 전개된 이차식: A·x² + B·x + C
  A: number;
  B: number;
  C: number;
  // 정답 인수: (px+q)(rx+s)
  p: number;
  q: number;
  r: number;
  s: number;
  // 힌트용 설명
  hint?: string;
};

// 식의 곱셈 (ax+b)(cx+d) = ac·x² + (ad+bc)·x + bd 로부터 역산
// 문제 배열: 식의 곱셈 게임의 16+4 문제를 역으로
const allQuestions: Question[] = [
  // (x+5)(2x+3) = 2x² + 13x + 15
  { A: 2,  B: 13,  C: 15,   p: 1,  q: 5,   r: 2, s: 3  },
  // (3x+5)(2x-5) = 6x² - 5x - 25
  { A: 6,  B: -5,  C: -25,  p: 3,  q: 5,   r: 2, s: -5 },
  // (3x+2)(2x+3) = 6x² + 13x + 6
  { A: 6,  B: 13,  C: 6,    p: 3,  q: 2,   r: 2, s: 3  },
  // (4x+3)(3x+2) = 12x² + 17x + 6
  { A: 12, B: 17,  C: 6,    p: 4,  q: 3,   r: 3, s: 2  },
  // (3x+5)(2x-9) = 6x² - 17x - 45
  { A: 6,  B: -17, C: -45,  p: 3,  q: 5,   r: 2, s: -9 },
  // (x+2)(x+3) = x² + 5x + 6
  { A: 1,  B: 5,   C: 6,    p: 1,  q: 2,   r: 1, s: 3  },
  // (2x-1)(x+4) = 2x² + 7x - 4
  { A: 2,  B: 7,   C: -4,   p: 2,  q: -1,  r: 1, s: 4  },
  // (4x+5)(2x-5) = 8x² - 10x - 25
  { A: 8,  B: -10, C: -25,  p: 4,  q: 5,   r: 2, s: -5 },
  // 완전제곱식: (3x+5)² = 9x² + 30x + 25
  { A: 9,  B: 30,  C: 25,   p: 3,  q: 5,   r: 3, s: 5,  hint: "완전제곱식이에요!" },
  // 완전제곱식: (2x-7)² = 4x² - 28x + 49
  { A: 4,  B: -28, C: 49,   p: 2,  q: -7,  r: 2, s: -7, hint: "완전제곱식이에요!" },
  // 완전제곱식: (5x-2)² = 25x² - 20x + 4
  { A: 25, B: -20, C: 4,    p: 5,  q: -2,  r: 5, s: -2, hint: "완전제곱식이에요!" },
  // 합차공식: (2x-3)(2x+3) = 4x² - 9
  { A: 4,  B: 0,   C: -9,   p: 2,  q: -3,  r: 2, s: 3,  hint: "합차공식이에요! (a+b)(a-b)" },
  // 합차공식: (2x-5)(2x+5) = 4x² - 25
  { A: 4,  B: 0,   C: -25,  p: 2,  q: -5,  r: 2, s: 5,  hint: "합차공식이에요! (a+b)(a-b)" },
  // 합차공식: (3x+5)(3x-5) = 9x² - 25
  { A: 9,  B: 0,   C: -25,  p: 3,  q: 5,   r: 3, s: -5, hint: "합차공식이에요! (a+b)(a-b)" },
  // 합차공식: (3x-2)(3x+2) = 9x² - 4
  { A: 9,  B: 0,   C: -4,   p: 3,  q: -2,  r: 3, s: 2,  hint: "합차공식이에요! (a+b)(a-b)" },
  // (2x-1)(x+4) = 2x² + 7x - 4 (다른 문제로 대체)
  // (x+5)(x-3) = x² + 2x - 15
  { A: 1,  B: 2,   C: -15,  p: 1,  q: 5,   r: 1, s: -3 },
  // (2x+3)(x-2) = 2x² - x - 6
  { A: 2,  B: -1,  C: -6,   p: 2,  q: 3,   r: 1, s: -2 },
  // (3x-1)(x+5) = 3x² + 14x - 5
  { A: 3,  B: 14,  C: -5,   p: 3,  q: -1,  r: 1, s: 5  },
  // 완전제곱식: (x+4)² = x² + 8x + 16
  { A: 1,  B: 8,   C: 16,   p: 1,  q: 4,   r: 1, s: 4,  hint: "완전제곱식이에요!" },
  // 합차공식: (x-6)(x+6) = x² - 36
  { A: 1,  B: 0,   C: -36,  p: 1,  q: -6,  r: 1, s: 6,  hint: "합차공식이에요! (a+b)(a-b)" },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 이차식을 보기 좋게 렌더링 (예: 6x² - 5x - 25)
function formatQuadratic(A: number, B: number, C: number): string {
  let result = "";

  // A·x² 항
  if (A === 1) result += "x²";
  else if (A === -1) result += "-x²";
  else result += `${A}x²`;

  // B·x 항
  if (B > 0) result += ` + ${B}x`;
  else if (B < 0) result += ` - ${Math.abs(B)}x`;
  // B=0이면 생략

  // C 항
  if (C > 0) result += ` + ${C}`;
  else if (C < 0) result += ` - ${Math.abs(C)}`;
  // C=0이면 생략

  return result;
}

// 인수를 보기 좋게 렌더링 (예: 3x + 5)
function formatFactor(coef: number, constant: number): string {
  const xPart = coef === 1 ? "x" : coef === -1 ? "-x" : `${coef}x`;
  if (constant === 0) return xPart;
  const sign = constant > 0 ? "+" : "-";
  return `${xPart} ${sign} ${Math.abs(constant)}`;
}

// 정답 비교: 입력 (p,q,r,s)가 정답 (p,q,r,s)와 같거나 두 인수를 교환해도 같은지 확인
function checkAnswer(
  ip: number, iq: number, ir: number, is: number,
  q: Question
): boolean {
  const match1 = ip === q.p && iq === q.q && ir === q.r && is === q.s;
  const match2 = ip === q.r && iq === q.s && ir === q.p && is === q.q;
  // 부호가 뒤집혀도 같은 이차식이 되는 경우 (예: (-px-q)(-rx-s) = (px+q)(rx+s))
  const match3 = ip === -q.p && iq === -q.q && ir === -q.r && is === -q.s;
  const match4 = ip === -q.r && iq === -q.s && ir === -q.p && is === -q.q;
  return match1 || match2 || match3 || match4;
}

export default function FactoringGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 첫 번째 인수 (px + q)
  const [valP, setValP] = useState("");
  const [valQ, setValQ] = useState("");
  // 두 번째 인수 (rx + s)
  const [valR, setValR] = useState("");
  const [valS, setValS] = useState("");

  useEffect(() => {
    setQuestions(shuffle(allQuestions).slice(0, 10));
  }, []);

  if (questions.length === 0) {
    return <div className="p-20 text-center text-xl">문제를 불러오는 중...</div>;
  }

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (valP === "" || valQ === "" || valR === "" || valS === "") {
      alert("네 칸을 모두 채워주세요! (0인 경우 0을 입력하세요)");
      return;
    }

    const ip = parseInt(valP);
    const iq = parseInt(valQ);
    const ir = parseInt(valR);
    const iS = parseInt(valS);

    if (isNaN(ip) || isNaN(iq) || isNaN(ir) || isNaN(iS)) {
      alert("숫자만 입력해주세요!");
      return;
    }

    const correct = checkAnswer(ip, iq, ir, iS, currentQ);
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore((prev) => prev + 10);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !showFeedback) handleSubmit();
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setShowHint(false);
    setValP(""); setValQ(""); setValR(""); setValS("");
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
    setShowHint(false);
    setValP(""); setValQ(""); setValR(""); setValS("");
  };

  // 점수에 따른 피드백 메시지
  const getScoreMessage = (score: number) => {
    if (score === 100) return { msg: "🏆 완벽해요! 인수분해 마스터!", color: "text-yellow-500" };
    if (score >= 80) return { msg: "🌟 훌륭해요! 조금만 더!", color: "text-green-500" };
    if (score >= 60) return { msg: "👍 잘했어요! 계속 연습해봐요!", color: "text-blue-500" };
    return { msg: "💪 괜찮아요! 다시 도전해봐요!", color: "text-purple-500" };
  };

  if (gameOver) {
    const { msg, color } = getScoreMessage(score);
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">🎉 게임 완료! 🎉</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 w-full max-w-md">
          <p className="text-2xl text-slate-600 mb-2">최종 점수 (100점 만점)</p>
          <p className={`text-7xl font-black mb-4 ${color}`}>{score}점</p>
          <p className={`text-xl font-bold mb-8 ${color}`}>{msg}</p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={resetGame}
              className="px-6 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg shadow-purple-200 active:scale-95"
            >
              🔄 다른 문제로 다시 하기
            </button>
            <Link
              href="/playground"
              className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all"
            >
              🏠 놀이터로 돌아가기
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
          />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">인수분해 게임</h1>
      <p className="text-slate-500 mb-8 text-base">다음 이차식을 두 일차식의 곱으로 나타내세요!</p>

      {/* 문제 카드 */}
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 text-center">

        {/* 힌트 뱃지 */}
        {currentQ.hint && !showFeedback && (
          <div className="mb-4">
            {showHint ? (
              <div className="inline-block bg-purple-50 text-purple-600 font-bold text-sm px-4 py-2 rounded-full border border-purple-200">
                💡 힌트: {currentQ.hint}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="inline-block bg-slate-50 text-slate-400 hover:text-purple-500 font-bold text-sm px-4 py-2 rounded-full border border-slate-200 hover:border-purple-200 transition-colors"
              >
                💡 힌트 보기
              </button>
            )}
          </div>
        )}

        {/* 문제 표시 */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-purple-50 rounded-2xl px-8 py-5 mb-3 w-full max-w-sm">
            <p className="text-slate-500 text-sm font-bold mb-1">인수분해 하세요</p>
            <p className="font-mono text-3xl md:text-4xl text-slate-800 font-bold tracking-tight">
              {formatQuadratic(currentQ.A, currentQ.B, currentQ.C)}
            </p>
          </div>
          <div className="text-4xl text-purple-300 font-black mb-1">↓</div>
          <div className="font-mono text-2xl text-slate-400 tracking-wide">
            (　x + 　)(　x + 　)
          </div>
        </div>

        {/* 입력 칸 */}
        {!showFeedback ? (
          <div className="flex flex-col items-center gap-6">
            {/* 두 인수 입력 */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {/* 첫 번째 인수 */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-slate-400 text-2xl font-bold">(</span>
                <input
                  type="number"
                  value={valP}
                  onChange={(e) => setValP(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-14 text-center text-xl border-3 border-purple-200 focus:border-purple-500 outline-none rounded-xl bg-purple-50 text-slate-800 transition-colors font-bold"
                  placeholder="?"
                />
                <span className="text-slate-700 text-xl font-bold">x</span>
                <span className="text-slate-400 text-xl">+</span>
                <input
                  type="number"
                  value={valQ}
                  onChange={(e) => setValQ(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-14 text-center text-xl border-3 border-purple-200 focus:border-purple-500 outline-none rounded-xl bg-purple-50 text-slate-800 transition-colors font-bold"
                  placeholder="?"
                />
                <span className="text-slate-400 text-2xl font-bold">)</span>
              </div>

              <div className="text-slate-300 text-2xl font-black text-center">×</div>

              {/* 두 번째 인수 */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-slate-400 text-2xl font-bold">(</span>
                <input
                  type="number"
                  value={valR}
                  onChange={(e) => setValR(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-14 text-center text-xl border-3 border-purple-200 focus:border-purple-500 outline-none rounded-xl bg-purple-50 text-slate-800 transition-colors font-bold"
                  placeholder="?"
                />
                <span className="text-slate-700 text-xl font-bold">x</span>
                <span className="text-slate-400 text-xl">+</span>
                <input
                  type="number"
                  value={valS}
                  onChange={(e) => setValS(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-14 text-center text-xl border-3 border-purple-200 focus:border-purple-500 outline-none rounded-xl bg-purple-50 text-slate-800 transition-colors font-bold"
                  placeholder="?"
                />
                <span className="text-slate-400 text-2xl font-bold">)</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs">음수는 -3처럼 입력, 계수가 1이면 1 입력 / Enter로 제출</p>

            <button
              onClick={handleSubmit}
              className="px-10 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xl transition-all shadow-lg shadow-purple-200 active:scale-95"
            >
              정답 확인 🚀
            </button>
          </div>
        ) : (
          <div>
            <div className={`text-3xl font-bold mb-6 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
              {isCorrect ? "🎉 정답입니다! 🎉" : "🥲 아쉽네요, 틀렸어요!"}
            </div>

            {/* 정답 해설 */}
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-center border border-slate-100">
              <p className="text-sm text-slate-500 font-bold mb-3">올바른 인수분해</p>
              <div className="font-mono text-slate-700 text-lg mb-2">
                {formatQuadratic(currentQ.A, currentQ.B, currentQ.C)}
              </div>
              <div className="text-slate-400 font-bold text-lg mb-2">=</div>
              <div className="font-mono text-2xl font-bold text-purple-600">
                ({formatFactor(currentQ.p, currentQ.q)})({formatFactor(currentQ.r, currentQ.s)})
              </div>

              {/* 검증: 전개해서 확인 */}
              <div className="mt-4 bg-white rounded-xl p-3 border border-purple-100">
                <p className="text-xs text-slate-400 font-bold mb-1">✅ 검증 (전개 확인)</p>
                <p className="text-xs text-slate-500 font-mono">
                  ({formatFactor(currentQ.p, currentQ.q)}) × ({formatFactor(currentQ.r, currentQ.s)})
                  = {formatQuadratic(currentQ.A, currentQ.B, currentQ.C)}
                </p>
              </div>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full px-8 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xl transition-all shadow-lg shadow-purple-200 active:scale-95"
            >
              다음 문제로 가기 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
