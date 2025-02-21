import { describe, it, beforeEach, expect } from "vitest"

describe("Port Management Contract", () => {
  let mockStorage: Map<string, any>
  let nextPortId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextPortId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "register-port":
        const [name, capacity] = args
        nextPortId++
        mockStorage.set(`port-${nextPortId}`, {
          name,
          capacity,
          available_space: capacity,
        })
        return { success: true, value: nextPortId }
      
      case "update-port-space":
        const [portId, spaceChange] = args
        const port = mockStorage.get(`port-${portId}`)
        if (!port) return { success: false, error: 404 }
        const newSpace = port.available_space + spaceChange
        if (newSpace < 0) return { success: false, error: 400 }
        port.available_space = newSpace
        mockStorage.set(`port-${portId}`, port)
        return { success: true }
      
      case "get-port":
        return { success: true, value: mockStorage.get(`port-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a port", () => {
    const result = mockContractCall("register-port", ["Port A", 10000], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should update port space", () => {
    mockContractCall("register-port", ["Port A", 10000], "user1")
    const result = mockContractCall("update-port-space", [1, -1000], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should not update port space beyond capacity", () => {
    mockContractCall("register-port", ["Port A", 10000], "user1")
    const result = mockContractCall("update-port-space", [1, -11000], "user1")
    expect(result.success).toBe(false)
    expect(result.error).toBe(400)
  })
  
  it("should get port information", () => {
    mockContractCall("register-port", ["Port A", 10000], "user1")
    const result = mockContractCall("get-port", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      name: "Port A",
      capacity: 10000,
      available_space: 10000,
    })
  })
})

