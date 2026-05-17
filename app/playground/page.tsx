import Link from "next/link";

export default function Playground() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
        환영합니다! <span className="text-pink-500">수학 놀이터</span>입니다 🎪
      </h1>
      
      <p className="text-lg text-slate-600 mb-16 max-w-2xl">
        이곳에서는 다양한 수학 게임을 즐길 수 있습니다. 원하는 게임을 선택해서 즐겁게 수학을 배워보세요!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        
        {/* 부등식 게임 카드 */}
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
          <div className="h-48 bg-pink-100 flex items-center justify-center text-6xl">
            ⚖️
          </div>
          <div className="p-8 flex flex-col flex-grow">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">부등식의 방향 맞히기</h2>
            <p className="text-slate-600 mb-8 flex-grow">
              양수와 음수를 더하고 뺄 때, 곱하고 나눌 때 부등호의 방향은 어떻게 될까요? 게임을 통해 완벽하게 마스터해 보세요!
            </p>
            <Link href="/game/inequality" className="w-full mt-auto">
              <button className="w-full px-6 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg shadow-md shadow-pink-200 transition-all active:scale-95">
                부등식 게임 시작하기 🚀
              </button>
            </Link>
          </div>
        </div>

        {/* 나중에 추가될 다른 게임들을 위한 빈 카드들 (예시) */}
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400 min-h-[400px]">
          <span className="text-4xl mb-4">🔒</span>
          <p className="font-medium text-lg">새로운 게임이<br/>준비 중입니다</p>
        </div>

        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400 min-h-[400px]">
          <span className="text-4xl mb-4">🔒</span>
          <p className="font-medium text-lg">새로운 게임이<br/>준비 중입니다</p>
        </div>

      </div>
    </div>
  );
}
