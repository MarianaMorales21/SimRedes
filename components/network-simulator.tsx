"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  useDisclosure,
  HStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react"
import { Save, Upload, Maximize, Minimize } from "lucide-react"
import { NetworkCanvas } from "@/components/network-canvas"
import { DevicePanel } from "@/components/device-panel"
import { DeviceConfigPanel } from "@/components/device-config-panel"
import type { NetworkDevice } from "@/types/network-types"

export function NetworkSimulator() {
  const [devices, setDevices] = useState<NetworkDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleAddDevice = (type: string) => {
    const newDevice: NetworkDevice = {
      id: `device-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${devices.length + 1}`,
      x: Math.random() * (canvasRef.current?.clientWidth || 600) * 0.8,
      y: Math.random() * (canvasRef.current?.clientHeight || 400) * 0.8,
      interfaces:
        type === "router"
          ? [{ name: "GigabitEthernet0/0", ip: "", subnet: "", mac: generateMac() }]
          : type === "switch"
            ? Array(8)
                .fill(null)
                .map((_, i) => ({ name: `FastEthernet0/${i}`, mac: generateMac() }))
            : type === "computer"
              ? [{ name: "Ethernet0", ip: "", subnet: "", mac: generateMac(), gateway: "" }]
              : [],
      connections: [],
      status: "off",
      configuration: {},
    }

    setDevices([...devices, newDevice])
  }

  const handleSelectDevice = (device: NetworkDevice) => {
    setSelectedDevice(device)
    onOpen()
  }

  const handleUpdateDevice = (updatedDevice: NetworkDevice) => {
    setDevices(devices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)))
    setSelectedDevice(updatedDevice)
  }

  const handleDeleteDevice = (id: string) => {
    // Remove connections to this device
    const updatedDevices = devices.map((device) => ({
      ...device,
      connections: device.connections.filter((conn) => conn.targetId !== id),
    }))

    // Remove the device itself
    setDevices(updatedDevices.filter((device) => device.id !== id))

    if (selectedDevice?.id === id) {
      setSelectedDevice(null)
      onClose()
    }
  }

  const handleToggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning)
    // In a real implementation, this would start/stop the network simulation logic
  }

  const handleSaveTopology = () => {
    const topology = JSON.stringify(devices)
    const blob = new Blob([topology], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "network-topology.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoadTopology = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loadedDevices = JSON.parse(e.target?.result as string) as NetworkDevice[]
          setDevices(loadedDevices)
        } catch (error) {
          console.error("Failed to parse topology file:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Flex direction="column" h="100vh">
      {/* Top Navigation */}
      <Flex as="nav" bg="blue.600" color="white" p={4} justifyContent="space-between" alignItems="center">
        <Heading size="md">Network Simulator</Heading>
        <HStack spacing={4}>
          <Button
            leftIcon={isSimulationRunning ? <Minimize /> : <Maximize />}
            colorScheme={isSimulationRunning ? "red" : "green"}
            onClick={handleToggleSimulation}
          >
            {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
          </Button>
          <Tooltip label="Save Topology">
            <IconButton aria-label="Save Topology" icon={<Save />} onClick={handleSaveTopology} />
          </Tooltip>
          <Tooltip label="Load Topology">
            <Box position="relative">
              <input
                type="file"
                id="topology-upload"
                accept=".json"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                onChange={handleLoadTopology}
              />
              <IconButton aria-label="Load Topology" icon={<Upload />} />
            </Box>
          </Tooltip>
        </HStack>
      </Flex>

      <Flex flex={1} overflow="hidden">
        {/* Left Sidebar - Device Panel */}
        <DevicePanel onAddDevice={handleAddDevice} />

        {/* Main Canvas */}
        <Box flex={1} ref={canvasRef} position="relative" bg="gray.100" overflow="hidden">
          <NetworkCanvas
            devices={devices}
            onSelectDevice={handleSelectDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
            isSimulationRunning={isSimulationRunning}
          />
        </Box>
      </Flex>

      {/* Device Configuration Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{selectedDevice ? `Configure ${selectedDevice.name}` : "Device Configuration"}</DrawerHeader>
          <DrawerBody>
            {selectedDevice && (
              <DeviceConfigPanel
                device={selectedDevice}
                onUpdateDevice={handleUpdateDevice}
                onDeleteDevice={handleDeleteDevice}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

// Helper function to generate a random MAC address
function generateMac() {
  return Array(6)
    .fill(0)
    .map(() =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    )
    .join(":")
}
