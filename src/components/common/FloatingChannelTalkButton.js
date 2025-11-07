import Image from "next/image";
import channeltalkLogo from "../../assets/logo/channeltalk.png";

export default function FloatingChannelTalkButton({ onClick }) {
  return (
    <button
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full overflow-hidden shadow-2xl bg-white flex items-center justify-center hover:scale-105 transition-transform z-50"
      aria-label="채널톡 열기"
      onClick={onClick}
    >
      <Image
        src={channeltalkLogo}
        alt="채널톡 로고"
        fill
        className="object-cover w-full h-full"
        priority
      />
    </button>
  );
}
