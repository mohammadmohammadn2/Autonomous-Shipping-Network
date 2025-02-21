import { describe, it, beforeEach, expect } from "vitest"

describe("Cargo Contract", () => {
  let mockStorage: Map<string, any>
  let nextCargoId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextCargoId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "register-cargo":
        const [description, weight, destination] = args
        nextCargoId++
        mockStorage.set(`cargo-${nextCargoId}`, {
          owner: sender,
          description,
          weight,
          destination,
        })
        return { success: true, value: nextCargoId }
      
      case "get-cargo":
        return { success: true, value: mockStorage.get(`cargo-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register cargo", () => {
    const result = mockContractCall("register-cargo", ["Electronics", 1000, "New York"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get cargo information", () => {
    mockContractCall("register-cargo", ["Electronics", 1000, "New York"], "user1")
    const result = mockContractCall("get-cargo", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      owner: "user1",
      description: "Electronics",
      weight: 1000,
      destination: "New York",
    })
  })
})

