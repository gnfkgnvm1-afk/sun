import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
      
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        순화쌤 <span className="text-pink-500">수학교실</span>
      </h1>
      
      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        어려운 수학을 게임이나 놀이를 통해 저절로 배워지는 놀이터
      </p>

      {/* 게임으로 이동하는 버튼 */}
      <Link href="/game/inequality">
        <button className="px-8 py-3.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md shadow-pink-400/20 transition-all active:scale-95 text-lg">
          부등식 게임 시작하기
        </button>
      </Link>

      {/* 
        // 여기에 새로운 컴포넌트를 추가하세요 
        // 예시 1: <FeaturedCourses /> (추천 강의 목록)
        // 예시 2: <Features /> (주요 기능 소개)
        // 예시 3: <Testimonials /> (수강 후기)
      */}
      <div className="mt-16 w-full flex flex-col items-center">
        <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl shadow-pink-200 border border-pink-100 flex items-center justify-center bg-pink-50">
          <Image 
            src="/hero.png" 
            alt="귀여운 수학 놀이터" 
            width={1024} 
            height={1024} 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>

    </div>
  );
}
