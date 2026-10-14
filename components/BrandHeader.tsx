import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return <div className={`flex items-center gap-2 ${compact ? "" : "px-5"}`}>
    <Image src="/assets/jjeopjjeop-mark.svg" alt="쩝쩝대 마크" width={compact ? 38 : 42} height={compact ? 38 : 42} className={compact ? "h-9 w-9" : "h-10 w-10"} priority />
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-[-0.04em] text-[#1A344F]/70">우리 학교 밥친구</p>
      <p className="text-[20px] font-black leading-5 tracking-[-0.08em] text-[#1A344F]">쩝쩝대</p>
    </div>
  </div>;
}
