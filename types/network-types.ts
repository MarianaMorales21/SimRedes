export interface DeviceInterface {
  name: string
  mac: string
  ip?: string
  subnet?: string
  gateway?: string
}

export interface Connection {
  targetId: string
  sourceInterface: string
  targetInterface: string
  status: string
}

export interface NetworkDevice {
  id: string
  type: string
  name: string
  x: number
  y: number
  interfaces: DeviceInterface[]
  connections: Connection[]
  status: string
  configuration: Record<string, any>
}
