// pages/accept.js
import Link from "next/link";
import { useRouter } from "next/router";

function formatKoreanDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso; // 잘못된 값은 원문 노출
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dow = days[d.getDay()];
    return `${y}년 ${m}월 ${day}일(${dow})`;
}

export default function AcceptPage() {
    const router = useRouter();
    // 예: /accept?dates=2025-11-08,2025-11-12
    const datesParam = (router.query.dates || "").toString().trim();
    const dates = datesParam
        ? datesParam.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const pretty = dates.length
        ? dates.map(formatKoreanDate).join(", ")
        : "미지정";

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-3xl bg-white shadow-sm border border-gray-100 p-8 text-center">
                {/* 아이콘 느낌 */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                    <svg
                        className="h-7 w-7 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    대타 요청이 <span className="text-green-600">승인</span>되었어요
                </h1>
                <p className="text-gray-600">
                    대신 근무하실 날짜는 <span className="font-medium text-gray-900">{pretty}</span>입니다.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        홈으로
                    </Link>
                    <Link
                        href="/user"
                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        스케줄 확인하기
                    </Link>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                    (URL 예: /accept?dates=2025-11-08,2025-11-12)
                </p>
            </div>
        </main>
    );
}
