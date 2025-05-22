"use client"

import { Box } from "@chakra-ui/react"

interface ConnectionLineProps {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  status: string
}

export function ConnectionLine({ sourceX, sourceY, targetX, targetY, status }: ConnectionLineProps) {
  // Calculate line properties
  const length = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2))
  const angle = (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI

  // Determine line style based on status
  const getLineStyle = () => {
    switch (status) {
      case "up":
        return { bg: "green.400", borderStyle: "solid" }
      case "down":
        return { bg: "red.400", borderStyle: "solid" }
      case "pending":
        return { bg: "blue.300", borderStyle: "dashed" }
      default:
        return { bg: "gray.300", borderStyle: "solid" }
    }
  }

  const lineStyle = getLineStyle()

  return (
    <Box
      position="absolute"
      top={sourceY}
      left={sourceX}
      height="2px"
      width={`${length}px`}
      bg={lineStyle.bg}
      transform={`rotate(${angle}deg)`}
      transformOrigin="0 0"
      style={{
        borderStyle: lineStyle.borderStyle,
        zIndex: 1,
      }}
    />
  )
}
