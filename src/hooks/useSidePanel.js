
import { useState, useCallback } from "react";

export default function useSidePanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState({
        date: new Date(),
        slot: null,
        meta: null,
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
