"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Box, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, useDisclosure } from "@chakra-ui/react"
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

  // Estado para selección de interfaces y modal
  const [pendingTarget, setPendingTarget] = useState<NetworkDevice | null>(null)
  const [selectedSourceInterface, setSelectedSourceInterface] = useState<string>("")
  const [selectedTargetInterface, setSelectedTargetInterface] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()

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
        title: "No se puede modificar la red mientras la simulación está en ejecución",
        status: "warning",
        duration: 3000,
      })
      return
    }
    setConnectingFrom(device)
  }

  // Modificado: ahora abre el modal para seleccionar interfaces
  const handleCompleteConnection = (targetDevice: NetworkDevice) => {
    if (!connectingFrom || connectingFrom.id === targetDevice.id) {
      setConnectingFrom(null)
      return
    }

    // Verifica si ya existe la conexión
    const connectionExists =
      connectingFrom.connections.some((conn) => conn.targetId === targetDevice.id) ||
      targetDevice.connections.some((conn) => conn.targetId === connectingFrom.id)

    if (connectionExists) {
      toast({
        title: "La conexión ya existe",
        status: "warning",
        duration: 3000,
      })
      setConnectingFrom(null)
      return
    }

    // Abre el modal de selección de interfaces
    setPendingTarget(targetDevice)
    setSelectedSourceInterface(connectingFrom.interfaces[0]?.name || "")
    setSelectedTargetInterface(targetDevice.interfaces[0]?.name || "")
    onOpen()
  }

  // Confirmar la conexión con las interfaces seleccionadas
  const handleConfirmConnection = () => {
    if (!connectingFrom || !pendingTarget) return

    const newConnection: Connection = {
      targetId: pendingTarget.id,
      sourceInterface: selectedSourceInterface,
      targetInterface: selectedTargetInterface,
      status: "up",
    }

    const updatedSourceDevice = {
      ...connectingFrom,
      connections: [...connectingFrom.connections, newConnection],
    }

    onUpdateDevice(updatedSourceDevice)
    setConnectingFrom(null)
    setPendingTarget(null)
    onClose()
  }

  const handleCancelConnection = () => {
    setConnectingFrom(null)
    setPendingTarget(null)
    onClose()
  }

  const handleStartDrag = (device: NetworkDevice) => {
    if (isSimulationRunning) {
      toast({
        title: "No se pueden mover dispositivos mientras la simulación está en ejecución",
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
      {/* Líneas de conexión */}
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

      {/* Línea de conexión temporal al crear una nueva conexión */}
      {connectingFrom && (
        <ConnectionLine
          sourceX={connectingFrom.x}
          sourceY={connectingFrom.y}
          targetX={mousePosition.x}
          targetY={mousePosition.y}
          status="pending"
        />
      )}

      {/* Nodos de dispositivos */}
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

      {/* Modal para seleccionar interfaces */}
      <Modal isOpen={isOpen} onClose={handleCancelConnection} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Seleccionar interfaces para la conexión</ModalHeader>
          <ModalBody>
            <Box mb={3}>
              <strong>Interfaz de origen:</strong>
              <Select
                value={selectedSourceInterface}
                onChange={e => setSelectedSourceInterface(e.target.value)}
                mt={1}
              >
                {connectingFrom?.interfaces.map((iface) => (
                  <option key={iface.name} value={iface.name}>{iface.name}</option>
                ))}
              </Select>
            </Box>
            <Box>
              <strong>Interfaz de destino:</strong>
              <Select
                value={selectedTargetInterface}
                onChange={e => setSelectedTargetInterface(e.target.value)}
                mt={1}
              >
                {pendingTarget?.interfaces.map((iface) => (
                  <option key={iface.name} value={iface.name}>{iface.name}</option>
                ))}
              </Select>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirmConnection}>
              Conectar
            </Button>
            <Button variant="ghost" onClick={handleCancelConnection}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}