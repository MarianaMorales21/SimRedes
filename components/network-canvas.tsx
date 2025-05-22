"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Box, useToast } from "@chakra-ui/react"
import type { NetworkDevice, Connection } from "@/types/network-types"
import { NetworkNode } from "@/components/network-node"
import { ConnectionLine } from "@/components/connection-line"

interface NetworkCanvasProps {
  devices: NetworkDevice[]
  onSelectDevice: (device: NetworkDevice) => void
  onUpdateDevice: (device: NetworkDevice) => void
  onDeleteDevice: (id: string) => void
  isSimulationRunning: boolean
}

export function NetworkCanvas({
  devices,
  onSelectDevice,
  onUpdateDevice,
  onDeleteDevice,
  isSimulationRunning,
}: NetworkCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [connectingFrom, setConnectingFrom] = useState<NetworkDevice | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [draggedDevice, setDraggedDevice] = useState<NetworkDevice | null>(null)
  const toast = useToast()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      if (isDragging && draggedDevice) {
        const updatedDevice = {
          ...draggedDevice,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
        onUpdateDevice(updatedDevice)
      }
    }
  }

  const handleStartConnection = (device: NetworkDevice) => {
    if (isSimulationRunning) {
      toast({
        title: "Cannot modify network while simulation is running",
        status: "warning",
        duration: 3000,
      })
      return
    }
    setConnectingFrom(device)
  }

  const handleCompleteConnection = (targetDevice: NetworkDevice) => {
    if (!connectingFrom || connectingFrom.id === targetDevice.id) {
      setConnectingFrom(null)
      return
    }

    // Check if connection already exists
    const connectionExists =
      connectingFrom.connections.some((conn) => conn.targetId === targetDevice.id) ||
      targetDevice.connections.some((conn) => conn.targetId === connectingFrom.id)

    if (connectionExists) {
      toast({
        title: "Connection already exists",
        status: "warning",
        duration: 3000,
      })
      setConnectingFrom(null)
      return
    }

    // Create new connection
    const newConnection: Connection = {
      targetId: targetDevice.id,
      sourceInterface: connectingFrom.interfaces[0]?.name || "",
      targetInterface: targetDevice.interfaces[0]?.name || "",
      status: "up",
    }

    const updatedSourceDevice = {
      ...connectingFrom,
      connections: [...connectingFrom.connections, newConnection],
    }

    onUpdateDevice(updatedSourceDevice)
    setConnectingFrom(null)
  }

  const handleCancelConnection = () => {
    setConnectingFrom(null)
  }

  const handleStartDrag = (device: NetworkDevice) => {
    if (isSimulationRunning) {
      toast({
        title: "Cannot move devices while simulation is running",
        status: "warning",
        duration: 3000,
      })
      return
    }
    setIsDragging(true)
    setDraggedDevice(device)
  }

  const handleStopDrag = () => {
    setIsDragging(false)
    setDraggedDevice(null)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      handleStopDrag()
    }

    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <Box
      ref={canvasRef}
      position="relative"
      w="100%"
      h="100%"
      onMouseMove={handleMouseMove}
      onClick={handleCancelConnection}
      style={{ cursor: connectingFrom ? "crosshair" : "default" }}
    >
      {/* Connection lines */}
      {devices.map((device) =>
        device.connections.map((connection, index) => {
          const targetDevice = devices.find((d) => d.id === connection.targetId)
          if (!targetDevice) return null

          return (
            <ConnectionLine
              key={`${device.id}-${connection.targetId}-${index}`}
              sourceX={device.x}
              sourceY={device.y}
              targetX={targetDevice.x}
              targetY={targetDevice.y}
              status={connection.status}
            />
          )
        }),
      )}

      {/* Temporary connection line when creating a new connection */}
      {connectingFrom && (
        <ConnectionLine
          sourceX={connectingFrom.x}
          sourceY={connectingFrom.y}
          targetX={mousePosition.x}
          targetY={mousePosition.y}
          status="pending"
        />
      )}

      {/* Device nodes */}
      {devices.map((device) => (
        <NetworkNode
          key={device.id}
          device={device}
          onSelect={() => onSelectDevice(device)}
          onStartConnection={() => handleStartConnection(device)}
          onCompleteConnection={() => handleCompleteConnection(device)}
          onStartDrag={() => handleStartDrag(device)}
          isConnecting={!!connectingFrom}
          isSimulationRunning={isSimulationRunning}
        />
      ))}
    </Box>
  )
}
