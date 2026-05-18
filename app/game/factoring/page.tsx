"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// (px+q)(rx+s) = pr·x² + (ps+qr)·x + qs
type Q = { A:number; B:number; C:number; p:number; q:number; r:number; s:number; hint?:string; };

const ALL:Q[] = [
  { A:8,  B:2,   C:-3,  p:4, q:3,  r:2, s:-1, hint:"합이 2, 곱이 -24인 두 수" },
  { A:1,  B:-4,  C:4,   p:1, q:-2, r:1, s:-2, hint:"완전제곱식 (a-b)²" },
  { A:1,  B:0,   C:-25, p:1, q:5,  r:1, s:-5, hint:"합차공식 a²-b²" },
  { A:4,  B:-3,  C:-1,  p:4, q:1,  r:1, s:-1 },
  { A:1,  B:-4,  C:0,   p:1, q:0,  r:1, s:-4, hint:"공통인수 x로 묶기" },
  { A:4,  B:0,   C:-9,  p:2, q:3,  r:2, s:-3, hint:"합차공식 (2x)²-3²" },
  { A:1,  B:1,   C:-6,  p:1, q:3,  r:1, s:-2, hint:"합이 1, 곱이 -6인 두 수" },
  { A:1,  B:6,   C:8,   p:1, q:2,  r:1, s:4,  hint:"합이 6, 곱이 8인 두 수" },
  { A:2,  B:5,   C:3,   p:2, q:3,  r:1, s:1 },
  { A:1,  B:-1,  C:-12, p:1, q:-4, r:1, s:3 },
  { A:1,  B:0,   C:-9,  p:1, q:3,  r:1, s:-3, hint:"합차공식 a²-b²" },
  { A:1,  B:5,   C:6,   p:1, q:2,  r:1, s:3 },
  { A:3,  B:-5,  C:-2,  p:3, q:1,  r:1, s:-2 },
  { A:1,  B:-7,  C:12,  p:1, q:-3, r:1, s:-4 },
  { A:1,  B:3,   C:-4,  p:1, q:4,  r:1, s:-1 },
  { A:9,  B:0,   C:-4,  p:3, q:2,  r:3, s:-2, hint:"합차공식 (3x)²-2²" },
  { A:1,  B:-2,  C:-8,  p:1, q:-4, r:1, s:2 },
  { A:2,  B:-7,  C:3,   p:2, q:-1, r:1, s:-3 },
  { A:1,  B:8,   C:16,  p:1, q:4,  r:1, s:4,  hint:"완전제곱식 (a+b)²" },
  { A:1,  B:0,   C:-36, p:1, q:6,  r:1, s:-6, hint:"합차공식 a²-b²" },
];

function shuffle<T>(a:T[]):T[]{
  const b=[...a];
  for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}
  return b;
}

function quad(A:number,B:number,C:number){
  let s=A===1?"x²":A===-1?"-x²":`${A}x²`;
  if(B>0)s+=` + ${B}x`;else if(B<0)s+=` − ${Math.abs(B)}x`;
  if(C>0)s+=` + ${C}`;else if(C<0)s+=` − ${Math.abs(C)}`;
  return s;
}
function termX2(v:number){if(v===1)return"x²";if(v===-1)return"−x²";return`${v}x²`;}
function termX(v:number){if(v===0)return"0";if(v===1)return"x";if(v===-1)return"−x";return v>0?`${v}x`:`−${Math.abs(v)}x`;}
function termC(v:number){return v>=0?`${v}`:`−${Math.abs(v)}`;}
function fmtFactor(p:number,q:number){
  const x=p===1?"x":p===-1?"−x":`${p}x`;
  if(q===0)return x;
  return q>0?`${x} + ${q}`:`${x} − ${Math.abs(q)}`;
}
function checkAns(ip:number,iq:number,ir:number,is:number,q:Q){
  const ok=(a:number,b:number,c:number,d:number)=>a===q.p&&b===q.q&&c===q.r&&d===q.s;
  return ok(ip,iq,ir,is)||ok(ir,is,ip,iq)||ok(-ip,-iq,-ir,-is)||ok(-ir,-is,-ip,-iq);
}

export default function FactoringGame(){
  const [qs,setQs]=useState<Q[]>([]);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [fb,setFb]=useState(false);
  const [correct,setCorrect]=useState(false);
  const [over,setOver]=useState(false);
  const [showHint,setShowHint]=useState(false);
  // 입력값: 위 행(p=x계수, q=상수), 왼쪽 열(r=x계수, s=상수)
  const [vP,setVP]=useState(""); // 위행 왼(첫 인수 x계수)
  const [vQ,setVQ]=useState(""); // 위행 오(첫 인수 상수)
  const [vR,setVR]=useState(""); // 왼열 위(둘째 인수 x계수)
  const [vS,setVS]=useState(""); // 왼열 아래(둘째 인수 상수)

  useEffect(()=>{setQs(shuffle(ALL).slice(0,10));},[]);
  if(!qs.length)return<div className="p-20 text-center text-lg">불러오는 중...</div>;

  const q=qs[idx];
  const p=parseInt(vP), qn=parseInt(vQ), r=parseInt(vR), s=parseInt(vS);
  const hp=vP!==""&&!isNaN(p), hq=vQ!==""&&!isNaN(qn);
  const hr=vR!==""&&!isNaN(r), hs=vS!==""&&!isNaN(s);
  // 자동 계산되는 내부 셀
  const c11=hp&&hr?p*r:null;
  const c12=hq&&hr?qn*r:null;
  const c21=hp&&hs?p*s:null;
  const c22=hq&&hs?qn*s:null;
  const crossSum=(c12!==null&&c21!==null)?c12+c21:null;

  const submit=()=>{
    if(!hp||!hq||!hr||!hs){alert("노란 칸을 모두 채워주세요!");return;}
    const ok=checkAns(p,qn,r,s,q);
    setCorrect(ok);setFb(true);
    if(ok)setScore(prev=>prev+10);
  };
  const next=()=>{
    setFb(false);setShowHint(false);
    setVP("");setVQ("");setVR("");setVS("");
    if(idx+1<qs.length)setIdx(i=>i+1);else setOver(true);
  };
  const reset=()=>{
    setQs(shuffle(ALL).slice(0,10));setIdx(0);setScore(0);
    setFb(false);setCorrect(false);setOver(false);setShowHint(false);
    setVP("");setVQ("");setVR("");setVS("");
  };

  if(over){
    const lv=[
      {min:100,msg:"🏆 완벽! 인수분해 마스터!",c:"text-yellow-500"},
      {min:80, msg:"🌟 훌륭해요!",c:"text-green-500"},
      {min:60, msg:"👍 잘했어요!",c:"text-blue-500"},
      {min:0,  msg:"💪 다시 도전해봐요!",c:"text-purple-500"},
    ].find(l=>score>=l.min)!;
    return(
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold mb-6">🎉 게임 완료!</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 w-full">
          <p className="text-xl text-slate-500 mb-2">최종 점수 (100점 만점)</p>
          <p className={`text-7xl font-black mb-3 ${lv.c}`}>{score}점</p>
          <p className={`text-lg font-bold mb-8 ${lv.c}`}>{lv.msg}</p>
          <div className="flex flex-col gap-3">
            <button onClick={reset} className="py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all active:scale-95">🔄 다시 하기</button>
            <Link href="/playground" className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all text-center">🏠 놀이터로</Link>
          </div>
        </div>
      </div>
    );
  }

  // 노란색 입력 칸 스타일
  const yellow=`w-full h-14 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
    ${fb
      ?"bg-yellow-50 border-yellow-200 text-slate-500 cursor-not-allowed"
      :"border-yellow-400 focus:border-yellow-500 bg-yellow-50 text-slate-800 placeholder-yellow-300"}`;

  // 흰색 자동계산 셀 스타일
  const autoCell=(v:number|null,isCorner:boolean,target?:number)=>{
    const base="h-14 flex items-center justify-center font-mono font-bold text-sm md:text-base border border-dashed rounded-xl transition-all select-none";
    if(v===null)return`${base} border-slate-200 bg-white text-slate-200`;
    if(fb&&isCorner&&target!==undefined)
      return v===target?`${base} border-green-300 bg-green-50 text-green-700`:`${base} border-red-300 bg-red-50 text-red-500`;
    return`${base} border-slate-300 bg-white text-slate-700`;
  };

  return(
    <div className="max-w-xl mx-auto px-4 py-10 flex flex-col items-center">
      {/* 진행 바 */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
          <span>문제 {idx+1} / {qs.length}</span>
          <span className="text-purple-600">점수: {score}점</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div className="bg-purple-400 h-full transition-all duration-500" style={{width:`${((idx+1)/qs.length)*100}%`}}/>
        </div>
      </div>

      <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50">

        {/* 힌트 */}
        {q.hint&&!fb&&(
          <div className="text-center mb-5">
            {showHint
              ?<span className="inline-block bg-yellow-50 text-yellow-600 text-sm font-bold px-5 py-2 rounded-full border border-yellow-300">💡 {q.hint}</span>
              :<button onClick={()=>setShowHint(true)} className="text-slate-400 hover:text-yellow-500 text-sm font-semibold px-5 py-2 rounded-full border border-slate-200 hover:border-yellow-300 transition-all">💡 힌트 보기</button>
            }
          </div>
        )}

        {/* ══════════════════════════════
            십자가 격자 (이미지와 동일 구조)
            
            구조:
            [×]   | [노란 입력: p·x계수] | [노란 입력: q·상수]
            [노란 입력: r·x계수] | [자동: p*r x²] | [자동: q*r x]
            [노란 입력: s·상수]  | [자동: p*s x]  | [자동: q*s]
                  | [레이블: Ax²]        | [레이블: C]
            ══════════════════════════════ */}
        <div className="max-w-sm mx-auto mb-2">
          <div className="grid gap-2" style={{gridTemplateColumns:"52px 1fr 1fr"}}>

            {/* ─ 행 0: × | 노란입력(p) | 노란입력(q) ─ */}
            <div className="h-14 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-400">×</span>
            </div>
            {/* 노란 입력: 첫 번째 인수 x계수 (p) */}
            <div className="relative">
              <input
                type="number" value={vP} onChange={e=>setVP(e.target.value)}
                disabled={fb} className={yellow} placeholder="?"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-yellow-400 pointer-events-none font-bold select-none">x</span>
            </div>
            {/* 노란 입력: 첫 번째 인수 상수 (q) */}
            <input type="number" value={vQ} onChange={e=>setVQ(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>

            {/* ─ 행 1: 노란입력(r) | 자동(p*r x²) | 자동(q*r x) ─ */}
            {/* 노란 입력: 두 번째 인수 x계수 (r) */}
            <div className="relative">
              <input
                type="number" value={vR} onChange={e=>setVR(e.target.value)}
                disabled={fb} className={yellow} placeholder="?"
              />
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-yellow-400 pointer-events-none font-bold select-none">x</span>
            </div>
            {/* 자동: p*r → Ax² */}
            <div className={autoCell(c11,true,q.A)}>
              {c11!==null?termX2(c11):<span className="text-slate-200">?</span>}
            </div>
            {/* 자동: q*r → 교차항1 */}
            <div className={autoCell(c12,false)}>
              {c12!==null?termX(c12):<span className="text-slate-200">?</span>}
            </div>

            {/* ─ 행 2: 노란입력(s) | 자동(p*s x) | 자동(q*s) ─ */}
            {/* 노란 입력: 두 번째 인수 상수 (s) */}
            <input type="number" value={vS} onChange={e=>setVS(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>
            {/* 자동: p*s → 교차항2 */}
            <div className={autoCell(c21,false)}>
              {c21!==null?termX(c21):<span className="text-slate-200">?</span>}
            </div>
            {/* 자동: q*s → C */}
            <div className={autoCell(c22,true,q.C)}>
              {c22!==null?termC(c22):<span className="text-slate-200">?</span>}
            </div>

            {/* ─ 행 3: 레이블 (Ax², C) ─ */}
            <div/>
            <div className="h-9 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-mono font-bold text-slate-600 text-sm">{termX2(q.A)}</span>
            </div>
            <div className="h-9 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-mono font-bold text-slate-600 text-sm">{termC(q.C)}</span>
            </div>
          </div>
        </div>

        {/* 교차항 합 실시간 피드백 */}
        {!fb&&crossSum!==null&&(
          <div className={`text-center text-xs mb-1 font-semibold ${crossSum===q.B?"text-green-500":"text-orange-400"}`}>
            교차항 합: {termX(crossSum)} {crossSum===q.B?"✅ 맞아요!":"(목표: "+termX(q.B)+")"}
          </div>
        )}

        {/* ── 인수분해하세요 + 전체 식 (맨 아래) ── */}
        <div className="max-w-sm mx-auto mt-4 mb-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-1">인수분해하세요.</p>
          <p className="font-mono text-2xl font-extrabold text-slate-800">{quad(q.A,q.B,q.C)} =</p>
        </div>

        {/* ── 제출 / 피드백 ── */}
        {!fb?(
          <button onClick={submit} className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg shadow-purple-200 active:scale-95">
            정답 확인 🚀
          </button>
        ):(
          <div>
            <div className={`text-2xl font-bold text-center mb-4 ${correct?"text-green-500":"text-red-500"}`}>
              {correct?"🎉 정답입니다!":"🥲 틀렸어요!"}
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold text-center mb-3">올바른 인수분해</p>
              <p className="font-mono text-center text-slate-600 mb-1">{quad(q.A,q.B,q.C)}</p>
              <p className="text-center text-slate-400 text-sm mb-2">＝</p>
              <p className="font-mono text-center text-xl font-extrabold text-purple-600 mb-4">
                ({fmtFactor(q.p,q.q)})({fmtFactor(q.r,q.s)})
              </p>
              {/* 정답 격자 */}
              <div className="grid gap-1 max-w-xs mx-auto text-xs font-mono" style={{gridTemplateColumns:"52px 1fr 1fr"}}>
                <div className="h-9 flex items-center justify-center text-slate-300 font-bold">×</div>
                <div className="h-9 flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold rounded-lg border border-yellow-300">{termX(q.p)}</div>
                <div className="h-9 flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold rounded-lg border border-yellow-300">{termC(q.q)}</div>
                <div className="h-9 flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold rounded-lg border border-yellow-300">{termX(q.r)}</div>
                <div className="h-9 flex items-center justify-center bg-white text-slate-700 rounded-lg border border-slate-200">{termX2(q.p*q.r)}</div>
                <div className="h-9 flex items-center justify-center bg-white text-slate-600 rounded-lg border border-slate-200">{termX(q.q*q.r)}</div>
                <div className="h-9 flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold rounded-lg border border-yellow-300">{termC(q.s)}</div>
                <div className="h-9 flex items-center justify-center bg-white text-slate-600 rounded-lg border border-slate-200">{termX(q.p*q.s)}</div>
                <div className="h-9 flex items-center justify-center bg-white text-slate-700 rounded-lg border border-slate-200">{termC(q.q*q.s)}</div>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                교차항: {termX(q.q*q.r)} + {termX(q.p*q.s)} = {termX(q.B)}
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
