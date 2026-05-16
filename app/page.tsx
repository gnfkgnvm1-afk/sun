export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
      
      {/* Hero Section */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        나만의 <span className="text-blue-600">교육용 웹앱</span> 만들기
      </h1>
      
      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        여기는 Vercel에 즉시 배포할 수 있는 가장 단순하고 깔끔한 웹앱의 기본 뼈대입니다. 
        복잡한 로직 없이 바로 시작하여 필요한 기능을 하나씩 덧붙여보세요.
      </p>

      {/* 가짜(Placeholder) 버튼 */}
      {/* 클릭 시 작동할 로직(예: 라우팅, 모달 띄우기)을 나중에 이 곳에 추가하세요. */}
      <button className="px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-lg">
        학습 시작하기
      </button>

      {/* 
        // 여기에 새로운 컴포넌트를 추가하세요 
        // 예시 1: <FeaturedCourses /> (추천 강의 목록)
        // 예시 2: <Features /> (주요 기능 소개)
        // 예시 3: <Testimonials /> (수강 후기)
      */}
      <div className="mt-32 w-full border-t border-slate-200 pt-16 flex flex-col items-center">
        <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <p>여기에 대시보드 미리보기나 소개 영상, 혹은 추가 콘텐츠가 들어갈 수 있습니다.</p>
        </div>
      </div>

    </div>
  );
}
