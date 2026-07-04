import { cn } from "@/lib/utils";

type UserAvatarImageProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

/** Renders user-provided avatar URLs (any host) without next/image hostname restrictions. */
export function UserAvatarImage({
  src,
  alt,
  size = 32,
  className,
}: UserAvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover", className)}
    />
  );
}
