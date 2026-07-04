import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "main";
}

export function Container({
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return <Component className={cn("site-container", className)} {...props} />;
}
