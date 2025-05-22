"use client"

import { Box, VStack, Heading, Button, Tooltip, Icon, Divider, Text } from "@chakra-ui/react"
import { Server, Monitor, Network, NetworkIcon as Hub } from "lucide-react"

interface DevicePanelProps {
  onAddDevice: (type: string) => void
}

export function DevicePanel({ onAddDevice }: DevicePanelProps) {
  const devices = [
    { type: "router", icon: Server, label: "Router" },
    { type: "switch", icon: Network, label: "Switch" },
    { type: "hub", icon: Hub, label: "Hub" },
    { type: "computer", icon: Monitor, label: "Computadora" },
  ]

  return (
    <Box w="200px" bg="white" p={4} borderRight="1px" borderColor="gray.200" boxShadow="md">
      <Heading size="sm" mb={4}>
        Dispositivos
      </Heading>
      <Divider mb={4} />
      <VStack spacing={4} align="stretch">
        {devices.map((device) => (
          <Tooltip key={device.type} label={`Agregar ${device.label}`} placement="right">
            <Button
              leftIcon={<Icon as={device.icon} />}
              justifyContent="flex-start"
              variant="outline"
              onClick={() => onAddDevice(device.type)}
              colorScheme="blue"
            >
              {device.label}
            </Button>
          </Tooltip>
        ))}
      </VStack>
      <Divider my={4} />
      <Text fontSize="xs" color="gray.500" textAlign="center">
        Arrastra y suelta dispositivos sobre el lienzo para construir tu red
      </Text>
    </Box>
  )
}