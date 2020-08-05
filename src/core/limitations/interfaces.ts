export interface AircraftWindLimitation {
  takeoff: number,
  landing: number
}

export interface AircraftLimitations {
  maxCrosswind: AircraftWindLimitation,
  maxTailwind: AircraftWindLimitation
}

export enum ExceedenceSeverity {
  LOW = "LOW",
  MED = "MED",
  HIGH = "HIGH",
}
