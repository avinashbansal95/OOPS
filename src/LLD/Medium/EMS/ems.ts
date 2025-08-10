{
class Helper02 {
    print(message: string): void {
        console.log(message);
    }

    println(message: string): void {
        console.log(message);
    }
}

interface Request {
    start: number;
    dest: number;
}

class Lift {
    currentFloor: number;
    direction: 'U' | 'D' | 'I'; // Up, Down, Idle
    requests: Request[];
    passengers: number;

    constructor(public id: number, public totalFloors: number) {
        this.currentFloor = 0;
        this.direction = 'I';
        this.requests = [];
        this.passengers = 0;
    }

    isIdle(): boolean {
        return this.direction === 'I' && this.requests.length === 0;
    }

    canAddRequest(start: number, dest: number): boolean {
        // Check capacity
        if (this.passengers >= 10) return false;

        // If idle, always eligible
        if (this.isIdle()) return true;

        const requestGoingUp = start < dest;
        const liftGoingUp = this.direction === 'U';

        // Check if lift has already passed the start floor
        if (liftGoingUp && requestGoingUp) {
            // Both going up - lift must not have passed start floor
            if (this.currentFloor > start) return false;
        } else if (!liftGoingUp && !requestGoingUp) {
            // Both going down - lift must not have passed start floor
            if (this.currentFloor < start) return false;
        } else {
            // Opposite directions - check if this would increase wait time for existing passengers
            const hasOppositeDirectionRequests = this.requests.some(r => {
                const reqGoingUp = r.start < r.dest;
                return reqGoingUp !== requestGoingUp;
            });

            if (hasOppositeDirectionRequests) {
                // Would increase wait time for existing passengers
                const maxFloorInCurrentDirection = liftGoingUp 
                    ? Math.max(...this.requests.filter(r => r.start < r.dest).map(r => Math.max(r.start, r.dest)))
                    : Math.min(...this.requests.filter(r => r.start > r.dest).map(r => Math.min(r.start, r.dest)));

                if (liftGoingUp && requestGoingUp && start > maxFloorInCurrentDirection) {
                    return false; // Would extend upward journey
                }
                if (!liftGoingUp && !requestGoingUp && start < maxFloorInCurrentDirection) {
                    return false; // Would extend downward journey
                }
            }
        }

        return true;
    }

    calculateTimeToReach(start: number, requestDirection: 'U' | 'D'): number {
        if (this.isIdle()) {
            return Math.abs(this.currentFloor - start);
        }

        const liftGoingUp = this.direction === 'U';
        const requestGoingUp = requestDirection === 'U';

        if (liftGoingUp === requestGoingUp) {
            // Same direction
            if (liftGoingUp && start >= this.currentFloor) {
                return start - this.currentFloor;
            } else if (!liftGoingUp && start <= this.currentFloor) {
                return this.currentFloor - start;
            }
        }

        // Different directions or need to turn around
        // Calculate max floor lift needs to reach in current direction
        let maxFloor = this.currentFloor;
        for (const req of this.requests) {
            if (liftGoingUp) {
                maxFloor = Math.max(maxFloor, req.start, req.dest);
            } else {
                maxFloor = Math.min(maxFloor, req.start, req.dest);
            }
        }

        if (liftGoingUp) {
            return (maxFloor - this.currentFloor) + (maxFloor - start);
        } else {
            return (this.currentFloor - maxFloor) + (start - maxFloor);
        }
    }

    addRequest(start: number, dest: number): void {
        this.requests.push({ start, dest });
        this.passengers++;
        this.updateDirection();
    }

    updateDirection(): void {
        if (this.requests.length === 0) {
            this.direction = 'I';
            return;
        }

        // Determine direction based on current position and requests
        const hasUpRequests = this.requests.some(r => 
            (r.start > this.currentFloor) || 
            (r.dest > this.currentFloor) ||
            (r.start < r.dest && r.start >= this.currentFloor)
        );
        
        const hasDownRequests = this.requests.some(r => 
            (r.start < this.currentFloor) || 
            (r.dest < this.currentFloor) ||
            (r.start > r.dest && r.start <= this.currentFloor)
        );

        if (this.direction === 'U' && hasUpRequests) {
            this.direction = 'U';
        } else if (this.direction === 'D' && hasDownRequests) {
            this.direction = 'D';
        } else if (hasUpRequests) {
            this.direction = 'U';
        } else if (hasDownRequests) {
            this.direction = 'D';
        } else {
            this.direction = 'I';
        }
    }

    move(): void {
        if (this.direction === 'U') {
            this.currentFloor++;
        } else if (this.direction === 'D') {
            this.currentFloor--;
        }

        // Handle passengers getting off
        const completedRequests = this.requests.filter(r => r.dest === this.currentFloor);
        this.passengers -= completedRequests.length;
        
        // Remove completed requests
        this.requests = this.requests.filter(r => r.dest !== this.currentFloor);

        // Handle passengers getting on (remove pickup requests)
        const pickupRequests = this.requests.filter(r => r.start === this.currentFloor);
        this.requests = this.requests.filter(r => r.start !== this.currentFloor);

        this.updateDirection();
    }
}

class ElevatorSystem {
    private lifts: Lift[] = [];
    private totalFloors: number = 0;

    init(floors: number, lifts: number, helper: Helper02): void {
        this.totalFloors = floors;
        this.lifts = [];

        for (let i = 0; i < lifts; i++) {
            this.lifts.push(new Lift(i, floors));
        }

        helper.println("System initialized");
    }

    requestLift(startFloor: number, destinationFloor: number): number {
        let bestLift = -1;
        let minTime = Infinity;

        const requestDirection: 'U' | 'D' = startFloor < destinationFloor ? 'U' : 'D';

        for (let i = 0; i < this.lifts.length; i++) {
            const lift = this.lifts[i];
            if (lift.canAddRequest(startFloor, destinationFloor)) {
                const time = lift.calculateTimeToReach(startFloor, requestDirection);
                if (time < minTime || (time === minTime && bestLift === -1)) {
                    minTime = time;
                    bestLift = i;
                }
            }
        }

        if (bestLift !== -1) {
            this.lifts[bestLift].addRequest(startFloor, destinationFloor);
        }

        return bestLift;
    }

    tick(): void {
        for (const lift of this.lifts) {
            lift.move();
        }
    }

    getLiftStates(): string[] {
        return this.lifts.map(lift => `${lift.currentFloor}-${lift.direction}`);
    }

    getNumberOfPeopleOnLift(liftId: number): number {
        return this.lifts[liftId]?.passengers || 0;
    }

    getLiftsStoppingOnFloor(floor: number, moveDirection: 'U' | 'D' | 'I'): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.lifts.length; i++) {
            const lift = this.lifts[i];
            const willStop = lift.requests.some(r => r.start === floor || r.dest === floor);
            if (willStop && (moveDirection === 'I' || lift.direction === moveDirection)) {
                result.push(i);
            }
        }
        return result;
    }
}

// Test the corrected implementation
const helper = new Helper02();
const system = new ElevatorSystem();
system.init(6, 2, helper);

console.log("Test 1:", system.requestLift(0, 3)); // Should return 0
system.tick();
console.log("Test 2:", system.requestLift(0, 2)); // Should return 1
system.tick();
console.log("Test 3:", system.requestLift(0, 5)); // Should return -1
console.log("Test 4:", system.requestLift(1, 0)); // Should return 1
console.log("Final states:", system.getLiftStates());
}