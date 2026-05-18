"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

function shuffle<T>(a:T[]):T[]{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

// 이차식 전체 문자열
function quad(A:number,B:number,C:number){
  let s=A===1?"x²":A===-1?"-x²":`${A}x²`;
  if(B>0)s+=` + ${B}x`;else if(B<0)s+=` − ${Math.abs(B)}x`;
  if(C>0)s+=` + ${C}`;else if(C<0)s+=` − ${Math.abs(C)}`;
  return s;
}
// 항 하나 (종류별)
function term(v:number,k:"x2"|"x"|"c"){
  if(k==="x2"){if(v===0)return"0";if(v===1)return"x²";if(v===-1)return"−x²";return`${v}x²`;}
  if(k==="x"){if(v===0)return"0";if(v===1)return"x";if(v===-1)return"−x";return v>0?`${v}x`:`−${Math.abs(v)}x`;}
  return v>=0?`${v}`:`−${Math.abs(v)}`;
}
// 인수 하나 (px+q)
function factor(p:number,q:number){
  const x=p===1?"x":p===-1?"−x":`${p}x`;
  if(q===0)return x;
  return q>0?`${x} + ${q}`:`${x} − ${Math.abs(q)}`;
}
// 정답 체크 (순서/전체부호 무관)
function check(ip:number,iq:number,ir:number,is:number,q:Q){
  const ok=(a:number,b:number,c:number,d:number)=>a===q.p&&b===q.q&&c===q.r&&d===q.s;
  return ok(ip,iq,ir,is)||ok(ir,is,ip,iq)||ok(-ip,-iq,-ir,-is)||ok(-ir,-is,-ip,-iq);
}

export default function FactoringGame(){
  const [qs,setQs]=useState<Q[]>([]);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [fb,setFb]=useState(false);
  const [ok,setOk]=useState(false);
  const [over,setOver]=useState(false);
  const [hint,setHint]=useState(false);
  const [vP,setVP]=useState(""); // 위 왼(x계수1)
  const [vQ,setVQ]=useState(""); // 위 오(상수1)
  const [vR,setVR]=useState(""); // 좌 위(x계수2)
  const [vS,setVS]=useState(""); // 좌 아래(상수2)

  useEffect(()=>{setQs(shuffle(ALL).slice(0,10));},[]);
  if(!qs.length)return<div className="p-20 text-center">불러오는 중...</div>;

  const q=qs[idx];
  const p=parseInt(vP),qn=parseInt(vQ),r=parseInt(vR),s=parseInt(vS);
  const hp=vP!==""&&!isNaN(p), hq=vQ!==""&&!isNaN(qn);
  const hr=vR!==""&&!isNaN(r), hs=vS!==""&&!isNaN(s);
  const c11=hp&&hr?p*r:null; // Ax²
  const c12=hq&&hr?qn*r:null; // 교차1
  const c21=hp&&hs?p*s:null;  // 교차2
  const c22=hq&&hs?qn*s:null; // C
  const crossSum=(c12!==null&&c21!==null)?c12+c21:null;

  const submit=()=>{
    if(!hp||!hq||!hr||!hs){alert("4칸을 모두 채워주세요!");return;}
    const res=check(p,qn,r,s,q);
    setOk(res);setFb(true);
    if(res)setScore(prev=>prev+10);
  };
  const next=()=>{
    setFb(false);setHint(false);setVP("");setVQ("");setVR("");setVS("");
    if(idx+1<qs.length)setIdx(i=>i+1);else setOver(true);
  };
  const reset=()=>{
    setQs(shuffle(ALL).slice(0,10));setIdx(0);setScore(0);
    setFb(false);setOk(false);setOver(false);setHint(false);
    setVP("");setVQ("");setVR("");setVS("");
  };

  if(over){
    const levels=[
      {min:100,msg:"🏆 완벽! 인수분해 마스터!",color:"text-yellow-500"},
      {min:80, msg:"🌟 훌륭해요!",color:"text-green-500"},
      {min:60, msg:"👍 잘했어요!",color:"text-blue-500"},
      {min:0,  msg:"💪 다시 도전해봐요!",color:"text-purple-500"},
    ];
    const lv=levels.find(l=>score>=l.min)!;
    return(
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold mb-6">🎉 게임 완료!</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 w-full">
          <p className="text-xl text-slate-500 mb-2">최종 점수 (100점 만점)</p>
          <p className={`text-7xl font-black mb-3 ${lv.color}`}>{score}점</p>
          <p className={`text-lg font-bold mb-8 ${lv.color}`}>{lv.msg}</p>
          <div className="flex flex-col gap-3">
            <button onClick={reset} className="py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all active:scale-95">🔄 다시 하기</button>
            <Link href="/playground" className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all text-center">🏠 놀이터로</Link>
          </div>
        </div>
      </div>
    );
  }

  // 입력 칸 스타일
  const inp=`w-full h-14 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${fb?"bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed":"border-purple-300 focus:border-purple-500 bg-white text-slate-800"}`;
  // 내부 자동 셀 스타일
  const auto=(v:number|null,corner:boolean,target?:number)=>{
    const base="h-14 flex items-center justify-center font-mono font-bold text-sm border-2 border-dashed rounded-xl transition-all select-none";
    if(v===null)return`${base} border-slate-200 bg-slate-50 text-slate-200`;
    if(fb&&corner&&target!==undefined)
      return v===target?`${base} border-green-300 bg-green-50 text-green-700`:`${base} border-red-300 bg-red-50 text-red-500`;
    return`${base} border-purple-200 bg-purple-50 text-purple-700`;
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
            {hint
              ?<span className="inline-block bg-purple-50 text-purple-600 text-sm font-bold px-5 py-2 rounded-full border border-purple-200">💡 {q.hint}</span>
              :<button onClick={()=>setHint(true)} className="text-slate-400 hover:text-purple-500 text-sm font-semibold px-5 py-2 rounded-full border border-slate-200 hover:border-purple-200 transition-all">💡 힌트 보기</button>
            }
          </div>
        )}

        {/* ── 십자가 격자 ── */}
        <div className="grid gap-2 mb-2" style={{gridTemplateColumns:"52px 1fr 1fr"}}>

          {/* 행0: × | p입력(x계수) | q입력(상수) */}
          <div className="h-14 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-300">×</span>
          </div>
          <div className="relative">
            <input type="number" value={vP} onChange={e=>setVP(e.target.value)} disabled={fb} className={inp} placeholder="?"/>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-300 pointer-events-none font-bold">x</span>
          </div>
          <div>
            <input type="number" value={vQ} onChange={e=>setVQ(e.target.value)} disabled={fb} className={inp} placeholder="?"/>
          </div>

          {/* 행1: r입력(x계수) | pr·x²(자동) | qr·x(자동) */}
          <div className="relative">
            <input type="number" value={vR} onChange={e=>setVR(e.target.value)} disabled={fb} className={inp} placeholder="?"/>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-slate-300 pointer-events-none font-bold">x</span>
          </div>
          <div className={auto(c11,true,q.A)}>
            {c11!==null?term(c11,"x2"):<span className="text-slate-200 text-xl">?</span>}
          </div>
          <div className={auto(c12,false)}>
            {c12!==null?term(c12,"x"):<span className="text-slate-200 text-xl">?</span>}
          </div>

          {/* 행2: s입력(상수) | ps·x(자동) | qs(자동) */}
          <div>
            <input type="number" value={vS} onChange={e=>setVS(e.target.value)} disabled={fb} className={inp} placeholder="?"/>
          </div>
          <div className={auto(c21,false)}>
            {c21!==null?term(c21,"x"):<span className="text-slate-200 text-xl">?</span>}
          </div>
          <div className={auto(c22,true,q.C)}>
            {c22!==null?term(c22,"c"):<span className="text-slate-200 text-xl">?</span>}
          </div>
        </div>

        {/* ── 맨 아래 레이블 행 (Ax², Bx, C) ── */}
        <div className="grid gap-2 mb-1" style={{gridTemplateColumns:"52px 1fr 1fr"}}>
          <div/>
          <div className="flex items-center justify-center h-9 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono font-bold text-slate-600 text-sm">{term(q.A,"x2")}</span>
          </div>
          <div className="flex items-center justify-center h-9 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono font-bold text-slate-600 text-sm">{term(q.C,"c")}</span>
          </div>
        </div>

        {/* ── "인수분해하세요." + 전체 식 (맨 아래) ── */}
        <div className="mt-4 mb-5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400 font-semibold mb-1 text-center">인수분해하세요.</p>
          <p className="font-mono text-center text-xl md:text-2xl font-extrabold text-slate-800">
            {quad(q.A,q.B,q.C)} =
          </p>
          {/* 교차항 합 실시간 표시 */}
          {!fb&&crossSum!==null&&(
            <p className={`text-center text-xs mt-2 font-semibold ${crossSum===q.B?"text-green-500":"text-orange-400"}`}>
              교차항 합: {term(crossSum,"x")} {crossSum===q.B?"✅ 맞아요!":"(목표: "+term(q.B,"x")+")"}
            </p>
          )}
        </div>

        {/* ── 제출 버튼 / 피드백 ── */}
        {!fb?(
          <button onClick={submit} className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg shadow-purple-200 active:scale-95">
            정답 확인 🚀
          </button>
        ):(
          <div>
            <div className={`text-2xl font-bold text-center mb-4 ${ok?"text-green-500":"text-red-500"}`}>
              {ok?"🎉 정답입니다!":"🥲 틀렸어요!"}
            </div>
            {/* 정답 해설 */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold text-center mb-3">올바른 인수분해</p>
              <p className="font-mono text-center text-slate-600 mb-1">{quad(q.A,q.B,q.C)}</p>
              <p className="text-center text-slate-400 text-sm mb-2">＝</p>
              <p className="font-mono text-center text-xl font-extrabold text-purple-600 mb-4">({factor(q.p,q.q)})({factor(q.r,q.s)})</p>
              {/* 정답 격자 */}
              <div className="grid gap-1 max-w-xs mx-auto text-xs font-mono" style={{gridTemplateColumns:"52px 1fr 1fr"}}>
                <div className="h-9 flex items-center justify-center text-slate-300 font-bold">×</div>
                <div className="h-9 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg">{term(q.p,"x")}</div>
                <div className="h-9 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg">{q.q>=0?`+${q.q}`:q.q}</div>
                <div className="h-9 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg">{term(q.r,"x")}</div>
                <div className="h-9 flex items-center justify-center bg-green-50 text-green-700 rounded-lg border border-green-200">{term(q.p*q.r,"x2")}</div>
                <div className="h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg border border-blue-200">{term(q.q*q.r,"x")}</div>
                <div className="h-9 flex items-center justify-center bg-purple-100 text-purple-700 font-bold rounded-lg">{q.s>=0?`+${q.s}`:q.s}</div>
                <div className="h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg border border-blue-200">{term(q.p*q.s,"x")}</div>
                <div className="h-9 flex items-center justify-center bg-green-50 text-green-700 rounded-lg border border-green-200">{term(q.q*q.s,"c")}</div>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                교차항: {term(q.q*q.r,"x")} + {term(q.p*q.s,"x")} = {term(q.B,"x")}
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
