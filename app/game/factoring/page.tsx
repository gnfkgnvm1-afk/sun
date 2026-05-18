"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// (px+q)(rx+s) = pr·x² + (ps+qr)·x + qs
type Question = {
  A: number; B: number; C: number;
  p: number; q: number; r: number; s: number;
  hint?: string;
};

const allQuestions: Question[] = [
  { A: 8,  B: 2,   C: -3,  p: 4,  q: 3,  r: 2,  s: -1, hint: "합이 2, 곱이 -24인 두 수를 찾아요" },
  { A: 1,  B: -4,  C: 4,   p: 1,  q: -2, r: 1,  s: -2, hint: "완전제곱식 (a-b)²" },
  { A: 1,  B: 0,   C: -25, p: 1,  q: 5,  r: 1,  s: -5, hint: "합차공식 a²-b² = (a+b)(a-b)" },
  { A: 4,  B: -3,  C: -1,  p: 4,  q: 1,  r: 1,  s: -1 },
  { A: 1,  B: -4,  C: 0,   p: 1,  q: 0,  r: 1,  s: -4, hint: "공통인수 x로 묶기" },
  { A: 4,  B: 0,   C: -9,  p: 2,  q: 3,  r: 2,  s: -3, hint: "합차공식 (2x)²-3²" },
  { A: 1,  B: 1,   C: -6,  p: 1,  q: 3,  r: 1,  s: -2, hint: "합이 1, 곱이 -6인 두 수" },
  { A: 1,  B: 6,   C: 8,   p: 1,  q: 2,  r: 1,  s: 4,  hint: "합이 6, 곱이 8인 두 수" },
  { A: 2,  B: 5,   C: 3,   p: 2,  q: 3,  r: 1,  s: 1 },
  { A: 1,  B: -1,  C: -12, p: 1,  q: -4, r: 1,  s: 3 },
  { A: 1,  B: 0,   C: -9,  p: 1,  q: 3,  r: 1,  s: -3, hint: "합차공식 a²-b²" },
  { A: 1,  B: 5,   C: 6,   p: 1,  q: 2,  r: 1,  s: 3 },
  { A: 3,  B: -5,  C: -2,  p: 3,  q: 1,  r: 1,  s: -2 },
  { A: 1,  B: -7,  C: 12,  p: 1,  q: -3, r: 1,  s: -4 },
  { A: 1,  B: 3,   C: -4,  p: 1,  q: 4,  r: 1,  s: -1 },
  { A: 9,  B: 0,   C: -4,  p: 3,  q: 2,  r: 3,  s: -2, hint: "합차공식 (3x)²-2²" },
  { A: 1,  B: -2,  C: -8,  p: 1,  q: -4, r: 1,  s: 2 },
  { A: 2,  B: -7,  C: 3,   p: 2,  q: -1, r: 1,  s: -3 },
  { A: 1,  B: 8,   C: 16,  p: 1,  q: 4,  r: 1,  s: 4,  hint: "완전제곱식 (a+b)²" },
  { A: 1,  B: 0,   C: -36, p: 1,  q: 6,  r: 1,  s: -6, hint: "합차공식 a²-b²" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtQuad(A: number, B: number, C: number) {
  let s = A === 1 ? "x²" : A === -1 ? "-x²" : `${A}x²`;
  if (B > 0) s += ` + ${B}x`;
  else if (B < 0) s += ` − ${Math.abs(B)}x`;
  if (C > 0) s += ` + ${C}`;
  else if (C < 0) s += ` − ${Math.abs(C)}`;
  return s;
}

function fmtTerm(val: number, kind: "x2" | "x" | "c") {
  if (kind === "x2") {
    if (val === 0) return "0";
    if (val === 1) return "x²"; if (val === -1) return "−x²";
    return `${val}x²`;
  }
  if (kind === "x") {
    if (val === 0) return "0";
    if (val === 1) return "x"; if (val === -1) return "−x";
    return val > 0 ? `${val}x` : `−${Math.abs(val)}x`;
  }
  return val >= 0 ? `${val}` : `−${Math.abs(val)}`;
}

function fmtFactor(coef: number, con: number) {
  const x = coef === 1 ? "x" : coef === -1 ? "−x" : `${coef}x`;
  if (con === 0) return x;
  return con > 0 ? `${x} + ${con}` : `${x} − ${Math.abs(con)}`;
}

function checkAnswer(ip: number, iq: number, ir: number, is_: number, q: Question) {
  const ok = (a: number, b: number, c: number, d: number) =>
    a === q.p && b === q.q && c === q.r && d === q.s;
  return ok(ip,iq,ir,is_)||ok(ir,is_,ip,iq)||ok(-ip,-iq,-ir,-is_)||ok(-ir,-is_,-ip,-iq);
}

export default function FactoringGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [vP, setVP] = useState(""); // 위쪽 왼 (x계수1)
  const [vQ, setVQ] = useState(""); // 위쪽 우 (상수1)
  const [vR, setVR] = useState(""); // 왼쪽 위 (x계수2)
  const [vS, setVS] = useState(""); // 왼쪽 아래 (상수2)

  useEffect(() => { setQuestions(shuffle(allQuestions).slice(0, 10)); }, []);
  if (!questions.length) return <div className="p-20 text-center">불러오는 중...</div>;

  const q = questions[idx];
  const p = parseInt(vP), qn = parseInt(vQ), r = parseInt(vR), s = parseInt(vS);
  const hp = vP !== "" && !isNaN(p), hq = vQ !== "" && !isNaN(qn);
  const hr = vR !== "" && !isNaN(r), hs = vS !== "" && !isNaN(s);

  // 내부 4셀
  const c11 = hp && hr ? p * r : null;   // x² 셀
  const c12 = hq && hr ? qn * r : null;  // 교차1
  const c21 = hp && hs ? p * s : null;   // 교차2
  const c22 = hq && hs ? qn * s : null;  // 상수 셀

  // 교차항 합
  const crossSum = (c12 !== null && c21 !== null) ? c12 + c21 : null;

  const handleSubmit = () => {
    if (!hp || !hq || !hr || !hs) { alert("4칸을 모두 채워주세요!"); return; }
    const ok = checkAnswer(p, qn, r, s, q);
    setCorrect(ok); setFeedback(true);
    if (ok) setScore(prev => prev + 10);
  };

  const next = () => {
    setFeedback(false); setShowHint(false);
    setVP(""); setVQ(""); setVR(""); setVS("");
    if (idx + 1 < questions.length) setIdx(i => i + 1); else setGameOver(true);
  };

  const reset = () => {
    setQuestions(shuffle(allQuestions).slice(0, 10));
    setIdx(0); setScore(0); setFeedback(false); setCorrect(false);
    setGameOver(false); setShowHint(false);
    setVP(""); setVQ(""); setVR(""); setVS("");
  };

  if (gameOver) {
    const levels = [
      { min: 100, msg: "🏆 완벽! 인수분해 마스터!", color: "text-yellow-500" },
      { min: 80,  msg: "🌟 훌륭해요!", color: "text-green-500" },
      { min: 60,  msg: "👍 잘했어요!", color: "text-blue-500" },
      { min: 0,   msg: "💪 다시 도전해봐요!", color: "text-purple-500" },
    ];
    const { msg, color } = levels.find(l => score >= l.min)!;
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold mb-6">🎉 게임 완료!</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 w-full">
          <p className="text-xl text-slate-500 mb-2">최종 점수 (100점 만점)</p>
          <p className={`text-7xl font-black mb-3 ${color}`}>{score}점</p>
          <p className={`text-lg font-bold mb-8 ${color}`}>{msg}</p>
          <div className="flex flex-col gap-3">
            <button onClick={reset} className="py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all active:scale-95">🔄 다시 하기</button>
            <Link href="/playground" className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all text-center">🏠 놀이터로</Link>
          </div>
        </div>
      </div>
    );
  }

  // 공통 스타일
  const inputCls = `w-full h-14 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
    ${feedback ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "border-purple-300 focus:border-purple-500 bg-white text-slate-800"}`;

  // 내부 셀 스타일 (피드백 시 채점)
  const innerCls = (val: number | null, isCorner: boolean, target?: number) => {
    const base = "h-14 flex items-center justify-center font-mono font-bold text-sm md:text-base border-2 border-dashed rounded-xl transition-all";
    if (val === null) return `${base} border-slate-200 bg-slate-50 text-slate-300`;
    if (feedback && isCorner && target !== undefined) {
      return val === target
        ? `${base} border-green-300 bg-green-50 text-green-700`
        : `${base} border-red-300 bg-red-50 text-red-500`;
    }
    return `${base} border-purple-200 bg-purple-50 text-purple-700`;
  };

  // 정답 격자 (피드백용)
  const AnsGrid = () => (
    <div className="grid gap-1 max-w-xs mx-auto mt-4" style={{ gridTemplateColumns: "auto 1fr 1fr" }}>
      <div className="h-10 flex items-center justify-center text-slate-400 font-bold px-2">×</div>
      <div className="h-10 flex items-center justify-center bg-purple-100 text-purple-700 font-bold font-mono text-sm rounded-lg">{fmtFactor(q.p, 0)}</div>
      <div className="h-10 flex items-center justify-center bg-purple-100 text-purple-700 font-bold font-mono text-sm rounded-lg">{q.q >= 0 ? `+${q.q}` : `${q.q}`}</div>
      <div className="h-10 flex items-center justify-center bg-purple-100 text-purple-700 font-bold font-mono text-sm rounded-lg px-2">{fmtFactor(q.r, 0)}</div>
      <div className="h-10 flex items-center justify-center bg-green-50 text-green-700 font-mono text-sm rounded-lg border border-green-200">{fmtTerm(q.p * q.r, "x2")}</div>
      <div className="h-10 flex items-center justify-center bg-blue-50 text-blue-700 font-mono text-sm rounded-lg border border-blue-200">{fmtTerm(q.q * q.r, "x")}</div>
      <div className="h-10 flex items-center justify-center bg-purple-100 text-purple-700 font-bold font-mono text-sm rounded-lg px-2">{q.s >= 0 ? `+${q.s}` : `${q.s}`}</div>
      <div className="h-10 flex items-center justify-center bg-blue-50 text-blue-700 font-mono text-sm rounded-lg border border-blue-200">{fmtTerm(q.p * q.s, "x")}</div>
      <div className="h-10 flex items-center justify-center bg-green-50 text-green-700 font-mono text-sm rounded-lg border border-green-200">{fmtTerm(q.q * q.s, "c")}</div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-10 flex flex-col items-center">

      {/* 진행 바 */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
          <span>문제 {idx + 1} / {questions.length}</span>
          <span className="text-purple-600">점수: {score}점</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div className="bg-purple-400 h-full transition-all duration-500" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">인수분해 게임 🔍</h1>
      <p className="text-slate-400 text-sm mb-6 text-center">십자가 분해법으로 <strong className="text-purple-500">위쪽 2칸</strong>과 <strong className="text-purple-500">왼쪽 2칸</strong>에 인수를 입력하세요</p>

      <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50">

        {/* 힌트 */}
        {q.hint && !feedback && (
          <div className="text-center mb-5">
            {showHint
              ? <span className="inline-block bg-purple-50 text-purple-600 text-sm font-bold px-5 py-2 rounded-full border border-purple-200">💡 {q.hint}</span>
              : <button onClick={() => setShowHint(true)} className="text-slate-400 hover:text-purple-500 text-sm font-semibold px-5 py-2 rounded-full border border-slate-200 hover:border-purple-200 transition-all">💡 힌트 보기</button>
            }
          </div>
        )}

        {/* 이차식 표시 */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl px-8 py-4 border border-purple-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1 font-semibold">인수분해 하세요</p>
            <p className="font-mono text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{fmtQuad(q.A, q.B, q.C)}</p>
          </div>
        </div>

        {/* 십자가 격자 */}
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "56px 1fr 1fr" }}>

          {/* 행 1: × | 입력(p·x) | 입력(+q) */}
          <div className="h-14 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-300">×</span>
          </div>
          <div className="relative">
            <input type="number" value={vP} onChange={e => setVP(e.target.value)} disabled={feedback} className={inputCls} placeholder="?" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-bold pointer-events-none">x</span>
          </div>
          <div>
            <input type="number" value={vQ} onChange={e => setVQ(e.target.value)} disabled={feedback} className={inputCls} placeholder="?" />
          </div>

          {/* 행 2: 입력(r·x) | x²셀 | 교차1셀 */}
          <div className="relative">
            <input type="number" value={vR} onChange={e => setVR(e.target.value)} disabled={feedback} className={inputCls} placeholder="?" />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-bold pointer-events-none">x</span>
          </div>
          <div className={innerCls(c11, true, q.A)}>
            {c11 !== null ? fmtTerm(c11, "x2") : <span className="text-slate-200 text-2xl">?</span>}
          </div>
          <div className={innerCls(c12, false)}>
            {c12 !== null ? fmtTerm(c12, "x") : <span className="text-slate-200 text-2xl">?</span>}
          </div>

          {/* 행 3: 입력(+s) | 교차2셀 | 상수셀 */}
          <div>
            <input type="number" value={vS} onChange={e => setVS(e.target.value)} disabled={feedback} className={inputCls} placeholder="?" />
          </div>
          <div className={innerCls(c21, false)}>
            {c21 !== null ? fmtTerm(c21, "x") : <span className="text-slate-200 text-2xl">?</span>}
          </div>
          <div className={innerCls(c22, true, q.C)}>
            {c22 !== null ? fmtTerm(c22, "c") : <span className="text-slate-200 text-2xl">?</span>}
          </div>

          {/* 행 4: 여백 | Ax² 레이블 | C 레이블 */}
          <div />
          <div className="h-8 flex items-center justify-center">
            <span className="font-mono font-bold text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">{fmtTerm(q.A, "x2")}</span>
          </div>
          <div className="h-8 flex items-center justify-center">
            <span className="font-mono font-bold text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">{fmtTerm(q.C, "c")}</span>
          </div>
        </div>

        {/* 교차항 합 안내 */}
        {!feedback && crossSum !== null && (
          <div className={`text-center text-sm mb-4 font-semibold transition-all ${crossSum === q.B ? "text-green-500" : "text-orange-400"}`}>
            교차항 합: {fmtTerm(crossSum, "x")}
            {crossSum === q.B ? " ✅ 맞아요!" : ` (목표: ${fmtTerm(q.B, "x")})`}
          </div>
        )}

        {/* 제출 버튼 / 피드백 */}
        {!feedback ? (
          <button onClick={handleSubmit} className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg shadow-purple-200 active:scale-95 mt-2">
            정답 확인 🚀
          </button>
        ) : (
          <div>
            <div className={`text-2xl font-bold text-center mb-5 ${correct ? "text-green-500" : "text-red-500"}`}>
              {correct ? "🎉 정답입니다!" : "🥲 틀렸어요!"}
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100">
              <p className="text-sm text-slate-500 font-bold text-center mb-3">올바른 인수분해</p>
              <p className="font-mono text-center text-slate-600 text-base mb-1">{fmtQuad(q.A, q.B, q.C)}</p>
              <p className="text-center text-slate-400 text-sm mb-1">＝</p>
              <p className="font-mono text-center text-xl font-extrabold text-purple-600 mb-3">({fmtFactor(q.p, q.q)})({fmtFactor(q.r, q.s)})</p>
              <AnsGrid />
              <p className="text-xs text-slate-400 text-center mt-3">
                교차항: {fmtTerm(q.q * q.r, "x")} + {fmtTerm(q.p * q.s, "x")} = {fmtTerm(q.B, "x")}
              </p>
            </div>
            <button onClick={next} className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg shadow-purple-200 active:scale-95">
              다음 문제 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
