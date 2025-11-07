// pages/_app.js
import '../styles/globals.css';
import { useEffect, useRef } from 'react';
import { initApprovalsOnce } from '../services/user/approvalStorage';

function MyApp({ Component, pageProps }) {
  // React 18 개발모드(StrictMode)에서 useEffect가 2번 도는 것을 방지
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    // ⬇️ 앱 구동 시 딱 한 번만 네임스페이스 초기화
    initApprovalsOnce();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
