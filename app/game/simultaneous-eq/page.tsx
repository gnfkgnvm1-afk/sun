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

/* ── 포맷 헬퍼 ─────────────────────── */
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
  return `${xp || ""}${yp || ""} = ${c}`;
}

/* ── 메인 컴포넌트 ─────────────────── */
type Phase = "multiply" | "solve1" | "solve2" | "feedback" | "done";

export default function SimulEqGame() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("multiply");
  const maxRounds = 5;

  // Step 1: 배수 입력
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [mulError, setMulError] = useState("");

  // 소거 결과
  const [eliminated, setEliminated] = useState<"x" | "y">("x");
  const [mulA1, setMulA1] = useState(0); const [mulB1, setMulB1] = useState(0); const [mulC1, setMulC1] = useState(0);
  const [mulA2, setMulA2] = useState(0); const [mulB2, setMulB2] = useState(0); const [mulC2, setMulC2] = useState(0);
  const [sumCoeff, setSumCoeff] = useState(0); const [sumConst, setSumConst] = useState(0);

  // Step 2, 3: 미지수 입력
  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");
  const [step1Ok, setStep1Ok] = useState<boolean | null>(null);
  const [step2Ok, setStep2Ok] = useState<boolean | null>(null);

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
    setPhase("multiply");
    setM1(""); setM2(""); setMulError("");
    setAns1(""); setAns2("");
    setStep1Ok(null); setStep2Ok(null);
  }

  if (!problems.length) return <div className="p-20 text-center text-lg">불러오는 중...</div>;
  const p = problems[idx];

  /* ── Step 1: 배수 확인 ───── */
  const submitMultipliers = () => {
    const n1 = parseInt(m1); const n2 = parseInt(m2);
    if (isNaN(n1) || isNaN(n2) || n1 === 0 || n2 === 0) {
      setMulError("0이 아닌 정수를 입력해주세요!"); return;
    }
    const elimX = n1 * p.a1 + n2 * p.a2 === 0;
    const elimY = n1 * p.b1 + n2 * p.b2 === 0;
    if (!elimX && !elimY) {
      setMulError("이 배수로는 변수가 소거되지 않아요! 다시 생각해보세요."); return;
    }
    setMulError("");
    setEliminated(elimX ? "x" : "y");

    // 곱한 결과 저장
    setMulA1(n1 * p.a1); setMulB1(n1 * p.b1); setMulC1(n1 * p.c1);
    setMulA2(n2 * p.a2); setMulB2(n2 * p.b2); setMulC2(n2 * p.c2);

    const sc = elimX ? (n1 * p.b1 + n2 * p.b2) : (n1 * p.a1 + n2 * p.a2);
    const sv = n1 * p.c1 + n2 * p.c2;
    setSumCoeff(sc); setSumConst(sv);

    setScore(s => s + 10); // 배수 맞추기 10점
    setPhase("solve1");
  };

  /* ── Step 2: 소거된 변수 제외한 값 ───── */
  const submitSolve1 = () => {
    const v = parseInt(ans1);
    if (isNaN(v)) { return; }
    const correctVal = eliminated === "x" ? p.y : p.x;
    const ok = v === correctVal;
    setStep1Ok(ok);
    if (ok) setScore(s => s + 5);
    setPhase("solve2");
  };

  /* ── Step 3: 나머지 변수 ───── */
  const submitSolve2 = () => {
    const v = parseInt(ans2);
    if (isNaN(v)) { return; }
    const correctVal = eliminated === "x" ? p.x : p.y;
    const ok = v === correctVal;
    setStep2Ok(ok);
    if (ok) setScore(s => s + 5);
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

  /* ── 게임 종료 ───── */
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

  /* ── 소거 결과 변수 이름 ───── */
  const remVar = eliminated === "x" ? "y" : "x";
  const elmVar = eliminated === "x" ? "x" : "y";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center">
      {/* 진행 바 */}
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
        <h2 className="text-center text-sm font-bold text-slate-400 mb-5">가감법으로 연립방정식을 풀어보세요</h2>

        {/* ─── 원래 연립방정식 ─── */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-5xl text-slate-300 font-light select-none leading-none">{"{"}</div>
          <div className="ml-10 space-y-2 font-mono text-xl md:text-2xl font-extrabold text-slate-800">
            <p>① {fmtEq(p.a1, p.b1, p.c1)}</p>
            <p>② {fmtEq(p.a2, p.b2, p.c2)}</p>
          </div>
        </div>

        {/* ─── STEP 1: 배수 입력 ─── */}
        {phase === "multiply" && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="font-bold text-amber-700 mb-4 text-center">
              📌 Step 1: 변수를 소거하기 위해 각 식에 곱할 수를 입력하세요
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-600">①</span>
                <span className="text-slate-500">×</span>
                <input type="number" value={m1} onChange={e => { setM1(e.target.value); setMulError(""); }}
                  className="w-20 h-12 text-center text-lg font-bold rounded-xl border-2 border-amber-300 focus:border-amber-500 outline-none bg-white" placeholder="?" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-600">②</span>
                <span className="text-slate-500">×</span>
                <input type="number" value={m2} onChange={e => { setM2(e.target.value); setMulError(""); }}
                  className="w-20 h-12 text-center text-lg font-bold rounded-xl border-2 border-amber-300 focus:border-amber-500 outline-none bg-white" placeholder="?" />
              </div>
            </div>
            {mulError && <p className="text-red-500 text-sm font-bold text-center mb-3 animate-pulse">{mulError}</p>}
            <p className="text-xs text-slate-400 text-center mb-4">
              💡 두 식을 더했을 때 x 또는 y가 사라지도록 곱할 수를 정하세요!
            </p>
            <button onClick={submitMultipliers} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-amber-200">
              확인 ✓
            </button>
          </div>
        )}

        {/* ─── 곱한 결과 + 소거 과정 (Step 2 이후 표시) ─── */}
        {phase !== "multiply" && (
          <div className="mb-6">
            {/* 화살표 + 곱한 결과 */}
            <div className="flex items-start gap-2 mb-1">
              <span className="text-amber-500 font-bold text-lg mt-1 select-none">→</span>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex-1 relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-3xl text-amber-300 font-light select-none leading-none">{"{"}</div>
                <div className="ml-7 space-y-1 font-mono text-base md:text-lg font-bold text-slate-700">
                  <p>{fmtEq(mulA1, mulB1, mulC1)} <span className="text-amber-400 text-sm">← ①×{m1}</span></p>
                  <p className="relative">
                    <span className="absolute -left-7 text-amber-600 font-extrabold text-sm">+)</span>
                    {fmtEq(mulA2, mulB2, mulC2)} <span className="text-amber-400 text-sm">← ②×{m2}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 가로선 + 결과 */}
            <div className="ml-7 border-t-2 border-slate-400 my-2" />
            <div className="ml-7 font-mono text-lg md:text-xl font-extrabold text-blue-700 text-center py-1">
              {sumCoeff === 1 ? "" : sumCoeff === -1 ? "−" : sumCoeff}{remVar} = {sumConst}
            </div>
          </div>
        )}

        {/* ─── STEP 2: 남은 변수 풀기 ─── */}
        {phase === "solve1" && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-4 text-center">
              📌 Step 2: {remVar}의 값을 구하세요
            </h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-xl font-bold text-slate-700 font-mono">{remVar} =</span>
              <input type="number" value={ans1} onChange={e => setAns1(e.target.value)}
                className="w-24 h-14 text-center text-xl font-bold rounded-xl border-2 border-blue-300 focus:border-blue-500 outline-none bg-white" placeholder="?" />
            </div>
            <button onClick={submitSolve1} className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-blue-200">
              확인 ✓
            </button>
          </div>
        )}

        {/* ─── Step 2 결과 표시 ─── */}
        {phase !== "multiply" && phase !== "solve1" && (
          <div className="ml-7 font-mono text-lg font-extrabold text-center py-1 mb-2">
            <span className={step1Ok ? "text-green-600" : "text-red-500"}>
              {step1Ok ? "✅" : "❌"} {remVar} = {eliminated === "x" ? p.y : p.x}
            </span>
          </div>
        )}

        {/* ─── STEP 3: 대입하여 나머지 변수 풀기 ─── */}
        {phase === "solve2" && (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mt-4">
            <h3 className="font-bold text-green-700 mb-2 text-center">
              📌 Step 3: {remVar} = {eliminated === "x" ? p.y : p.x} 를 ①에 대입하여 {elmVar}의 값을 구하세요
            </h3>
            <p className="text-sm text-slate-500 text-center mb-4 font-mono">
              ① {fmtEq(p.a1, p.b1, p.c1)}
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-xl font-bold text-slate-700 font-mono">{elmVar} =</span>
              <input type="number" value={ans2} onChange={e => setAns2(e.target.value)}
                className="w-24 h-14 text-center text-xl font-bold rounded-xl border-2 border-green-300 focus:border-green-500 outline-none bg-white" placeholder="?" />
            </div>
            <button onClick={submitSolve2} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-green-200">
              확인 ✓
            </button>
          </div>
        )}

        {/* ─── FEEDBACK ─── */}
        {phase === "feedback" && (
          <div className="mt-4">
            <div className="ml-7 font-mono text-lg font-extrabold text-center py-1 mb-4">
              <span className={step2Ok ? "text-green-600" : "text-red-500"}>
                {step2Ok ? "✅" : "❌"} {elmVar} = {eliminated === "x" ? p.x : p.y}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4 text-center">
              <p className="font-mono text-2xl font-black text-amber-600">
                ∴ x = {p.x}, y = {p.y}
              </p>
            </div>

            <div className={`text-2xl font-bold text-center mb-4 ${step1Ok && step2Ok ? "text-green-500" : "text-amber-500"}`}>
              {step1Ok && step2Ok ? "🎉 완벽해요!" : "💪 풀이 과정을 다시 확인해보세요!"}
            </div>

            <button onClick={nextRound} className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all shadow-lg shadow-amber-200 active:scale-95">
              {idx + 1 < maxRounds ? "다음 문제 ➔" : "결과 보기 🏆"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
