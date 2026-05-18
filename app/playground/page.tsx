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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full max-w-7xl">
        
        {/* 정수의 덧셈 뺄셈 게임 카드 */}
        <Link href="/game/integer-math" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-pink-200/60 hover:shadow-pink-300/60 border-2 border-pink-200 hover:border-pink-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              ➕
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-pink-600 text-xs sm:text-sm font-extrabold mb-1">[중1]</span>
              정수 계산
            </h2>
          </div>
        </Link>

        {/* 정수의 곱셈 게임 카드 */}
        <Link href="/game/integer-multiplication" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-pink-200/60 hover:shadow-pink-300/60 border-2 border-pink-200 hover:border-pink-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              ✖️
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-pink-600 text-xs sm:text-sm font-extrabold mb-1">[중1]</span>
              정수 곱셈
            </h2>
          </div>
        </Link>

        {/* 일차방정식 게임 카드 */}
        <Link href="/game/linear-equation" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-pink-200/60 hover:shadow-pink-300/60 border-2 border-pink-200 hover:border-pink-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              🧩
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-pink-600 text-xs sm:text-sm font-extrabold mb-1">[중1]</span>
              일차방정식
            </h2>
          </div>
        </Link>

        {/* 부등식 게임 카드 */}
        <Link href="/game/inequality" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-amber-200/60 hover:shadow-amber-300/60 border-2 border-amber-200 hover:border-amber-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-amber-600 text-xs sm:text-sm font-extrabold mb-1">[중2]</span>
              부등식 방향
            </h2>
          </div>
        </Link>

        {/* 일차부등식 게임 카드 */}
        <Link href="/game/linear-inequality" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-amber-200/60 hover:shadow-amber-300/60 border-2 border-amber-200 hover:border-amber-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              🧮
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-amber-600 text-xs sm:text-sm font-extrabold mb-1">[중2]</span>
              일차부등식
            </h2>
          </div>
        </Link>

        {/* 식의 곱셈 게임 카드 */}
        <Link href="/game/polynomial-multiplication" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-blue-200/60 hover:shadow-blue-300/60 border-2 border-blue-200 hover:border-blue-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              📝
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-blue-600 text-xs sm:text-sm font-extrabold mb-1">[중3]</span>
              식의 곱셈
            </h2>
          </div>
        </Link>

        {/* 인수분해 게임 카드 */}
        <Link href="/game/factoring" className="group">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl shadow-purple-200/60 hover:shadow-purple-300/60 border-2 border-purple-200 hover:border-purple-400 overflow-hidden flex flex-col items-center justify-center transition-all hover:-translate-y-1.5 duration-300 aspect-square p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center break-keep flex flex-col items-center">
              <span className="text-purple-600 text-xs sm:text-sm font-extrabold mb-1">[중3]</span>
              인수분해
            </h2>
          </div>
        </Link>

        {/* 나중에 추가될 다른 게임들을 위한 빈 카드들 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center transition-all duration-200 aspect-square p-4 text-slate-300">
            <div className="text-2xl sm:text-3xl mb-2 opacity-50">🔒</div>
            <p className="text-xs sm:text-sm font-medium text-center">준비 중</p>
          </div>
        ))}

      </div>
    </div>
  );
}
