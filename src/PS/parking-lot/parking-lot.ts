


interface Helper {
  print(message: string): void;
  println(message: string): void;
}

interface parkingStrategy {
    findSpots(data:SpotType[][]):Array<{row:number,col:number}>;
}

type SpotType = 2 | 4 | 0;

class ParkingSpot {
  public isOccupied: boolean = false;
  public vehicleNumber: string | null = null;
  public ticketId: string | null = null;

  constructor(public readonly type: SpotType) {}
}

class Floor {
  private spots: ParkingSpot[][];

  constructor(private rows: number, private columns: number, data: SpotType[][]) {
    this.spots = [];
    for (let i = 0; i < rows; i++) {
      const row: ParkingSpot[] = [];
      for (let j = 0; j < columns; j++) {
        row.push(new ParkingSpot(data[i][j]));
      }
      this.spots.push(row);
    }
  }

  getFreeSpots(vehicleType: 2 | 4): Array<{ row: number; column: number }> {
    const freeSpots: Array<{ row: number; column: number }> = [];
    for (let i = 0; i < this.spots.length; i++) {
      for (let j = 0; j < this.spots[i].length; j++) {
        const spot = this.spots[i][j];
        if (!spot.isOccupied && spot.type === vehicleType) {
          freeSpots.push({ row: i, column: j });
        }
      }
    }
    return freeSpots;
  }

  parkVehicle(
    vehicleType: 2 | 4,
    vehicleNumber: string,
    ticketId: string,
    spotIndex: { row: number; column: number }
  ): string {
    const spot = this.spots[spotIndex.row][spotIndex.column];
    if (!spot.isOccupied && spot.type === vehicleType) {
      spot.isOccupied = true;
      spot.vehicleNumber = vehicleNumber;
      spot.ticketId = ticketId;
      return `${spotIndex.row}-${spotIndex.row}-${spotIndex.column}`;
    }
    return "";
  }

  unparkVehicle(row: number, column: number): boolean {
    const spot = this.spots[row][column];
    if (spot && spot.isOccupied) {
      spot.isOccupied = false;
      spot.vehicleNumber = null;
      spot.ticketId = null;
      return true;
    }
    return false;
  }

  searchVehicle(query: string): string | null {
    for (let i = 0; i < this.spots.length; i++) {
      for (let j = 0; j < this.spots[i].length; j++) {
        const spot = this.spots[i][j];
        if (spot.isOccupied && (spot.vehicleNumber === query || spot.ticketId === query)) {
          return `${i}-${i}-${j}`;
        }
      }
    }
    return null;
  }

  countFreeSpots(vehicleType: 2 | 4): number {
    let count = 0;
    for (let i = 0; i < this.spots.length; i++) {
      for (let j = 0; j < this.spots[i].length; j++) {
        const spot = this.spots[i][j];
        if (!spot.isOccupied && spot.type === vehicleType) {
          count++;
        }
      }
    }
    return count;
  }
}

class ParkingLot {
  private floors: Floor[];

  constructor(private helper: Helper, parking: SpotType[][][]) {
    this.floors = [];
    for (let i = 0; i < parking.length; i++) {
      const floorData = parking[i];
      const rows = floorData.length;
      const columns = floorData[0].length;
      this.floors.push(new Floor(rows, columns, floorData));
    }
  }

  park(
    vehicleType: 2 | 4,
    vehicleNumber: string,
    ticketId: string,
    parkingStrategy: 0 | 1
  ): string {
    let spotId = "";
    if (parkingStrategy === 0) {
      // Strategy 0: lowest index
      for (let i = 0; i < this.floors.length; i++) {
        const freeSpots = this.floors[i].getFreeSpots(vehicleType);
        if (freeSpots.length > 0) {
          const { row, column } = freeSpots[0];
          spotId = `${i}-${row}-${column}`;
          this.floors[i].parkVehicle(vehicleType, vehicleNumber, ticketId, { row, column });
          break;
        }
      }
    } else if (parkingStrategy === 1) {
      // Strategy 1: floor with most free spots
      let maxFreeSpots = -1;
      let bestFloorIndex = -1;

      for (let i = 0; i < this.floors.length; i++) {
        const freeCount = this.floors[i].countFreeSpots(vehicleType);
        if (freeCount > maxFreeSpots) {
          maxFreeSpots = freeCount;
          bestFloorIndex = i;
        }
      }

      if (bestFloorIndex !== -1) {
        const freeSpots = this.floors[bestFloorIndex].getFreeSpots(vehicleType);
        if (freeSpots.length > 0) {
          const { row, column } = freeSpots[0];
          spotId = `${bestFloorIndex}-${row}-${column}`;
          this.floors[bestFloorIndex].parkVehicle(vehicleType, vehicleNumber, ticketId, { row, column });
        }
      }
    }

    this.helper.println(`Parked at: ${spotId}`);
    return spotId;
  }

  removeVehicle(spotId: string): boolean {
    const [floorStr, rowStr, colStr] = spotId.split("-").map(Number);
    if (floorStr >= this.floors.length) return false;
    return this.floors[floorStr].unparkVehicle(rowStr, colStr);
  }

  searchVehicle(query: string): string {
    for (let i = 0; i < this.floors.length; i++) {
      const result = this.floors[i].searchVehicle(query);
      if (result) return result;
    }
    return "";
  }

  getFreeSpotsCount(floorIndex: number, vehicleType: 2 | 4): number {
    if (floorIndex >= this.floors.length) return 0;
    return this.floors[floorIndex].countFreeSpots(vehicleType);
  }
}

class Solution {
  private parkingLot!: ParkingLot;

  init(helper: Helper, parking: SpotType[][][]): void {
    this.parkingLot = new ParkingLot(helper, parking);
  }

  park(vehicleType: 2 | 4, vehicleNumber: string, ticketId: string, parkingStrategy: 0 | 1): string {
    return this.parkingLot.park(vehicleType, vehicleNumber, ticketId, parkingStrategy);
  }

  removeVehicle(spotId: string): boolean {
    return this.parkingLot.removeVehicle(spotId);
  }

  searchVehicle(query: string): string {
    return this.parkingLot.searchVehicle(query);
  }

  getFreeSpotsCount(floor: number, vehicleType: 2 | 4): number {
    return this.parkingLot.getFreeSpotsCount(floor, vehicleType);
  }
}


const helper: Helper = {
  print: (msg: string) => process.stdout.write(msg),
  println: (msg: string) => console.log(msg),
};

// Example parking structure
const parking: SpotType[][][] = [
  [
    [4, 2, 0],
    [2, 4, 2],
  ],
  [
    [4, 4, 4],
    [0, 2, 2],
  ],
];

const solution = new Solution();
solution.init(helper, parking);

const spot1 = solution.park(4, "MH12AB1234", "T123", 0); // Strategy 0
console.log("Assigned Spot:", spot1);

const spot2 = solution.park(4, "DL12XY5678", "T456", 1); // Strategy 1
console.log("Assigned Spot:", spot2);

console.log("Search Vehicle:", solution.searchVehicle("MH12AB1234"));

console.log("Free 4-wheeler spots on floor 0:", solution.getFreeSpotsCount(0, 4));

const removed = solution.removeVehicle("0-0-0");
console.log("Vehicle removed:", removed);