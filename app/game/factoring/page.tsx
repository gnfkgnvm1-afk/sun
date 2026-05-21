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
function fmtFactor(p:number,q:number){
  const x=p===1?"x":p===-1?"−x":`${p}x`;
  if(q===0)return x;
  return q>0?`${x} + ${q}`:`${x} − ${Math.abs(q)}`;
}
function checkAns(ip:number,iq:number,ir:number,is:number,q:Q){
  const ok=(a:number,b:number,c:number,d:number)=>a===q.p&&b===q.q&&c===q.r&&d===q.s;
  return ok(ip,iq,ir,is)||ok(ir,is,ip,iq)||ok(-ip,-iq,-ir,-is)||ok(-ir,-is,-ip,-iq);
}

// 렌더링 포맷 헬퍼
function fmtTerm(val: number | null, type: 'x2' | 'x' | 'c', isFirstInRow: boolean) {
  if (val === null) return null;
  
  if (type === 'x2') {
    if (val === 0) return "";
    let str = val === 1 ? "x²" : val === -1 ? "−x²" : `${val}x²`;
    if (val > 0) return isFirstInRow ? str : `+ ${str}`;
    else return isFirstInRow ? str : `− ${Math.abs(val)}x²`;
  }
  
  if (type === 'x') {
    if (val === 0) return isFirstInRow ? "0" : "+ 0x";
    let str = val === 1 ? "x" : val === -1 ? "−x" : `${Math.abs(val)}x`;
    if (val > 0) return isFirstInRow ? str : `+ ${str}`;
    else {
      if (val === -1) return isFirstInRow ? "−x" : "− x";
      return isFirstInRow ? `−${Math.abs(val)}x` : `− ${Math.abs(val)}x`;
    }
  }
  
  if (type === 'c') {
    if (val === 0) return isFirstInRow ? "0" : "+ 0";
    let str = `${Math.abs(val)}`;
    if (val > 0) return isFirstInRow ? str : `+ ${str}`;
    else return isFirstInRow ? `−${str}` : `− ${str}`;
  }
  return "";
}

export default function FactoringGame(){
  const [qs,setQs]=useState<Q[]>([]);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [fb,setFb]=useState(false);
  const [correct,setCorrect]=useState(false);
  const [over,setOver]=useState(false);
  const [showHint,setShowHint]=useState(false);
  
  // 숫자 입력값 (계수 및 상수)
  const [vP,setVP]=useState("");
  const [vQ,setVQ]=useState("");
  const [vR,setVR]=useState("");
  const [vS,setVS]=useState("");

  useEffect(()=>{setQs(shuffle(ALL).slice(0,10));},[]);
  if(!qs.length)return<div className="p-20 text-center text-lg">불러오는 중...</div>;

  const q=qs[idx];
  const p=parseInt(vP), qn=parseInt(vQ), r=parseInt(vR), s=parseInt(vS);
  const hp=vP!==""&&!isNaN(p), hq=vQ!==""&&!isNaN(qn);
  const hr=vR!==""&&!isNaN(r), hs=vS!==""&&!isNaN(s);

  const submit=()=>{
    if(!hp||!hq||!hr||!hs){alert("노란 칸을 모두 숫자로 채워주세요!");return;}
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

  // 노란색 입력 칸 (텍스트)
  const yellow=`w-full h-14 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
    ${fb
      ?"bg-yellow-50 border-yellow-200 text-slate-500 cursor-not-allowed"
      :"border-yellow-400 focus:border-yellow-500 bg-yellow-50 text-slate-800 placeholder-yellow-300"}`;

  // 하단 그리드 셀 (피드백 색상 포함)
  const calcCell=(v:string|null, isValid?:boolean)=>{
    const base="h-14 flex items-center justify-center font-mono font-bold text-sm md:text-base border-b border-slate-200 transition-all select-none relative z-10";
    if(v===null)return`${base} bg-white text-slate-200`;
    if(fb&&isValid!==undefined)
      return isValid?`${base} bg-green-50 text-green-700`:`${base} bg-red-50 text-red-500`;
    return`${base} bg-white text-slate-700`;
  };

  // 하단 그리드 값 계산
  const v12 = (hs&&hp) ? fmtTerm(s*p, 'x', true) : null;
  const v13 = (hs&&hq) ? fmtTerm(s*qn, 'c', false) : null;
  const v21 = (hr&&hp) ? fmtTerm(r*p, 'x2', true) : null;
  const v22 = (hr&&hq) ? fmtTerm(r*qn, 'x', false) : null;
  
  // 목표 문자열
  const targetC1 = fmtTerm(q.A, 'x2', true);
  const targetC2 = fmtTerm(q.B, 'x', false);
  const targetC3 = fmtTerm(q.C, 'c', false);
  
  // 중간합계 문자열
  const sumC2 = (hs&&hp&&hr&&hq) ? fmtTerm(s*p + r*qn, 'x', false) : null;

  return(
    <div className="max-w-xl mx-auto px-4 py-10 flex flex-col items-center">
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
        {q.hint&&!fb&&(
          <div className="text-center mb-5">
            {showHint
              ?<span className="inline-block bg-yellow-50 text-yellow-600 text-sm font-bold px-5 py-2 rounded-full border border-yellow-300">💡 {q.hint}</span>
              :<button onClick={()=>setShowHint(true)} className="text-slate-400 hover:text-yellow-500 text-sm font-semibold px-5 py-2 rounded-full border border-slate-200 hover:border-yellow-300 transition-all">💡 힌트 보기</button>
            }
          </div>
        )}

        <div className="max-w-sm mx-auto mb-2 relative">
          {/* 상단 2x2 입력 그리드 */}
          <div className="flex gap-2 items-center justify-center mb-4 relative z-10">
            <span className="text-2xl font-bold text-slate-400 absolute -left-8">×</span>
            <div className="grid grid-cols-2 gap-2 w-48">
              <div className="relative">
                <input type="number" value={vP} onChange={e=>setVP(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-yellow-500 font-bold select-none pointer-events-none">x</span>
              </div>
              <input type="number" value={vQ} onChange={e=>setVQ(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>
              <div className="relative">
                <input type="number" value={vR} onChange={e=>setVR(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-yellow-500 font-bold select-none pointer-events-none">x</span>
              </div>
              <input type="number" value={vS} onChange={e=>setVS(e.target.value)} disabled={fb} className={yellow} placeholder="?"/>
            </div>
          </div>
          
          <div className="border-t-4 border-slate-800 w-full mb-4"></div>

          {/* 하단 3x3 계산 그리드 */}
          <div className="grid grid-cols-3 gap-0 border-x border-t border-slate-200 rounded-t-lg overflow-hidden relative">
            {/* 세로 구분선(가상) */}
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-slate-200 border-dashed border-r z-0"></div>
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-slate-200 border-dashed border-r z-0"></div>
            
            {/* Row 1 (상수 s 곱하기) */}
            <div className={calcCell(null)}></div>
            <div className={calcCell(v12, sumC2 === targetC2)}>{v12||"?"}</div>
            <div className={calcCell(v13, v13 === targetC3)}>{v13||"?"}</div>
            
            {/* Row 2 (x항 rx 곱하기) */}
            <div className={calcCell(v21, v21 === targetC1)}>{v21||"?"}</div>
            <div className={calcCell(v22, sumC2 === targetC2)}>{v22||"?"}</div>
            <div className={calcCell(null)}></div>
          </div>

          {/* Row 3 (결과 목표 라벨) */}
          <div className="grid grid-cols-3 gap-0 border border-slate-200 bg-slate-50 rounded-b-lg overflow-hidden relative z-10">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-slate-200 z-0"></div>
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-slate-200 z-0"></div>
            
            <div className="h-12 flex items-center justify-center font-mono font-extrabold text-blue-600 text-sm md:text-base relative z-10">{targetC1}</div>
            <div className="h-12 flex items-center justify-center font-mono font-extrabold text-blue-600 text-sm md:text-base relative z-10">{targetC2}</div>
            <div className="h-12 flex items-center justify-center font-mono font-extrabold text-blue-600 text-sm md:text-base relative z-10">{targetC3}</div>
          </div>
        </div>

        {/* 교차항 합 피드백 (디버깅용으로 작게 표시) */}
        {!fb&&sumC2!==null&&(
          <div className={`text-center text-xs mt-2 font-semibold ${sumC2===targetC2?"text-green-500":"text-orange-400"}`}>
            가운데 항 합계: {sumC2} {sumC2===targetC2?"✅ 맞아요!":"(목표: "+targetC2+")"}
          </div>
        )}

        <div className="max-w-sm mx-auto mt-6 mb-5 pt-4 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-1">인수분해하세요.</p>
          <p className="font-mono text-2xl font-extrabold text-slate-800">{quad(q.A,q.B,q.C)} =</p>
        </div>

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
