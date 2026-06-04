"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Problem = {
  a1: number; b1: number; c1: number; // a1*x + b1*y = c1
  a2: number; b2: number; c2: number; // a2*x + b2*y = c2
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
  } while (a1 * b2 - a2 * b1 === 0); // 유일해 보장

  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;

  return { a1, b1, c1, a2, b2, c2, x, y };
}

function fmtCoeff(c: number, varName: string, isFirst: boolean): string {
  if (c === 0) return "";
  const abs = Math.abs(c);
  const sign = c > 0 ? (isFirst ? "" : " + ") : (isFirst ? "−" : " − ");
  const num = abs === 1 ? "" : `${abs}`;
  return `${sign}${num}${varName}`;
}

function fmtEq(a: number, b: number, c: number): string {
  let left = "";
  const xPart = fmtCoeff(a, "x", true);
  const yPart = fmtCoeff(b, "y", xPart === "");
  left = xPart + yPart;
  if (left === "") left = "0";
  return `${left} = ${c}`;
}

export default function SimulEqGame() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [vX, setVX] = useState("");
  const [vY, setVY] = useState("");
  const [phase, setPhase] = useState<"solving" | "feedback" | "done">("solving");
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const maxRounds = 10;

  const init = useCallback(() => {
    const ps: Problem[] = [];
    for (let i = 0; i < maxRounds; i++) ps.push(generateProblem());
    setProblems(ps);
    setIdx(0);
    setScore(0);
    setVX("");
    setVY("");
    setPhase("solving");
    setCorrect(false);
    setShowHint(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  if (!problems.length) return <div className="p-20 text-center text-lg">불러오는 중...</div>;

  const p = problems[idx];

  const submit = () => {
    const ux = parseInt(vX);
    const uy = parseInt(vY);
    if (isNaN(ux) || isNaN(uy)) { alert("x와 y 값을 숫자로 입력해주세요!"); return; }
    const ok = ux === p.x && uy === p.y;
    setCorrect(ok);
    setPhase("feedback");
    if (ok) setScore(s => s + 10);
  };

  const next = () => {
    setVX(""); setVY(""); setShowHint(false);
    if (idx + 1 < maxRounds) { setIdx(i => i + 1); setPhase("solving"); setCorrect(false); }
    else setPhase("done");
  };

  // 가감법 풀이 과정 생성
  const buildSolution = () => {
    const { a1, b1, c1, a2, b2, c2, x, y } = p;
    // y 소거: a2 * eq1 - a1 * eq2
    const m1 = Math.abs(a2);
    const m2 = Math.abs(a1);
    const newB1 = a2 * b1;
    const newC1 = a2 * c1;
    const newB2 = a1 * b2;
    const newC2 = a1 * c2;
    const diffB = newB1 - newB2;
    const diffC = newC1 - newC2;

    return (
      <div className="text-left space-y-2 text-sm text-slate-600">
        <p className="font-bold text-amber-700">📝 가감법 풀이:</p>
        <p>① {fmtEq(a1, b1, c1)} ... ×{m1}</p>
        <p>② {fmtEq(a2, b2, c2)} ... ×{m2}</p>
        <p className="border-t border-slate-200 pt-2">
          ①×{m1} − ②×{m2} 하면:
        </p>
        <p>{diffB === 0 ? "0" : `${diffB}y`} = {diffC}</p>
        {diffB !== 0 && <p>∴ y = {y}</p>}
        <p>y = {y}를 ①에 대입하면 x = {x}</p>
        <p className="font-bold text-amber-800 pt-1">∴ x = {x}, y = {y}</p>
      </div>
    );
  };

  if (phase === "done") {
    const lv = [
      { min: 100, msg: "🏆 완벽! 연립방정식 마스터!", c: "text-yellow-500" },
      { min: 80, msg: "🌟 훌륭해요!", c: "text-green-500" },
      { min: 60, msg: "👍 잘했어요!", c: "text-blue-500" },
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
    <div className="max-w-xl mx-auto px-4 py-10 flex flex-col items-center">
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
        <h2 className="text-center text-sm font-bold text-slate-400 mb-2">가감법으로 연립방정식을 풀어보세요</h2>

        {/* 연립방정식 표시 */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-slate-300 font-light select-none">{"{"}</div>
          <div className="ml-8 space-y-3 font-mono text-xl md:text-2xl font-extrabold text-slate-800 text-center">
            <p>① {fmtEq(p.a1, p.b1, p.c1)}</p>
            <p>② {fmtEq(p.a2, p.b2, p.c2)}</p>
          </div>
        </div>

        {/* 힌트 */}
        {phase === "solving" && (
          <div className="text-center mb-4">
            {showHint ? (
              <div className="inline-block bg-amber-50 text-amber-700 text-sm font-bold px-5 py-2 rounded-full border border-amber-200">
                💡 x 또는 y의 계수를 같게 만들어서 빼거나 더해보세요!
              </div>
            ) : (
              <button onClick={() => setShowHint(true)} className="text-slate-400 hover:text-amber-500 text-sm font-semibold px-5 py-2 rounded-full border border-slate-200 hover:border-amber-300 transition-all">
                💡 힌트 보기
              </button>
            )}
          </div>
        )}

        {/* 입력 영역 */}
        {phase === "solving" && (
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-700">x =</span>
                <input
                  type="number"
                  value={vX}
                  onChange={e => setVX(e.target.value)}
                  className="w-20 h-14 text-center text-lg font-bold rounded-xl border-2 border-amber-300 focus:border-amber-500 outline-none bg-amber-50"
                  placeholder="?"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-700">y =</span>
                <input
                  type="number"
                  value={vY}
                  onChange={e => setVY(e.target.value)}
                  className="w-20 h-14 text-center text-lg font-bold rounded-xl border-2 border-amber-300 focus:border-amber-500 outline-none bg-amber-50"
                  placeholder="?"
                />
              </div>
            </div>
            <button onClick={submit} className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all shadow-lg shadow-amber-200 active:scale-95">
              정답 확인 🚀
            </button>
          </div>
        )}

        {/* 피드백 */}
        {phase === "feedback" && (
          <div className="max-w-sm mx-auto">
            <div className={`text-2xl font-bold text-center mb-4 ${correct ? "text-green-500" : "text-red-500"}`}>
              {correct ? "🎉 정답입니다!" : "🥲 틀렸어요!"}
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100">
              <p className="text-center font-mono text-lg font-extrabold text-amber-600 mb-3">
                x = {p.x}, y = {p.y}
              </p>
              {buildSolution()}
            </div>
            <button onClick={next} className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all shadow-lg shadow-amber-200 active:scale-95">
              다음 문제 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
