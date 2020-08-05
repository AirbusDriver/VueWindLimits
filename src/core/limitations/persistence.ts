import { AircraftLimitations } from "./interfaces";

const LIMITATIONS_KEY = "aircraftLimitations";

class StorageError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

class StorageValueError extends StorageError {
  constructor(msg: string, public readonly receivedObj?: Object | string) {
    super(msg);
  }
}

function parseLimitationsString(limitationsString: string): AircraftLimitations {
  const parsedJSON = JSON.parse(limitationsString);

  if (JSON.stringify(Object.keys(parsedJSON)) !== JSON.stringify(["maxCrosswind", "maxTailwind"])) {
    throw new StorageValueError("missing top level 'maxCrosswind' and 'maxTailwind' keys", limitationsString);
  }

  return parsedJSON as AircraftLimitations;
}

export function loadAircraftLimitations(): AircraftLimitations | null {
  const storageString = localStorage.getItem(LIMITATIONS_KEY);
  try {
    if (storageString == null) {
      throw new StorageError(`no data in storage for ${LIMITATIONS_KEY}`);
    }
    return parseLimitationsString(storageString);
  } catch (err) {
    if (err instanceof StorageError) {
      return null;
    }
    console.error(err);
    throw err;
  }
}

export function saveAircraftLimitations(limitations: AircraftLimitations) {
  const jsonString = JSON.stringify(limitations);
  console.debug("saving", jsonString);
  localStorage.setItem(LIMITATIONS_KEY, jsonString);
}

