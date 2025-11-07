import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatDateWithDay } from "../../utils/date";

export default function ChangeRequestModal({
    isOpen,
    onClose,
    date,         // Date 객체
    timeSlot,     // "12:00-13:00" 등 문자열
    jobType = "신규 상담", // "신규 상담" | "기존 상담"
    onSubmit,     // () => void
}) {
    const handleSubmit = () => {
        onSubmit?.();
        onClose?.();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                    aria-label="닫기"
                                >
                                    ✕
                                </button>

                                <Dialog.Title className="text-center text-base font-semibold text-gray-800 whitespace-pre-line">
                                    다음 근무 일정에서{"\n"}변경을 신청합니다.
                                </Dialog.Title>

                                <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4">
                                    <Row label="일시" value={`${formatDateWithDay(date)}\n${timeSlot || "-"}`} />
                                    <Row label="직무" value={jobType} />
                                </div>

                                <p className="mt-4 text-center text-sm text-gray-500">
                                    확인 시 관리자에게 알림이 발송됩니다.
                                </p>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleSubmit}
                                        className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        확인
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function Row({ label, value }) {
    return (
        <div className="grid grid-cols-[56px_1fr] gap-3">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="whitespace-pre-wrap text-sm font-medium text-gray-800">
                {value}
            </div>
        </div>
    );
}
