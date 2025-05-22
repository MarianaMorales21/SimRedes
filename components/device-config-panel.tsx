"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  Text,
  Box,
  Heading,
  Divider,
  HStack,
  IconButton,
  useToast,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import { Trash2, Plus } from "lucide-react"
import type { NetworkDevice, DeviceInterface } from "@/types/network-types"
import { ConsoleTerminal } from "@/components/console-terminal"

interface DeviceConfigPanelProps {
  device: NetworkDevice
  onUpdateDevice: (device: NetworkDevice) => void
  onDeleteDevice: (id: string) => void
  allDevices: NetworkDevice[]
}

export function DeviceConfigPanel({ device, onUpdateDevice, onDeleteDevice, allDevices }: DeviceConfigPanelProps) {
  const [localDevice, setLocalDevice] = useState<NetworkDevice>(device)
  const toast = useToast()

  useEffect(() => {
    setLocalDevice(device)
  }, [device])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDevice({
      ...localDevice,
      name: e.target.value,
    })
  }

  const handleStatusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDevice({
      ...localDevice,
      status: e.target.checked ? "on" : "off",
    })
  }

  const handleInterfaceChange = (index: number, field: keyof DeviceInterface, value: string) => {
    const updatedInterfaces = [...localDevice.interfaces]
    updatedInterfaces[index] = {
      ...updatedInterfaces[index],
      [field]: value,
    }

    setLocalDevice({
      ...localDevice,
      interfaces: updatedInterfaces,
    })
  }

  const handleAddInterface = () => {
    const interfaceCount = localDevice.interfaces.length
    const newInterface: DeviceInterface = {
      name: `Interface${interfaceCount}`,
      mac: generateMac(),
      ip: "",
      subnet: "",
    }

    setLocalDevice({
      ...localDevice,
      interfaces: [...localDevice.interfaces, newInterface],
    })
  }

  const handleDeleteInterface = (index: number) => {
    // Check if this interface is used in any connection
    const isUsedInConnection = localDevice.connections.some(
      (conn) => conn.sourceInterface === localDevice.interfaces[index].name,
    )

    if (isUsedInConnection) {
      toast({
        title: "Cannot delete interface",
        description: "This interface is used in a connection. Remove the connection first.",
        status: "error",
        duration: 3000,
      })
      return
    }

    const updatedInterfaces = [...localDevice.interfaces]
    updatedInterfaces.splice(index, 1)

    setLocalDevice({
      ...localDevice,
      interfaces: updatedInterfaces,
    })
  }

  const handleSaveChanges = () => {
    onUpdateDevice(localDevice)
    toast({
      title: "Configuration saved",
      status: "success",
      duration: 2000,
    })
  }

  const handleDelete = () => {
    onDeleteDevice(localDevice.id)
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Heading size="md">{localDevice.type.charAt(0).toUpperCase() + localDevice.type.slice(1)}</Heading>
        <Text color="gray.500">ID: {localDevice.id}</Text>
      </Box>

      <Divider />

      <FormControl>
        <FormLabel>Device Name</FormLabel>
        <Input value={localDevice.name} onChange={handleNameChange} />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Power Status:{" "}
          <Badge colorScheme={localDevice.status === "on" ? "green" : "red"}>
            {localDevice.status === "on" ? "ON" : "OFF"}
          </Badge>
        </FormLabel>
        <Switch isChecked={localDevice.status === "on"} onChange={handleStatusToggle} colorScheme="green" />
      </FormControl>

      <Divider />

      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab>Interfaces</Tab>
          <Tab>Connections</Tab>
          {localDevice.type === "computer" && <Tab>Console</Tab>}
          {localDevice.type === "router" && <Tab>Routing</Tab>}
        </TabList>

        <TabPanels>
          {/* Interfaces Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <HStack justifyContent="space-between">
                <Heading size="sm">Network Interfaces</Heading>
                <Button leftIcon={<Plus size={16} />} size="sm" onClick={handleAddInterface} colorScheme="blue">
                  Add Interface
                </Button>
              </HStack>

              <Accordion allowMultiple>
               {localDevice.interfaces.map((iface, index) => (
  <AccordionItem key={index}>
    <h2>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          {iface.name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <VStack spacing={3} align="stretch">
        <FormControl>
          <FormLabel fontSize="sm">Interface Name</FormLabel>
          <Input
            size="sm"
            value={iface.name}
            onChange={(e) =>
              handleInterfaceChange(
                index,
                "name",
                e.target.value
              )
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">MAC Address</FormLabel>
          <Input
            size="sm"
            value={iface.mac}
            onChange={(e) =>
              handleInterfaceChange(
                index,
                "mac",
                e.target.value
              )
            }
          />
        </FormControl>

        {/* Solo pedir IP/máscara en routers, computadoras, o si es VLAN en switch */}
        {(localDevice.type === "router" ||
          localDevice.type === "computer" ||
          (localDevice.type === "switch" && iface.name.toLowerCase().includes("vlan"))
        ) && (
          <>
            <FormControl>
              <FormLabel fontSize="sm">IP Address</FormLabel>
              <Input
                size="sm"
                value={iface.ip || ""}
                onChange={(e) =>
                  handleInterfaceChange(
                    index,
                    "ip",
                    e.target.value
                  )
                }
                placeholder="192.168.1.1"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Subnet Mask</FormLabel>
              <Input
                size="sm"
                value={iface.subnet || ""}
                onChange={(e) =>
                  handleInterfaceChange(
                    index,
                    "subnet",
                    e.target.value
                  )
                }
                placeholder="255.255.255.0"
              />
            </FormControl>
          </>
        )}

        {localDevice.type === "computer" && (
          <FormControl>
            <FormLabel fontSize="sm">Default Gateway</FormLabel>
            <Input
              size="sm"
              value={iface.gateway || ""}
              onChange={(e) =>
                handleInterfaceChange(
                  index,
                  "gateway",
                  e.target.value
                )
              }
              placeholder="192.168.1.254"
            />
          </FormControl>
        )}

        <Button
          leftIcon={<Trash2 size={16} />}
          colorScheme="red"
          variant="outline"
          size="sm"
          onClick={() => handleDeleteInterface(index)}
        >
          Delete Interface
        </Button>
      </VStack>
    </AccordionPanel>
  </AccordionItem>
))}
              </Accordion>

              {localDevice.interfaces.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  No interfaces configured
                </Text>
              )}
            </VStack>
          </TabPanel>

          {/* Connections Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Heading size="sm">Active Connections</Heading>

              {localDevice.connections.length > 0 ? (
                localDevice.connections.map((connection, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={connection.status === "up" ? "green.200" : "red.200"}
                  >
                    <HStack justifyContent="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">
                          {connection.sourceInterface} → {connection.targetId}
                        </Text>
                        <Badge colorScheme={connection.status === "up" ? "green" : "red"}>
                          {connection.status.toUpperCase()}
                        </Badge>
                      </VStack>
                      <IconButton
                        aria-label="Delete connection"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          const updatedConnections = [...localDevice.connections]
                          updatedConnections.splice(index, 1)
                          setLocalDevice({
                            ...localDevice,
                            connections: updatedConnections,
                          })
                        }}
                      />
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text color="gray.500" textAlign="center">
                  No active connections
                </Text>
              )}
            </VStack>
          </TabPanel>

          {/* Console Tab (for computers) */}
          {localDevice.type === "computer" && (
            <TabPanel>
<ConsoleTerminal device={localDevice} devices={allDevices} />
            </TabPanel>
          )}

          {/* Routing Tab (for routers) */}
          {localDevice.type === "router" && (
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">Routing Table</Heading>

                <Box borderWidth="1px" borderRadius="md" p={3}>
                  <Text fontFamily="mono" fontSize="sm" whiteSpace="pre">
                    Destination Gateway Flags Interface
                    {"\n"}
                    0.0.0.0/0 192.168.1.1 UG GigabitEthernet0/0
                    {"\n"}
                    192.168.1.0/24 0.0.0.0 U GigabitEthernet0/0
                  </Text>
                </Box>

                <Button leftIcon={<Plus size={16} />} colorScheme="blue" size="sm">
                  Add Route
                </Button>
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      <Divider />

      <HStack spacing={4} justifyContent="space-between">
        <Button colorScheme="red" leftIcon={<Trash2 />} onClick={handleDelete}>
          Delete Device
        </Button>

        <Button colorScheme="blue" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </HStack>
    </VStack>
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
