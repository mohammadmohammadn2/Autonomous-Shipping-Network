import { describe, it, beforeEach, expect } from "vitest"

describe("Route Optimization Contract", () => {
  let mockStorage: Map<string, any>
  let nextRouteId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextRouteId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "create-route":
        const [vesselId, start, end, distance] = args
        nextRouteId++
        mockStorage.set(`route-${nextRouteId}`, {
          vessel_id: vesselId,
          start,
          end,
          distance,
        })
        return { success: true, value: nextRouteId }
      
      case "get-route":
        return { success: true, value: mockStorage.get(`route-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a route", () => {
    const result = mockContractCall("create-route", [1, "Port A", "Port B", 1000], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get route information", () => {
    mockContractCall("create-route", [1, "Port A", "Port B", 1000], "user1")
    const result = mockContractCall("get-route", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      vessel_id: 1,
      start: "Port A",
      end: "Port B",
      distance: 1000,
    })
  })
})

