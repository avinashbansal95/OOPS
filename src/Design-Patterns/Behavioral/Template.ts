// 3. 🧩 Template Method Design Pattern
// 📘 What Is It?
// The Template Method Pattern defines the skeleton of an algorithm in a method, deferring some steps to subclasses.
// The template method lets subclasses redefine certain steps without changing the algorithm's structure.
// Think of it as a recipe outline: "Boil water → Brew → Pour → Add Condiments" — exact details vary by tea/coffee.
// 💡 Where Is It Used?
// Use when:

// Several classes follow the same process but differ in implementation of steps
// You want to eliminate code duplication
// Frameworks/libraries provide base flow (e.g., initialization hooks)

// Common in:

// Build tools
// Game development (game loop)
// Web frameworks (middleware setup)

// 🔍 How to Identify Usage
// Look for:

// Two or more methods with identical structure, differing only in step details
// Abstract base class with both concrete and abstract methods
// Subclasses overriding specific parts

// 👉 Use Template Method!
// 🧠 Real-Life Example: Making Beverages
// Making tea and coffee follows the same steps:

// Boil water
// Brew
// Pour in cup
// Add condiments

// But brewing and condiments differ.

// Abstract Class with Template Method
abstract class CaffeineBeverage {
    // Template Method (final — don't override!)
    prepareRecipe(): void {
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
    }

    boilWater(): void {
        console.log("🔥 Boiling water...");
    }

    pourInCup(): void {
        console.log("☕ Pouring into cup...");
    }

    // Must be implemented by subclass
    abstract brew(): void;
    abstract addCondiments(): void;
}

// Concrete Subclasses
class Tea extends CaffeineBeverage {
    brew(): void {
        console.log("🫖 Steeping the tea...");
    }

    addCondiments(): void {
        console.log("🍯 Adding lemon...");
    }
}

class Coffee extends CaffeineBeverage {
    brew(): void {
        console.log("☕ Dripping coffee through filter...");
    }

    addCondiments(): void {
        console.log("🧈 Adding sugar and milk...");
    }
}


const tea = new Tea();
tea.prepareRecipe();

// Output:
// 🔥 Boiling water...
// 🫖 Steeping the tea...
// ☕ Pouring into cup...
// 🍯 Adding lemon...

const coffee = new Coffee();
coffee.prepareRecipe();