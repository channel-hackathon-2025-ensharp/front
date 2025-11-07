// src/hooks/useSidePanel.js
import { useState } from "react";


export default function useSidePanel() {
    const [selected, setSelected] = useState({
        date: new Date(),
        slot: null,
    });

    const setDate = (date) => setSelected((prev) => ({ ...prev, date }));
    const setSlot = (slot) => setSelected((prev) => ({ ...prev, slot }));

    return { selected, setDate, setSlot };
}
