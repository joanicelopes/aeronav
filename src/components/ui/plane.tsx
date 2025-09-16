import * as React from "react"
import { cn } from "@/lib/utils"

interface PlaneProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number
}

export function Plane({ className, size = 24, ...props }: PlaneProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-plane", className)}
      {...props}
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4.5 20 4c-.9-.5-1.5 0-2 1l-3.5 3.5L9 4.8c-1.1-.3-2.1.3-2.4 1.4L4.8 8.4c-.2.5 0 1.1.4 1.3l2.1 1.4L17.8 19.2z" />
      <path d="M6 12h5" />
      <path d="M6 16h3" />
    </svg>
  )
}
