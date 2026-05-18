import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "북중의 수학 낙원",
  description: "어려운 수학을 게임이나 놀이를 통해 저절로 배워지는 놀이터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        {/* 상단 헤더 영역 */}
        {/* 여기에 새로운 헤더 컴포넌트나 네비게이션 바를 추가하세요 */}
        <header className="w-full bg-white border-b border-pink-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* 서비스 로고 (텍스트) - 클릭 시 홈으로 이동 */}
            <Link href="/" className="font-bold text-xl text-pink-500 hover:text-pink-600 transition-colors cursor-pointer">
              북중의 수학 낙원
            </Link>
            
            {/* 네비게이션 바 공간 (모바일에서는 숨김 처리됨) */}
            <nav className="hidden sm:flex space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-pink-500 transition-colors">강의 목록</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-pink-500 transition-colors">학습 자료</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-pink-500 transition-colors">커뮤니티</a>
            </nav>
            
            {/* 로그인/회원가입 등 유틸리티 영역 */}
            <div className="flex items-center space-x-4">
              <button className="text-sm font-medium px-4 py-2 text-slate-600 hover:text-pink-500 hover:bg-pink-50 rounded-md transition-colors">
                로그인
              </button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 (page.tsx 가 렌더링 되는 곳) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 하단 푸터 영역 */}
        {/* 여기에 자세한 사이트 정보나 링크를 추가하세요 */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} 북중의 수학 낙원. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-4 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">이용약관</a>
              <a href="#" className="hover:text-slate-900 transition-colors">개인정보처리방침</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
