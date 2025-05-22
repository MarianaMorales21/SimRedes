"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Box, Input, VStack, Text, Flex, useColorModeValue } from "@chakra-ui/react"
import type { NetworkDevice } from "@/types/network-types"

interface ConsoleTerminalProps {
  device: NetworkDevice
  devices: NetworkDevice[]
}

interface TerminalLine {
  type: "input" | "output"
  content: string
}

export function ConsoleTerminal({ device, devices }: ConsoleTerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", content: `Network Simulator Terminal v1.0` },
    { type: "output", content: `Device: ${device.name}` },
    { type: "output", content: `Type 'help' for available commands.` },
    { type: "output", content: "" },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bgColor = useColorModeValue("black", "gray.900")
  const textColor = useColorModeValue("green.400", "green.300")

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add input to history
    const newHistory = [...history, { type: "input", content: `${device.name}> ${input}` }]

    // Process command
    const command = input.trim().toLowerCase()
    const output = processCommand(command)

    // Add output to history
    setHistory([
      ...newHistory,
      ...output.map((line) => ({ type: "output", content: line } as TerminalLine)),
    ])

    // Clear input
    setInput("")
  }

  const processCommand = (command: string): string[] => {
    const parts = command.split(" ")
    const mainCommand = parts[0]

    switch (mainCommand) {
      case "help":
        return [
          "Available commands:",
          "  help                - Show this help message",
          "  clear               - Clear the terminal",
          "  ipconfig            - Display network interfaces",
          "  ping [ip]           - Ping an IP address",
          "  traceroute [ip]     - Trace route to an IP address",
          "  netstat             - Display network connections",
          "  route               - Display routing table",
          "",
        ]

      case "clear":
        setTimeout(() => {
          setHistory([
            { type: "output", content: `Network Simulator Terminal v1.0` },
            { type: "output", content: `Device: ${device.name}` },
            { type: "output", content: "" },
          ])
        }, 10)
        return []

      case "ipconfig":
        return generateIfconfigOutput()

      case "ping":
        if (parts.length < 2) {
          return ["Usage: ping [ip]", ""]
        }
        return generatePingOutput(parts[1])

      case "traceroute":
        if (parts.length < 2) {
          return ["Usage: traceroute [ip]", ""]
        }
        return generateTracerouteOutput(parts[1])

      case "netstat":
        return generateNetstatOutput()

      case "route":
        return generateRouteOutput()

      default:
        return [`Command not found: ${mainCommand}`, 'Type "help" for available commands.', ""]
    }
  }

  const generateIfconfigOutput = (): string[] => {
    const output: string[] = []

    device.interfaces.forEach((iface) => {
      output.push(`${iface.name}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500`)
      if (iface.ip) {
        output.push(`        inet ${iface.ip}  netmask ${iface.subnet || "255.255.255.0"}`)
      }
      output.push(`        ether ${iface.mac}  txqueuelen 1000  (Ethernet)`)
      output.push("")
    })

    if (device.interfaces.length === 0) {
      output.push("No network interfaces found.")
      output.push("")
    }

    return output
  }

   // Función auxiliar para validar si dos IP están en la misma red
  function isSameNetwork(ip1: string, ip2: string, mask: string) {
    function ipToInt(ip: string) {
      return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0)
    }
    const maskInt = ipToInt(mask)
    return (ipToInt(ip1) & maskInt) === (ipToInt(ip2) & maskInt)
  }

  const generatePingOutput = (ip: string): string[] => {
    const output: string[] = []

    // Validar formato de IP
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      output.push(`Formato de IP inválido: ${ip}`)
      output.push("")
      return output
    }

    // Buscar dispositivo destino por IP
    const targetDevice = devices.find(d =>
      d.interfaces.some(iface => iface.ip === ip)
    )
    if (!targetDevice) {
      output.push(`PING ${ip} (${ip}): Host de destino inalcanzable.`)
      output.push("")
      return output
    }

    // Validar que ambos dispositivos estén encendidos
    if (device.status !== "on" || targetDevice.status !== "on") {
      output.push(`PING ${ip} (${ip}): La red está apagada.`)
      output.push("")
      return output
    }

    // Buscar interfaces con IP y máscara
    const srcIface = device.interfaces.find(iface => iface.ip && iface.subnet)
    const dstIface = targetDevice.interfaces.find(iface => iface.ip === ip && iface.subnet)
    if (!srcIface || !dstIface) {
      output.push(`PING ${ip} (${ip}): Configuración de red incompleta.`)
      output.push("")
      return output
    }

    // Validar que estén en la misma red
    if (!isSameNetwork(srcIface.ip!, dstIface.ip!, srcIface.subnet!)) {
      output.push(`PING ${ip} (${ip}): Host de destino inalcanzable.`)
      output.push("")
      return output
    }

    // Simular ping exitoso
    output.push(`PING ${ip} (${ip}) 56(84) bytes de datos.`)
    for (let i = 0; i < 4; i++) {
      const time = Math.random() * 10 + 1
      output.push(`64 bytes desde ${ip}: icmp_seq=${i + 1} ttl=64 tiempo=${time.toFixed(3)} ms`)
    }
    output.push("")
    output.push(`--- ${ip} estadísticas de ping ---`)
    output.push("4 paquetes transmitidos, 4 recibidos, 0% pérdida de paquetes, tiempo 3005ms")
    output.push("rtt min/avg/max/mdev = 1.123/5.678/9.012/3.456 ms")
    output.push("")
    return output
  }

  const generateTracerouteOutput = (ip: string): string[] => {
    const output: string[] = []

    output.push(`traceroute to ${ip} (${ip}), 30 hops max, 60 byte packets`)

    // Simulate traceroute responses
    for (let i = 1; i <= 3; i++) {
      const time1 = Math.random() * 10 + 1
      const time2 = Math.random() * 10 + 1
      const time3 = Math.random() * 10 + 1

      const hopIp = `192.168.${i}.1`
      output.push(`${i}  ${hopIp}  ${time1.toFixed(3)} ms  ${time2.toFixed(3)} ms  ${time3.toFixed(3)} ms`)
    }

    output.push("")

    return output
  }

  const generateNetstatOutput = (): string[] => {
    return [
      "Active Internet connections (w/o servers)",
      "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
      "tcp        0      0 192.168.1.100:22        192.168.1.1:59812       ESTABLISHED",
      "tcp        0      0 192.168.1.100:80        192.168.1.5:52361       ESTABLISHED",
      "",
      "Active UNIX domain sockets (w/o servers)",
      "Proto RefCnt Flags       Type       State         I-Node   Path",
      "unix  2      [ ]         DGRAM                    16425    /run/systemd/journal/syslog",
      "unix  8      [ ]         DGRAM                    16427    /run/systemd/journal/socket",
      "",
    ]
  }

  const generateRouteOutput = (): string[] => {
    return [
      "Kernel IP routing table",
      "Destination     Gateway         Genmask         Flags Metric Ref    Use Iface",
      "0.0.0.0         192.168.1.1     0.0.0.0         UG    0      0        0 eth0",
      "192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0",
      "",
    ]
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <VStack spacing={0} align="stretch" h="400px" onClick={focusInput}>
      <Box
        ref={terminalRef}
        bg={bgColor}
        color={textColor}
        p={3}
        borderRadius="md"
        fontFamily="mono"
        fontSize="sm"
        overflowY="auto"
        flex="1"
        whiteSpace="pre-wrap"
      >
        {history.map((line, index) => (
          <Text key={index} color={line.type === "input" ? "white" : textColor}>
            {line.content}
          </Text>
        ))}
      </Box>

      <form onSubmit={handleInputSubmit}>
        <Flex>
          <Text bg={bgColor} color="white" p={2} fontFamily="mono" fontSize="sm" borderBottomLeftRadius="md">
            {device.name}&gt;
          </Text>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            bg={bgColor}
            color="white"
            border="none"
            borderBottomRightRadius="md"
            fontFamily="mono"
            fontSize="sm"
            _focus={{ boxShadow: "none" }}
            autoFocus
          />
        </Flex>
      </form>
    </VStack>
  )
}
