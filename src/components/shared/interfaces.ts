export type AircraftWindLimitation = {
  takeoff: number,
  landing: number
}

export interface AircraftLimitations {
  maxCrosswind: AircraftWindLimitation,
  maxTailwind: AircraftWindLimitation
}
