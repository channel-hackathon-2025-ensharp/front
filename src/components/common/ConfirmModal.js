import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  footer,
  confirmText = "확인",
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-10 shadow-2xl z-50 w-[500px]">
          {/* 닫기 버튼 */}
          <Dialog.Close className="absolute top-6 right-6 text-gray-300 hover:text-gray-500">
            <XMarkIcon className="w-6 h-6" />
          </Dialog.Close>

          {/* 타이틀 */}
          <h2 className="text-xl font-bold text-center mb-8 whitespace-pre-line leading-relaxed">
            {title}
          </h2>

          {/* 컨텐츠 */}
          {content && (
            <div className="mb-8 space-y-4">
              {Array.isArray(content) ? (
                content.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 min-w-[80px]">{item.label}</span>
                    <span className="text-black font-medium">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-700 whitespace-pre-line">
                  {content}
                </p>
              )}
            </div>
          )}

          {/* 하단 안내 문구 */}
          {footer && (
            <p className="text-center text-gray-700 mb-6 whitespace-pre-line">
              {footer}
            </p>
          )}

          {/* 확인 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className="px-12 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
