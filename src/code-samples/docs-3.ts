// ===============================================
// COMPOSITION vs INHERITANCE - REAL WORLD EXAMPLES
// ===============================================

// ===============================================
// 1. INHERITANCE - "IS-A" RELATIONSHIP
// ===============================================

// SCENARIO 1: Vehicle Management System (Good use of inheritance)
{
abstract class Vehicle {
    protected brand: string;
    protected model: string;
    protected year: number;
    protected engineRunning: boolean = false;
    
    constructor(brand: string, model: string, year: number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    
    // Common behavior shared by all vehicles
    public startEngine(): void {
        this.engineRunning = true;
        console.log(`${this.brand} ${this.model} engine started`);
    }
    
    public stopEngine(): void {
        this.engineRunning = false;
        console.log(`${this.brand} ${this.model} engine stopped`);
    }
    
    public getInfo(): string {
        return `${this.year} ${this.brand} ${this.model}`;
    }
    
    // Abstract methods - each vehicle type implements differently
    abstract getMaxSpeed(): number;
    abstract getFuelType(): string;
    abstract getVehicleType(): string;
}

// Car IS-A Vehicle
class Car extends Vehicle {
    private doors: number;
    private transmission: string;
    
    constructor(brand: string, model: string, year: number, doors: number, transmission: string) {
        super(brand, model, year);
        this.doors = doors;
        this.transmission = transmission;
    }
    
    getMaxSpeed(): number {
        return 200; // km/h
    }
    
    getFuelType(): string {
        return "Gasoline";
    }
    
    getVehicleType(): string {
        return "Car";
    }
    
    // Car-specific behavior
    public honk(): void {
        console.log(`${this.brand} ${this.model} honks: Beep beep!`);
    }
    
    public getCarDetails(): string {
        return `${this.getInfo()} - ${this.doors} doors, ${this.transmission} transmission`;
    }
}

// Motorcycle IS-A Vehicle
class Motorcycle extends Vehicle {
    private engineSize: number;
    
    constructor(brand: string, model: string, year: number, engineSize: number) {
        super(brand, model, year);
        this.engineSize = engineSize;
    }
    
    getMaxSpeed(): number {
        return 180; // km/h
    }
    
    getFuelType(): string {
        return "Gasoline";
    }
    
    getVehicleType(): string {
        return "Motorcycle";
    }
    
    // Motorcycle-specific behavior
    public wheelie(): void {
        console.log(`${this.brand} ${this.model} does a wheelie!`);
    }
}

// Truck IS-A Vehicle
class Truck extends Vehicle {
    private cargoCapacity: number;
    
    constructor(brand: string, model: string, year: number, cargoCapacity: number) {
        super(brand, model, year);
        this.cargoCapacity = cargoCapacity;
    }
    
    getMaxSpeed(): number {
        return 120; // km/h
    }
    
    getFuelType(): string {
        return "Diesel";
    }
    
    getVehicleType(): string {
        return "Truck";
    }
    
    // Truck-specific behavior
    public loadCargo(weight: number): void {
        if (weight <= this.cargoCapacity) {
            console.log(`Loaded ${weight}kg cargo into ${this.brand} ${this.model}`);
        } else {
            console.log(`Cannot load ${weight}kg - exceeds capacity of ${this.cargoCapacity}kg`);
        }
    }
}

// ===============================================
// 2. COMPOSITION - "HAS-A" RELATIONSHIP
// ===============================================

// SCENARIO 2: Computer System (Better with composition)

// Individual components
class CPU {
    constructor(
        private brand: string,
        private model: string,
        private cores: number,
        private clockSpeed: number
    ) {}
    
    public process(): void {
        console.log(`${this.brand} ${this.model} processing with ${this.cores} cores at ${this.clockSpeed}GHz`);
    }
    
    public getInfo(): string {
        return `${this.brand} ${this.model} - ${this.cores} cores, ${this.clockSpeed}GHz`;
    }
    
    public getCores(): number {
        return this.cores;
    }
}

class RAM {
    constructor(
        private capacity: number,
        private type: string,
        private speed: number
    ) {}
    
    public allocateMemory(amount: number): boolean {
        if (amount <= this.capacity) {
            console.log(`Allocated ${amount}GB of ${this.type} RAM`);
            return true;
        }
        console.log(`Cannot allocate ${amount}GB - only ${this.capacity}GB available`);
        return false;
    }
    
    public getInfo(): string {
        return `${this.capacity}GB ${this.type} RAM at ${this.speed}MHz`;
    }
}

class Storage {
    constructor(
        private capacity: number,
        private type: string,
        private readSpeed: number,
        private writeSpeed: number
    ) {}
    
    public read(file: string): void {
        console.log(`Reading ${file} from ${this.type} at ${this.readSpeed}MB/s`);
    }
    
    public write(file: string, size: number): void {
        console.log(`Writing ${file} (${size}MB) to ${this.type} at ${this.writeSpeed}MB/s`);
    }
    
    public getInfo(): string {
        return `${this.capacity}GB ${this.type} - Read: ${this.readSpeed}MB/s, Write: ${this.writeSpeed}MB/s`;
    }
}

class GraphicsCard {
    constructor(
        private brand: string,
        private model: string,
        private memory: number
    ) {}
    
    public render(): void {
        console.log(`${this.brand} ${this.model} rendering with ${this.memory}GB VRAM`);
    }
    
    public getInfo(): string {
        return `${this.brand} ${this.model} - ${this.memory}GB VRAM`;
    }
}

// Computer HAS-A CPU, RAM, Storage, etc. (Composition)
class Computer {
    private cpu: CPU;
    private ram: RAM;
    private storage: Storage;
    private graphics?: GraphicsCard; // Optional component
    private isRunning: boolean = false;
    
    constructor(
        cpu: CPU,
        ram: RAM,
        storage: Storage,
        graphics?: GraphicsCard
    ) {
        this.cpu = cpu;
        this.ram = ram;
        this.storage = storage;
        this.graphics = graphics;
    }
    
    public boot(): void {
        console.log("=== Computer Booting ===");
        this.cpu.process();
        this.ram.allocateMemory(4); // Boot requires 4GB
        this.storage.read("operating_system.img");
        if (this.graphics) {
            this.graphics.render();
        }
        this.isRunning = true;
        console.log("Computer booted successfully!");
    }
    
    public shutdown(): void {
        console.log("=== Computer Shutting Down ===");
        this.isRunning = false;
        console.log("Computer shut down");
    }
    
    public runApplication(appName: string, memoryRequired: number): void {
        if (!this.isRunning) {
            console.log("Computer is not running. Please boot first.");
            return;
        }
        
        console.log(`\n=== Running ${appName} ===`);
        if (this.ram.allocateMemory(memoryRequired)) {
            this.cpu.process();
            this.storage.read(`${appName}.exe`);
            if (this.graphics && appName.includes("Game")) {
                this.graphics.render();
            }
        }
    }
    
    public getSpecs(): string {
        const specs = [
            "=== Computer Specifications ===",
            `CPU: ${this.cpu.getInfo()}`,
            `RAM: ${this.ram.getInfo()}`,
            `Storage: ${this.storage.getInfo()}`,
        ];
        
        if (this.graphics) {
            specs.push(`Graphics: ${this.graphics.getInfo()}`);
        }
        
        return specs.join("\n");
    }
    
    // Easy to upgrade components
    public upgradeRAM(newRAM: RAM): void {
        this.ram = newRAM;
        console.log(`RAM upgraded to: ${newRAM.getInfo()}`);
    }
    
    public addGraphicsCard(graphics: GraphicsCard): void {
        this.graphics = graphics;
        console.log(`Graphics card added: ${graphics.getInfo()}`);
    }
}

// ===============================================
// 3. PROBLEM WITH INHERITANCE - RIGID HIERARCHY
// ===============================================

// SCENARIO 3: Animal Kingdom (Inheritance becomes problematic)

// Traditional inheritance approach - becomes rigid
abstract class Animal {
    constructor(protected name: string, protected species: string) {}
    
    abstract makeSound(): string;
    abstract move(): string;
    
    public eat(): void {
        console.log(`${this.name} is eating`);
    }
}

class Bird extends Animal {
    makeSound(): string {
        return "Tweet";
    }
    
    move(): string {
        return "Flying";
    }
    
    public fly(): void {
        console.log(`${this.name} is flying`);
    }
}

class Fish extends Animal {
    makeSound(): string {
        return "Blub";
    }
    
    move(): string {
        return "Swimming";
    }
    
    public swim(): void {
        console.log(`${this.name} is swimming`);
    }
}

// PROBLEM: What about a Penguin? It's a bird but can't fly!
// What about a FlyingFish? It's a fish but can fly!

// ===============================================
// 4. COMPOSITION SOLUTION - FLEXIBLE BEHAVIORS
// ===============================================

// SCENARIO 4: Animal Behaviors (Composition approach)

// Define behaviors as separate components
interface Flyable {
    fly(): void;
}

interface Swimmable {
    swim(): void;
}

interface Walkable {
    walk(): void;
}

class FlyingBehavior implements Flyable {
    fly(): void {
        console.log("Flying through the air");
    }
}

class SwimmingBehavior implements Swimmable {
    swim(): void {
        console.log("Swimming through water");
    }
}

class WalkingBehavior implements Walkable {
    walk(): void {
        console.log("Walking on land");
    }
}

class NoFlyBehavior implements Flyable {
    fly(): void {
        console.log("Cannot fly");
    }
}

// Animal using composition
class FlexibleAnimal {
    private flyBehavior?: Flyable;
    private swimBehavior?: Swimmable;
    private walkBehavior?: Walkable;
    
    constructor(
        private name: string,
        private species: string
    ) {}
    
    // Compose behaviors
    public setFlyBehavior(flyBehavior: Flyable): void {
        this.flyBehavior = flyBehavior;
    }
    
    public setSwimBehavior(swimBehavior: Swimmable): void {
        this.swimBehavior = swimBehavior;
    }
    
    public setWalkBehavior(walkBehavior: Walkable): void {
        this.walkBehavior = walkBehavior;
    }
    
    // Use composed behaviors
    public performFly(): void {
        if (this.flyBehavior) {
            console.log(`${this.name} the ${this.species}: `);
            this.flyBehavior.fly();
        }
    }
    
    public performSwim(): void {
        if (this.swimBehavior) {
            console.log(`${this.name} the ${this.species}: `);
            this.swimBehavior.swim();
        }
    }
    
    public performWalk(): void {
        if (this.walkBehavior) {
            console.log(`${this.name} the ${this.species}: `);
            this.walkBehavior.walk();
        }
    }
}

// ===============================================
// 5. REAL-WORLD EXAMPLE - GAME CHARACTER SYSTEM
// ===============================================

// SCENARIO 5: Game Character System (Composition approach)

// Different abilities as components
interface Attackable {
    attack(target: string): void;
    getAttackPower(): number;
}

interface Defendable {
    defend(): void;
    getDefense(): number;
}

interface Magical {
    castSpell(spell: string): void;
    getMana(): number;
}

interface Stealthy {
    stealth(): void;
    sneak(): void;
}

// Concrete implementations
class SwordAttack implements Attackable {
    attack(target: string): void {
        console.log(`Sword attack on ${target} for ${this.getAttackPower()} damage`);
    }
    
    getAttackPower(): number {
        return 25;
    }
}

class MagicAttack implements Attackable {
    attack(target: string): void {
        console.log(`Magic missile on ${target} for ${this.getAttackPower()} damage`);
    }
    
    getAttackPower(): number {
        return 30;
    }
}

class ShieldDefense implements Defendable {
    defend(): void {
        console.log(`Blocking with shield, defense: ${this.getDefense()}`);
    }
    
    getDefense(): number {
        return 15;
    }
}

class FireMagic implements Magical {
    castSpell(spell: string): void {
        console.log(`Casting ${spell} spell with ${this.getMana()} mana`);
    }
    
    getMana(): number {
        return 50;
    }
}

class RogueSkills implements Stealthy {
    stealth(): void {
        console.log("Entering stealth mode");
    }
    
    sneak(): void {
        console.log("Sneaking behind enemy");
    }
}

// Game Character using composition
class GameCharacter {
    private attackAbility?: Attackable;
    private defenseAbility?: Defendable;
    private magicAbility?: Magical;
    private stealthAbility?: Stealthy;
    
    constructor(
        private name: string,
        private characterClass: string
    ) {}
    
    // Compose abilities
    public setAttackAbility(ability: Attackable): void {
        this.attackAbility = ability;
    }
    
    public setDefenseAbility(ability: Defendable): void {
        this.defenseAbility = ability;
    }
    
    public setMagicAbility(ability: Magical): void {
        this.magicAbility = ability;
    }
    
    public setStealthAbility(ability: Stealthy): void {
        this.stealthAbility = ability;
    }
    
    // Use abilities
    public performAttack(target: string): void {
        if (this.attackAbility) {
            console.log(`${this.name} the ${this.characterClass}:`);
            this.attackAbility.attack(target);
        }
    }
    
    public performDefense(): void {
        if (this.defenseAbility) {
            console.log(`${this.name} the ${this.characterClass}:`);
            this.defenseAbility.defend();
        }
    }
    
    public performMagic(spell: string): void {
        if (this.magicAbility) {
            console.log(`${this.name} the ${this.characterClass}:`);
            this.magicAbility.castSpell(spell);
        }
    }
    
    public performStealth(): void {
        if (this.stealthAbility) {
            console.log(`${this.name} the ${this.characterClass}:`);
            this.stealthAbility.stealth();
        }
    }
}

// ===============================================
// 6. USAGE EXAMPLES
// ===============================================

console.log("=== INHERITANCE EXAMPLE - VEHICLES ===");
const car = new Car("Toyota", "Camry", 2023, 4, "Automatic");
const motorcycle = new Motorcycle("Harley", "Sportster", 2023, 883);
const truck = new Truck("Ford", "F-150", 2023, 1000);

const vehicles: Vehicle[] = [car, motorcycle, truck];

vehicles.forEach(vehicle => {
    vehicle.startEngine();
    console.log(`${vehicle.getInfo()} - Max Speed: ${vehicle.getMaxSpeed()}km/h, Fuel: ${vehicle.getFuelType()}`);
});

car.honk();
motorcycle.wheelie();
truck.loadCargo(800);

console.log("\n=== COMPOSITION EXAMPLE - COMPUTER ===");
const cpu = new CPU("Intel", "i7-12700K", 12, 3.6);
const ram = new RAM(32, "DDR4", 3200);
const storage = new Storage(1000, "SSD", 550, 520);
const graphics = new GraphicsCard("NVIDIA", "RTX 4070", 12);

const computer = new Computer(cpu, ram, storage, graphics);
console.log(computer.getSpecs());

computer.boot();
computer.runApplication("Photoshop", 8);
computer.runApplication("Game", 16);

// Easy to upgrade
const newRAM = new RAM(64, "DDR5", 4800);
computer.upgradeRAM(newRAM);

console.log("\n=== COMPOSITION EXAMPLE - FLEXIBLE ANIMALS ===");
const penguin = new FlexibleAnimal("Pingu", "Penguin");
penguin.setSwimBehavior(new SwimmingBehavior());
penguin.setWalkBehavior(new WalkingBehavior());
penguin.setFlyBehavior(new NoFlyBehavior());

const eagle = new FlexibleAnimal("Eddie", "Eagle");
eagle.setFlyBehavior(new FlyingBehavior());
eagle.setWalkBehavior(new WalkingBehavior());

penguin.performFly();   // Cannot fly
penguin.performSwim();  // Can swim
eagle.performFly();     // Can fly

console.log("\n=== COMPOSITION EXAMPLE - GAME CHARACTERS ===");
const warrior = new GameCharacter("Conan", "Warrior");
warrior.setAttackAbility(new SwordAttack());
warrior.setDefenseAbility(new ShieldDefense());

const mage = new GameCharacter("Gandalf", "Mage");
mage.setAttackAbility(new MagicAttack());
mage.setMagicAbility(new FireMagic());

const rogue = new GameCharacter("Stealth", "Rogue");
rogue.setAttackAbility(new SwordAttack());
rogue.setStealthAbility(new RogueSkills());

warrior.performAttack("Orc");
warrior.performDefense();

mage.performAttack("Dragon");
mage.performMagic("Fireball");

rogue.performStealth();
rogue.performAttack("Guard");
}
// ===============================================
// 7. DECISION MATRIX
// ===============================================

/*
WHEN TO USE INHERITANCE:
✅ Clear "IS-A" relationship (Car IS-A Vehicle)
✅ Shared behavior and properties among related classes
✅ Need to enforce a common interface
✅ Natural hierarchy exists
✅ Polymorphism is beneficial
✅ Stable, well-defined relationships

WHEN TO USE COMPOSITION:
✅ "HAS-A" relationship (Car HAS-A Engine)
✅ Need flexibility to change behavior at runtime
✅ Want to avoid rigid hierarchies
✅ Multiple inheritance-like behavior needed
✅ Components can be reused across different contexts
✅ Easier testing and maintenance

PROBLEMS WITH INHERITANCE:
❌ Rigid hierarchy - hard to change
❌ Tight coupling between parent and child
❌ Deep inheritance chains become complex
❌ Changes to parent affect all children
❌ Diamond problem in multiple inheritance
❌ Difficult to add new behaviors later

BENEFITS OF COMPOSITION:
✅ Flexible - can change behavior at runtime
✅ Loose coupling - components are independent
✅ Easier to test individual components
✅ Follows "favor composition over inheritance" principle
✅ More maintainable and extensible
✅ Supports dependency injection

REAL-WORLD GUIDELINES:
- Use inheritance for modeling natural taxonomies
- Use composition for modeling capabilities and behaviors
- Prefer composition when you need flexibility
- Use inheritance when you have a stable, well-defined hierarchy
- Remember: "Favor composition over inheritance"
*/