import { describe, it, beforeEach, expect } from "vitest"

describe("Vessel Registration Contract", () => {
  let mockStorage: Map<string, any>
  let nextVesselId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextVesselId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "register-vessel":
        const [name, capacity] = args
        nextVesselId++
        mockStorage.set(`vessel-${nextVesselId}`, {
          owner: sender,
          name,
          capacity,
        })
        return { success: true, value: nextVesselId }
      
      case "get-vessel":
        return { success: true, value: mockStorage.get(`vessel-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a vessel", () => {
    const result = mockContractCall("register-vessel", ["Autonomous Ship 1", 1000], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get vessel information", () => {
    mockContractCall("register-vessel", ["Autonomous Ship 1", 1000], "user1")
    const result = mockContractCall("get-vessel", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      owner: "user1",
      name: "Autonomous Ship 1",
      capacity: 1000,
    })
  })
})

