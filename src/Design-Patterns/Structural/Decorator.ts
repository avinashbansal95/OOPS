//You want to add features to an object without subclassing (which explodes combinations).
//You order a basic coffee ($2). Then add milk (+$0.5), sugar (+$0.2), whipped cream (+$1). Each addition wraps the previous one without changing core.

// Component Interface
{
interface Coffee {
    cost(): number;
    description(): string;
}

// Concrete Component
class SimpleCoffee implements Coffee {
    cost(): number {
        return 2;
    }

    description(): string {
        return "Simple Coffee";
    }
}

// Abstract Decorator
abstract class CoffeeDecorator implements Coffee {
    protected coffee: Coffee;

    constructor(coffee: Coffee) {
        this.coffee = coffee; // Reusable initialization!
    }

    abstract cost(): number;
    abstract description(): string;
}

// Concrete Decorators
class Milk extends CoffeeDecorator {
    cost(): number {
        return this.coffee.cost() + 0.5;
    }

    description(): string {
        return this.coffee.description() + ", Milk";
    }
}

class Sugar extends CoffeeDecorator {
    cost(): number {
        return this.coffee.cost() + 0.2;
    }

    description(): string {
        return this.coffee.description() + ", Sugar";
    }
}

class WhippedCream extends CoffeeDecorator {
    cost(): number {
        return this.coffee.cost() + 1.0;
    }

    description(): string {
        return this.coffee.description() + ", Whipped Cream";
    }
}
let myCoffee = new SimpleCoffee();
myCoffee = new Milk(myCoffee);
myCoffee = new Sugar(myCoffee);
myCoffee = new WhippedCream(myCoffee);

console.log(myCoffee.description()); // Simple Coffee, Milk, Sugar, Whipped Cream
console.log(`Total: $${myCoffee.cost()}`); // Total: $3.

}



//ques why need of abstract class
// ### Option 1: Each decorator implements Coffee directly (NO abstract class)
// class Milk implements Coffee {
//     constructor(private coffee: Coffee) {} // Still needs to wrap!

//     cost(): number {
//         return this.coffee.cost() + 0.5;
//     }

//     description(): string {
//         return this.coffee.description() + ", Milk";
//     }
// }

// class Sugar implements Coffee {
//     constructor(private coffee: Coffee) {}

//     cost(): number {
//         return this.coffee.cost() + 0.2;
//     }

//     description(): string {
//         return this.coffee.description() + ", Sugar";
//     }
// }

// ... same for WhippedCream



//Why Use It?
// Avoid explosion of subclasses (VanillaMilkSugarCoffee, etc.)
// Open/Closed Principle: extend functionality without modifying code.
// Dynamic feature addition