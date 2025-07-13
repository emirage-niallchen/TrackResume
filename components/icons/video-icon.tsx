import Image from "next/image";

interface VideoIconProps {
  className?: string;
  size?: number | string;
}

export function VideoIcon({ className, size = 48 }: VideoIconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Image 
        src="/video.png"
        alt="视频文件"
        width={500}
        height={500}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        priority
        quality={100}
      />
    </div>
  );
} 