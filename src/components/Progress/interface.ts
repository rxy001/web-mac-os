import type { SpringConfig } from "@react-spring/web"

export interface ProgressProps {
  percent?: number
  strokeColor?: string
  trailColor?: string
  strokeWidth?: number
  duration?: number
  strokeHeight?: number
  springConfig?: SpringConfig
}
