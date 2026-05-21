"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type TileType = "x" | "-x" | "1" | "-1";
type Tile = {
  id: string;
  type: TileType;
  state: "idle" | "selected" | "popping" | "removed";
};

type Question = {
  a: number; // x coeff 1
  b: number; // const 1
  c: number; // x coeff 2
  d: number; // const 2
};

function randomInt(min: number, max: number, excludeZero = true) {
  let val = 0;
  while (val === 0 && excludeZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

function generateQuestion(): Question {
  // x계수: 항상 서로 다른 부호 (zero-pair 보장)
  const a = randomInt(1, 4);
  const c = -randomInt(1, 4);

  // 상수항: 항상 서로 다른 부호 (zero-pair 보장)
  const b = randomInt(1, 5);
  const d = -randomInt(1, 5);

  return { a, b, c, d };
}

function fmtExpr(a: number, b: number, c: number, d: number) {
  const tX = (v: number, first: boolean) => {
    if (v === 0) return "";
    const s = Math.abs(v) === 1 ? "x" : `${Math.abs(v)}x`;
    if (first) return v > 0 ? s : `−${s}`;
    return v > 0 ? `+ ${s}` : `− ${s}`;
  };
  const tC = (v: number) => {
    if (v === 0) return "";
    return v > 0 ? `+ ${v}` : `− ${Math.abs(v)}`;
  };

  return `${tX(a, true)} ${tC(b)} ${tX(c, false)} ${tC(d)}`.trim();
}

function makeTiles(q: Question): Tile[] {
  const newTiles: Tile[] = [];
  const addTiles = (count: number, typePos: TileType, typeNeg: TileType) => {
    const type = count > 0 ? typePos : typeNeg;
    for (let i = 0; i < Math.abs(count); i++) {
      newTiles.push({
        id: Math.random().toString(36).substring(2, 11),
        type,
        state: "idle",
      });
    }
  };

  addTiles(q.a, "x", "-x");
  addTiles(q.b, "1", "-1");
  addTiles(q.c, "x", "-x");
  addTiles(q.d, "1", "-1");

  for (let i = newTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
  }
  return newTiles;
}

function hasPairs(ts: Tile[]): boolean {
  const active = ts.filter(
    (t) => t.state !== "removed" && t.state !== "popping"
  );
  const hasX = active.some((t) => t.type === "x");
  const hasNegX = active.some((t) => t.type === "-x");
  const has1 = active.some((t) => t.type === "1");
  const hasNeg1 = active.some((t) => t.type === "-1");
  return (hasX && hasNegX) || (has1 && hasNeg1);
}

export default function LikeTermsGame() {
  const [q, setQ] = useState<Question | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<"popping" | "input" | "done">("popping");

  const [vX, setVX] = useState("");
  const [vC, setVC] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [round, setRound] = useState(1);
  const maxRounds = 5;

  const initRound = useCallback(() => {
    const newQ = generateQuestion();
    setQ(newQ);
    const newTiles = makeTiles(newQ);
    setTiles(newTiles);
    setSelectedId(null);
    setPhase(hasPairs(newTiles) ? "popping" : "input");
    setVX("");
    setVC("");
    setCorrect(null);
  }, []);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const handleTileClick = (id: string) => {
    if (phase !== "popping") return;

    const tile = tiles.find((t) => t.id === id);
    if (!tile || (tile.state !== "idle" && tile.state !== "selected")) return;

    if (selectedId === id) {
      setTiles((ts) =>
        ts.map((t) => (t.id === id ? { ...t, state: "idle" as const } : t))
      );
      setSelectedId(null);
      return;
    }

    if (!selectedId) {
      setTiles((ts) =>
        ts.map((t) =>
          t.id === id ? { ...t, state: "selected" as const } : t
        )
      );
      setSelectedId(id);
      return;
    }

    const selectedTile = tiles.find((t) => t.id === selectedId);
    if (!selectedTile) return;

    const isPair = (t1: TileType, t2: TileType) =>
      (t1 === "x" && t2 === "-x") ||
      (t1 === "-x" && t2 === "x") ||
      (t1 === "1" && t2 === "-1") ||
      (t1 === "-1" && t2 === "1");

    if (isPair(selectedTile.type, tile.type)) {
      setTiles((ts) =>
        ts.map((t) =>
          t.id === id || t.id === selectedId
            ? { ...t, state: "popping" as const }
            : t
        )
      );
      setSelectedId(null);

      setTimeout(() => {
        setTiles((ts) => {
          const updated = ts.map((t) =>
            t.state === "popping" ? { ...t, state: "removed" as const } : t
          );
          if (!hasPairs(updated)) {
            setPhase("input");
          }
          return updated;
        });
      }, 500);
    } else {
      setTiles((ts) =>
        ts.map((t) => {
          if (t.id === selectedId) return { ...t, state: "idle" as const };
          if (t.id === id) return { ...t, state: "selected" as const };
          return t;
        })
      );
      setSelectedId(id);
    }
  };

  const checkAnswer = () => {
    if (!q) return;
    const ansX = q.a + q.c;
    const ansC = q.b + q.d;

    const userX = vX.trim() === "" ? 0 : parseInt(vX);
    const userC = vC.trim() === "" ? 0 : parseInt(vC);

    if (isNaN(userX) || isNaN(userC)) {
      alert("숫자를 정확히 입력해주세요.");
      return;
    }

    const isOk = userX === ansX && userC === ansC;
    setCorrect(isOk);
    if (isOk) {
      setScore((s) => s + 20);
      setPhase("done");
    }
  };

  const nextRound = () => {
    if (round < maxRounds) {
      setRound((r) => r + 1);
      initRound();
    }
  };

  const renderTile = (tile: Tile) => {
    if (tile.state === "removed")
      return <div key={tile.id} className="w-0 h-0 hidden" />;

    const base =
      "cursor-pointer transition-all duration-300 flex items-center justify-center font-bold text-white shadow-sm select-none relative";
    let size = "";
    let color = "";
    let label = "";

    if (tile.type === "x" || tile.type === "-x") {
      size = "w-10 h-24 rounded-md";
      color =
        tile.type === "x"
          ? "bg-green-500 hover:bg-green-400"
          : "bg-red-500 hover:bg-red-400";
      label = tile.type === "x" ? "+x" : "-x";
    } else {
      size = "w-10 h-10 rounded-sm";
      color =
        tile.type === "1"
          ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
          : "bg-red-500 hover:bg-red-400";
      label = tile.type === "1" ? "+1" : "-1";
    }

    let stateClass = "";
    if (tile.state === "selected") {
      stateClass = "ring-4 ring-pink-400 scale-110 z-10";
    } else if (tile.state === "popping") {
      stateClass = "scale-150 opacity-0 rotate-12 pointer-events-none";
    }

    return (
      <div
        key={tile.id}
        onClick={() => handleTileClick(tile.id)}
        className={`${base} ${size} ${color} ${stateClass}`}
      >
        {tile.state === "popping" && (
          <span className="absolute text-5xl transform animate-ping z-20">
            💥
          </span>
        )}
        {tile.state !== "popping" && <span className="text-sm">{label}</span>}
      </div>
    );
  };

  if (!q) return <div className="p-20 text-center">불러오는 중...</div>;

  if (round > maxRounds && phase === "done") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold mb-6">🎉 게임 완료!</h1>
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-pink-100 border border-pink-50 w-full">
          <p className="text-xl text-slate-500 mb-2">최종 점수</p>
          <p className="text-7xl font-black mb-3 text-pink-500">{score}점</p>
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={() => {
                setRound(1);
                setScore(0);
                initRound();
              }}
              className="py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-all active:scale-95"
            >
              🔄 다시 하기
            </button>
            <Link
              href="/playground"
              className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-all text-center"
            >
              🏠 놀이터로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center">
      {/* 진행 바 */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
          <span>
            문제 {round} / {maxRounds}
          </span>
          <span className="text-pink-600">점수: {score}점</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-pink-400 h-full transition-all duration-500"
            style={{ width: `${(round / maxRounds) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white w-full p-6 md:p-8 rounded-3xl shadow-2xl shadow-pink-100 border border-pink-50 flex flex-col items-center">
        <h2 className="text-lg font-bold text-slate-400 mb-2">
          다음 식을 간단히 하세요
        </h2>
        <div className="text-3xl md:text-4xl font-extrabold font-mono text-slate-800 mb-8 tracking-wider text-center">
          {fmtExpr(q.a, q.b, q.c, q.d)}
        </div>

        {/* 대수막대 영역 */}
        <div className="w-full min-h-[250px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 mb-8 flex flex-wrap gap-2 items-center justify-center content-center relative overflow-hidden">
          {phase === "popping" && (
            <div className="absolute top-3 left-0 right-0 text-center text-sm font-bold text-pink-500 animate-pulse bg-white/80 py-1 mx-4 rounded-full">
              서로 반대되는 타일(+와 -)을 클릭해서 없애보세요! 💥
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-end justify-center w-full mt-8">
            {tiles.map(renderTile)}
          </div>

          {tiles.every((t) => t.state === "removed") && phase === "input" && (
            <div className="text-slate-400 font-bold mt-4">
              모든 타일이 사라졌습니다! (0)
            </div>
          )}
        </div>

        {/* 정답 입력 영역 */}
        <div
          className={`w-full max-w-sm transition-all duration-500 ${phase !== "popping" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 text-center">
            <h3 className="font-bold text-pink-600 mb-4">
              남은 타일을 보고 식을 완성하세요
            </h3>

            <div className="flex items-center justify-center gap-3 mb-6 text-2xl font-bold text-slate-700 font-mono">
              <input
                type="number"
                value={vX}
                onChange={(e) => setVX(e.target.value)}
                disabled={correct === true}
                className="w-20 h-14 text-center rounded-xl border-2 border-pink-200 focus:border-pink-500 outline-none bg-white"
                placeholder="0"
              />
              <span>x</span>
              <span>+</span>
              <input
                type="number"
                value={vC}
                onChange={(e) => setVC(e.target.value)}
                disabled={correct === true}
                className="w-20 h-14 text-center rounded-xl border-2 border-pink-200 focus:border-pink-500 outline-none bg-white"
                placeholder="0"
              />
            </div>

            {correct === null && (
              <button
                onClick={checkAnswer}
                className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-pink-200"
              >
                정답 확인 🚀
              </button>
            )}

            {correct === false && (
              <>
                <div className="text-red-500 font-bold mb-4 animate-bounce">
                  🥲 틀렸어요! 숫자를 다시 확인해보세요.
                </div>
                <button
                  onClick={checkAnswer}
                  className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-pink-200"
                >
                  다시 확인
                </button>
              </>
            )}

            {correct === true && (
              <div className="flex flex-col items-center">
                <div className="text-green-500 font-bold text-xl mb-4">
                  🎉 정답입니다!
                </div>
                <button
                  onClick={nextRound}
                  className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-all active:scale-95 shadow-md shadow-green-200"
                >
                  다음 문제 ➔
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
