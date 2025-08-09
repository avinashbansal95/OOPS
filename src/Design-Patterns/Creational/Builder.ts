// What it is
// Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.
// When to use

// When you need to create complex objects with many optional parameters
// When you want to avoid telescoping constructors
// When you want to create different representations of an object using the same construction process

// How to identify

// Director class that controls the construction process
// Builder interface with methods for building parts
// Concrete builders that implement the builder interface
// Product class that represents the complex object

// Product
class House {
    public walls: string = '';
    public doors: number = 0;
    public windows: number = 0;
    public roof: string = '';
    public garage: boolean = false;
    public garden: boolean = false;
    
    public describe(): string {
        return `House with ${this.walls}, ${this.doors} doors, ${this.windows} windows, ${this.roof} roof` +
               (this.garage ? ', with garage' : '') +
               (this.garden ? ', with garden' : '');
    }
}

// Builder interface
interface HouseBuilder {
    buildWalls(): this;
    buildDoors(): this;
    buildWindows(): this;
    buildRoof(): this;
    buildGarage(): this;
    buildGarden(): this;
    getResult(): House;
}

// Concrete builder
class StandardHouseBuilder implements HouseBuilder {
    private house: House;
    
    constructor() {
        this.house = new House();
    }
    
    buildWalls(): this {
        this.house.walls = 'brick walls';
        return this;
    }
    
    buildDoors(): this {
        this.house.doors = 1;
        return this;
    }
    
    buildWindows(): this {
        this.house.windows = 2;
        return this;
    }
    
    buildRoof(): this {
        this.house.roof = 'tile';
        return this;
    }
    
    buildGarage(): this {
        this.house.garage = true;
        return this;
    }
    
    buildGarden(): this {
        this.house.garden = true;
        return this;
    }
    
    getResult(): House {
        return this.house;
    }
}

// Director
class HouseDirector {
    public static constructStandardHouse(builder: HouseBuilder): House {
        return builder
            .buildWalls()
            .buildDoors()
            .buildWindows()
            .buildRoof()
            .getResult();
    }
    
    public static constructLuxuryHouse(builder: HouseBuilder): House {
        return builder
            .buildWalls()
            .buildDoors()
            .buildWindows()
            .buildRoof()
            .buildGarage()
            .buildGarden()
            .getResult();
    }
}

// Usage
const builder = new StandardHouseBuilder();
const standardHouse = HouseDirector.constructStandardHouse(builder);
console.log(standardHouse.describe());

const luxuryBuilder = new StandardHouseBuilder();
const luxuryHouse = HouseDirector.constructLuxuryHouse(luxuryBuilder);
console.log(luxuryHouse.describe());


// Product
class Computer {
    public cpu: string = '';
    public ram: string = '';
    public storage: string = '';
    public gpu: string = '';
    public motherboard: string = '';
    
    public toString(): string {
        return `Computer Configuration:
        CPU: ${this.cpu}
        RAM: ${this.ram}
        Storage: ${this.storage}
        GPU: ${this.gpu}
        Motherboard: ${this.motherboard}`;
    }
}

// Builder
class ComputerBuilder {
    private computer: Computer;
    
    constructor() {
        this.computer = new Computer();
    }
    
    public setCpu(cpu: string): ComputerBuilder {
        this.computer.cpu = cpu;
        return this;
    }
    
    public setRam(ram: string): ComputerBuilder {
        this.computer.ram = ram;
        return this;
    }
    
    public setStorage(storage: string): ComputerBuilder {
        this.computer.storage = storage;
        return this;
    }
    
    public setGpu(gpu: string): ComputerBuilder {
        this.computer.gpu = gpu;
        return this;
    }
    
    public setMotherboard(motherboard: string): ComputerBuilder {
        this.computer.motherboard = motherboard;
        return this;
    }
    
    public build(): Computer {
        return this.computer;
    }
}

// Usage
const gamingComputer = new ComputerBuilder()
    .setCpu('Intel i9-12900K')
    .setRam('32GB DDR5')
    .setStorage('1TB NVMe SSD')
    .setGpu('NVIDIA RTX 4090')
    .setMotherboard('ASUS ROG Maximus Z690')
    .build();

console.log(gamingComputer.toString());

const officeComputer = new ComputerBuilder()
    .setCpu('Intel i5-12600K')
    .setRam('16GB DDR4')
    .setStorage('500GB SSD')
    .setGpu('Integrated Graphics')
    .setMotherboard('MSI B660')
    .build();

console.log(officeComputer.toString());