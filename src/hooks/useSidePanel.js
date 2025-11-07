// 사이드 상세(우측 패널)와 선택된 타임슬롯/날짜를 함께 관리
import { useState, useCallback } from "react";

export default function useSidePanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState({
        date: new Date(),
        slot: null,   // { time: "12:00-13:00", status: "shortage" } 형태
        meta: null,   // 필요 시 부가 정보
    });

    const open = useCallback((payload) => {
        setSelected((prev) => ({ ...prev, ...payload }));
        setIsOpen(true);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    const setDate = useCallback((date) => {
        setSelected((prev) => ({ ...prev, date }));
    }, []);

    const setSlot = useCallback((slot) => {
        setSelected((prev) => ({ ...prev, slot }));
    }, []);

    return { isOpen, selected, open, close, setDate, setSlot };
}
