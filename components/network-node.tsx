"use client"

import type React from "react"

import { Box, Text, Icon, Tooltip } from "@chakra-ui/react"
import { Server, Cpu, Monitor, Network, NetworkIcon as Hub } from "lucide-react"
import type { NetworkDevice } from "@/types/network-types"

interface NetworkNodeProps {
  device: NetworkDevice
  onSelect: () => void
  onStartConnection: () => void
  onCompleteConnection: () => void
  onStartDrag: () => void
  isConnecting: boolean
  isSimulationRunning: boolean
}

export function NetworkNode({
  device,
  onSelect,
  onStartConnection,
  onCompleteConnection,
  onStartDrag,
  isConnecting,
  isSimulationRunning,
}: NetworkNodeProps) {
  const getDeviceIcon = () => {
    switch (device.type) {
      case "router":
        return Server
      case "switch":
        return Network
      case "hub":
        return Hub
      case "computer":
        return Monitor
      default:
        return Cpu
    }
  }

  const getStatusColor = () => {
    if (!isSimulationRunning) return "gray.400"

    switch (device.status) {
      case "on":
        return "green.400"
      case "off":
        return "red.400"
      case "error":
        return "orange.400"
      default:
        return "gray.400"
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isConnecting) {
      onCompleteConnection()
    } else {
      onSelect()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.button === 0) {
      // Left click
      onStartDrag()
    }
  }

  const handleConnectionPoint = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartConnection()
  }

  return (
    <Box
      position="absolute"
      left={`${device.x - 30}px`}
      top={`${device.y - 30}px`}
      width="60px"
      height="60px"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{ cursor: isConnecting ? "pointer" : "move" }}
    >
      <Tooltip label={`${device.name} (${device.type})`}>
        <Box
          bg="white"
          borderRadius="md"
          boxShadow="md"
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          border="2px"
          borderColor={getStatusColor()}
          position="relative"
        >
          <Icon as={getDeviceIcon()} boxSize={6} color="blue.500" />
          <Text fontSize="xs" mt={1} noOfLines={1}>
            {device.name}
          </Text>

          {/* Connection point */}
          <Box
            position="absolute"
            right="-5px"
            top="50%"
            transform="translateY(-50%)"
            width="10px"
            height="10px"
            borderRadius="full"
            bg="blue.400"
            border="1px"
            borderColor="white"
            onClick={handleConnectionPoint}
            style={{ cursor: "pointer" }}
          />
        </Box>
      </Tooltip>
    </Box>
  )
}
