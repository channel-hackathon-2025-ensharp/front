export default function Header({ isAdmin = false, userName = "사용자" }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* 중앙 - 로고 및 네비게이션 */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-semibold">Scheduler</div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                근무 환경 관리
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                명단 관리
              </a>
              {isAdmin && (
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  근무 기록
                </a>
              )}
            </nav>
          </div>

          {/* 오른쪽 - 사용자 정보 */}
          <div className="text-sm text-gray-700">{userName} 님</div>
        </div>
      </div>
    </header>
  );
}
