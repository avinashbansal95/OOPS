// ===============================================
// 2. ABSTRACTION
// ===============================================
// Definition: Hiding complex implementation details and showing only essential features
// of an object. Focus on WHAT an object does, not HOW it does it.

// Abstract class - cannot be instantiated directly
abstract class Vehicle {
    protected brand: string;
    protected model: string;
    
    constructor(brand: string, model: string) {
        this.brand = brand;
        this.model = model;
    }
    
    // Abstract method - must be implemented by subclasses
    abstract start(): void;
    abstract stop(): void;
    abstract getMaxSpeed(): number;
    
    // Concrete method - shared implementation
    public getInfo(): string {
        return `${this.brand} ${this.model}`;
    }
    
    // Protected method - accessible by subclasses
    protected displayStatus(status: string): void {
        console.log(`${this.getInfo()} - ${status}`);
    }
}

// Interface for additional abstraction
interface Flyable {
    fly(): void;
    land(): void;
    getAltitude(): number;
}

// Concrete implementation
class Car extends Vehicle {
    private isEngineRunning: boolean = false;
    
    start(): void {
        this.isEngineRunning = true;
        this.displayStatus("Engine started");
    }
    
    stop(): void {
        this.isEngineRunning = false;
        this.displayStatus("Engine stopped");
    }
    
    getMaxSpeed(): number {
        return 200; // km/h
    }
}

class Airplane extends Vehicle implements Flyable {
    private isEngineRunning: boolean = false;
    private altitude: number = 0;
    
    start(): void {
        this.isEngineRunning = true;
        this.displayStatus("Engines started");
    }
    
    stop(): void {
        this.isEngineRunning = false;
        this.displayStatus("Engines stopped");
    }
    
    getMaxSpeed(): number {
        return 900; // km/h
    }
    
    fly(): void {
        this.altitude = 10000;
        this.displayStatus("Flying at altitude");
    }
    
    land(): void {
        this.altitude = 0;
        this.displayStatus("Landed");
    }
    
    getAltitude(): number {
        return this.altitude;
    }
}

// Usage example
const car = new Car("Toyota", "Camry");
const plane = new Airplane("Boeing", "737");

car.start();
console.log(`Car max speed: ${car.getMaxSpeed()} km/h`);

plane.start();
plane.fly();
console.log(`Plane altitude: ${plane.getAltitude()} feet`);