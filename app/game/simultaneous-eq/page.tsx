"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Problem = {
  a1: number; b1: number; c1: number;
  a2: number; b2: number; c2: number;
  x: number; y: number;
};

function randNZ(min: number, max: number) {
  let v = 0;
  while (v === 0) v = Math.floor(Math.random() * (max - min + 1)) + min;
  return v;
}

function generateProblem(): Problem {
  const x = randNZ(-5, 5);
  const y = randNZ(-5, 5);
  let a1: number, b1: number, a2: number, b2: number;
  do {
    a1 = randNZ(-4, 4);
    b1 = randNZ(-4, 4);
    a2 = randNZ(-4, 4);
    b2 = randNZ(-4, 4);
  } while (a1 * b2 - a2 * b1 === 0);
  return { a1, b1, c1: a1 * x + b1 * y, a2, b2, c2: a2 * x + b2 * y, x, y };
}

function fmtTerm(c: number, v: string, isFirst: boolean): string {
  if (c === 0) return "";
  const abs = Math.abs(c);
  const sign = c > 0 ? (isFirst ? "" : " + ") : (isFirst ? "−" : " − ");
  const num = abs === 1 ? "" : `${abs}`;
  return `${sign}${num}${v}`;
}

function fmtEq(a: number, b: number, c: number): string {
  const xp = fmtTerm(a, "x", true);
  const yp = fmtTerm(b, "y", xp === "");
  const left = `${xp || ""}${yp || ""}`;
  return `${left === "" ? "0" : left} = ${c}`;
}

type Phase = "solving" | "feedback" | "done";

export default function SimulEqGame() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("solving");
  const maxRounds = 5;

  // 모든 입력 상태
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [ansX, setAnsX] = useState("");
  const [ansY, setAnsY] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const init = useCallback(() => {
    const ps: Problem[] = [];
    for (let i = 0; i < maxRounds; i++) ps.push(generateProblem());
    setProblems(ps);
    resetRound();
    setIdx(0);
    setScore(0);
  }, []);

  useEffect(() => { init(); }, [init]);

  function resetRound() {
    setPhase("solving");
    setM1(""); setM2("");
    setAnsX(""); setAnsY("");
    setErrorMsg("");
    setIsCorrect(false);
  }

  if (!problems.length) return <div className="p-20 text-center text-lg">불러오는 중...</div>;
  const p = problems[idx];

  // 실시간 계산
  const numM1 = parseInt(m1) || 0;
  const numM2 = parseInt(m2) || 0;
  
  const mulA1 = numM1 * p.a1; const mulB1 = numM1 * p.b1; const mulC1 = numM1 * p.c1;
  const mulA2 = numM2 * p.a2; const mulB2 = numM2 * p.b2; const mulC2 = numM2 * p.c2;
  
  const sumA = mulA1 + mulA2;
  const sumB = mulB1 + mulB2;
  const sumC = mulC1 + mulC2;

  const submitAnswer = () => {
    setErrorMsg("");
    if (numM1 === 0 || numM2 === 0) {
      setErrorMsg("각 식에 곱할 0이 아닌 정수를 입력해주세요!");
      return;
    }
    
    // 배수로 x나 y가 소거되는지 확인
    const elimX = sumA === 0;
    const elimY = sumB === 0;
    if (!elimX && !elimY) {
      setErrorMsg("입력하신 배수로는 x나 y가 소거되지 않습니다. 다시 확인해주세요!");
      return;
    }

    const uX = parseInt(ansX);
    const uY = parseInt(ansY);

    if (isNaN(uX) || isNaN(uY)) {
      setErrorMsg("x와 y의 값을 모두 숫자로 입력해주세요!");
      return;
    }

    if (uX !== p.x || uY !== p.y) {
      setErrorMsg("x 또는 y의 값이 틀렸습니다. 다시 계산해보세요!");
      return;
    }

    // 정답
    setIsCorrect(true);
    setScore(s => s + 20);
    setPhase("feedback");
  };

  const nextRound = () => {
    if (idx + 1 < maxRounds) {
      setIdx(i => i + 1);
      resetRound();
    } else {
      setPhase("done");
    }
  };

  if (phase === "done") {
    const lv = [
      { min: 90, msg: "🏆 완벽! 연립방정식 마스터!", c: "text-yellow-500" },
      { min: 70, msg: "🌟 훌륭해요!", c: "text-green-500" },
      { min: 50, msg: "👍 잘했어요!", c: "text-blue-500" },
      { min: 0, msg: "💪 다시 도전해봐요!", c: "text-purple-500" },
    ].find(l => score >= l.min)!;
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold mb-6">🎉 게임 완료!</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-amber-100 border border-amber-50 w-full">
          <p className="text-xl text-slate-500 mb-2">최종 점수 (100점 만점)</p>
          <p className={`text-7xl font-black mb-3 ${lv.c}`}>{score}점</p>
          <p className={`text-lg font-bold mb-8 ${lv.c}`}>{lv.msg}</p>
          <div className="flex flex-col gap-3">
            <button onClick={init} className="py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all active:scale-95">🔄 다시 하기</button>
            <Link href="/playground" className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all text-center">🏠 놀이터로</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center">
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
          <span>문제 {idx + 1} / {maxRounds}</span>
          <span className="text-amber-600">점수: {score}점</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${((idx + 1) / maxRounds) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-2xl shadow-amber-100 border border-amber-50">
        <h2 className="text-center text-sm font-bold text-slate-400 mb-5">한 화면에서 가감법으로 식을 풀고 답을 입력하세요</h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          
          {/* 왼쪽: 연립방정식과 배수 입력 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 w-full lg:w-1/2 flex flex-col gap-4">
            <h3 className="font-bold text-slate-700 text-center mb-2">1. 배수 설정</h3>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-slate-600 w-6">①</span>
              <span className="font-mono text-xl font-extrabold flex-1 text-right">{fmtEq(p.a1, p.b1, p.c1)}</span>
              <span className="text-slate-400">×</span>
              <input type="number" value={m1} onChange={e => setM1(e.target.value)} disabled={phase !== "solving"}
                className="w-16 h-10 text-center text-lg font-bold rounded-lg border-2 border-amber-300 focus:border-amber-500 outline-none bg-white" placeholder="?" />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-slate-600 w-6">②</span>
              <span className="font-mono text-xl font-extrabold flex-1 text-right">{fmtEq(p.a2, p.b2, p.c2)}</span>
              <span className="text-slate-400">×</span>
              <input type="number" value={m2} onChange={e => setM2(e.target.value)} disabled={phase !== "solving"}
                className="w-16 h-10 text-center text-lg font-bold rounded-lg border-2 border-amber-300 focus:border-amber-500 outline-none bg-white" placeholder="?" />
            </div>
          </div>

          {/* 오른쪽: 결과 프리뷰 및 정답 입력 */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 w-full lg:w-1/2">
            <h3 className="font-bold text-amber-700 text-center mb-4">2. 소거 결과 및 정답</h3>
            
            {/* 실시간 연산 결과 프리뷰 */}
            <div className="font-mono text-lg md:text-xl font-bold text-slate-700 mb-6 relative pl-6">
              <div className="absolute left-0 top-0 bottom-6 w-3 border-l-2 border-t-2 border-b-2 border-slate-300 rounded-l-lg"></div>
              <p className="pl-2">{numM1 ? fmtEq(mulA1, mulB1, mulC1) : "..."}</p>
              <p className="pl-2 relative">
                <span className="absolute -left-6 text-amber-600 font-extrabold">+)</span>
                {numM2 ? fmtEq(mulA2, mulB2, mulC2) : "..."}
              </p>
              <div className="border-t-2 border-slate-400 mt-2 pt-2 text-center text-blue-700">
                {(numM1 !== 0 && numM2 !== 0) ? fmtEq(sumA, sumB, sumC) : "..."}
              </div>
            </div>

            {/* 최종 정답 입력 */}
            <div className="flex justify-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-700 font-mono">x =</span>
                <input type="number" value={ansX} onChange={e => setAnsX(e.target.value)} disabled={phase !== "solving"}
                  className="w-16 h-12 text-center text-lg font-bold rounded-xl border-2 border-blue-300 focus:border-blue-500 outline-none bg-white" placeholder="?" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-700 font-mono">y =</span>
                <input type="number" value={ansY} onChange={e => setAnsY(e.target.value)} disabled={phase !== "solving"}
                  className="w-16 h-12 text-center text-lg font-bold rounded-xl border-2 border-blue-300 focus:border-blue-500 outline-none bg-white" placeholder="?" />
              </div>
            </div>
          </div>
        </div>

        {errorMsg && phase === "solving" && (
          <p className="text-red-500 text-center font-bold mt-6 animate-pulse bg-red-50 py-2 rounded-lg">{errorMsg}</p>
        )}

        <div className="mt-8 flex justify-center">
          {phase === "solving" ? (
            <button onClick={submitAnswer} className="w-full max-w-sm py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition-all shadow-lg shadow-amber-200 active:scale-95">
              정답 확인 🚀
            </button>
          ) : (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="text-2xl font-bold text-green-500 mb-4 bg-green-50 w-full py-3 rounded-xl text-center border border-green-100">
                🎉 정답입니다!
              </div>
              <button onClick={nextRound} className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition-all shadow-lg shadow-amber-200 active:scale-95">
                {idx + 1 < maxRounds ? "다음 문제 ➔" : "결과 보기 🏆"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
