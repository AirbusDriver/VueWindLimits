export type AircraftWindLimitation = {
  takeoff: number,
  landing: number
}

export interface AircraftLimitations {
  maxCrosswind: AircraftWindLimitation,
  maxTailwind: AircraftWindLimitation
}

export enum ExceedenceSeverity {
  LOW,
  MED,
  HIGH
}