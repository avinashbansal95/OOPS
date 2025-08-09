// # Behavioral Design Patterns Guide

// Behavioral Design Patterns deal with **object interaction**, **responsibility distribution**, and **communication between objects**.

// We'll cover three powerful patterns:

// 🔁 State Pattern  
// 🎯 Strategy Pattern  
// 🧩 Template Method Pattern

// For each, we'll explore:
// - 📘 What it is
// - 💡 When & where to use it
// - 🔍 How to identify its usage
// - ✅ TypeScript code example with real-life analogy

// ## 1. 🔁 State Design Pattern

// ### 📘 What Is It?

// The State Pattern allows an object to **change its behavior when its internal state changes**. The object appears to change its class.

// Instead of using long if-else or switch statements based on state, you **encapsulate each state in a separate class**.

// This follows the **Open/Closed Principle**: open for extension, closed for modification.

// ### 💡 Where Is It Used?

// Perfect when:
// - An object behaves differently depending on its **current state**
// - You have lots of conditional logic like `if (state == 'ON') ... else if (state == 'OFF') ...`
// - Behavior must **transition smoothly** from one state to another

// ### 🔍 How to Identify Usage

// Look for:
// - A variable like `state`, `status`, `mode`, etc.
// - Big methods full of conditionals checking this state
// - Transitions: e.g., `pending → approved → shipped`

// 👉 Refactor such cases with the **State Pattern**

// ### 🧠 Real-Life Example: Vending Machine

// A vending machine can be in different states:
// - `NoCoin`
// - `HasCoin`
// - `Sold`
// - `OutOfStock`

// Each state defines what happens when you insert a coin, press a button, etc.

// ### ✅ TypeScript Code

// ```typescript
// // Context
// class VendingMachine {
//     private state: State;
//     private itemCount: number = 5;

//     constructor() {
//         this.state = new NoCoinState(this);
//     }

//     setState(state: State): void {
//         this.state = state;
//     }

//     insertCoin(): void {
//         this.state.insertCoin();
//     }

//     pressButton(): void {
//         this.state.pressButton();
//     }

//     dispense(): void {
//         console.log("📦 Releasing product...");
//         if (this.itemCount > 0) {
//             this.itemCount--;
//         }
//         this.state = new NoCoinState(this); // Reset after dispensing
//     }

//     hasItem(): boolean {
//         return this.itemCount > 0;
//     }
// }

// // State Interface
// interface State {
//     insertCoin(): void;
//     pressButton(): void;
// }

// // Concrete States
// class NoCoinState implements State {
//     constructor(private machine: VendingMachine) {}

//     insertCoin(): void {
//         console.log("✅ Coin inserted.");
//         this.machine.setState(new HasCoinState(this.machine));
//     }

//     pressButton(): void {
//         console.log("❌ Insert coin first!");
//     }
// }

// class HasCoinState implements State {
//     constructor(private machine: VendingMachine) {}

//     insertCoin(): void {
//         console.log("⚠️ Already has a coin!");
//     }

//     pressButton(): void {
//         if (this.machine.hasItem()) {
//             console.log("🚀 Preparing to dispense...");
//             this.machine.setState(new SoldState(this.machine));
//             this.machine.dispense();
//         } else {
//             console.log("🚫 Out of stock!");
//             this.machine.setState(new NoCoinState(this.machine));
//         }
//     }
// }

// class SoldState implements State {
//     constructor(private machine: VendingMachine) {}

//     insertCoin(): void {
//         console.log("⏳ Already dispensing... Please wait.");
//     }

//     pressButton(): void {
//         console.log("⏳ Transaction in progress...");
//     }
// }
// ```

// ### 💡 Usage

// ```typescript
// const vm = new VendingMachine();

// vm.pressButton();     // ❌ Insert coin first!
// vm.insertCoin();      // ✅ Coin inserted.
// vm.pressButton();     // 🚀 Preparing... → 📦 Releasing...
// vm.pressButton();     // ❌ Insert coin first!
// ```

// ✅ **Benefit**: No giant switch(state) blocks. Easy to add new states.

// ## 2. 🎯 Strategy Design Pattern

// ### 📘 What Is It?

// The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them **interchangeable at runtime**.

// "Encapsulate what varies" — let clients choose behavior dynamically.

// Instead of hardcoding logic (e.g., sorting, payment), inject a strategy.

// ### 💡 Where Is It Used?

// Use when:
// - Multiple ways to do something: e.g., pay via **Credit Card**, **PayPal**, **Crypto**
// - You want to **avoid inheritance explosion** (e.g., `PremiumUserWithDiscountCashPayment`)
// - Need to **switch algorithms dynamically**

// Common in:
// - Payment gateways
// - Sorting/filtering
// - Navigation apps (fastest vs shortest route)

// ### 🔍 How to Identify Usage

// Look for:
// - Multiple `if-else` branches choosing between similar behaviors
// - Duplicated code across classes differing only in algorithm
// - Want to **inject behavior** like plugins

// 👉 Replace with Strategy!

// ### 🧠 Real-Life Example: Payment Methods

// You can pay with Credit Card, PayPal, or UPI. All perform `processPayment(amount)` but implement it differently.

// ### ✅ TypeScript Code

// ```typescript
// // Strategy Interface
// interface PaymentStrategy {
//     processPayment(amount: number): boolean;
// }

// // Concrete Strategies
// class CreditCardStrategy implements PaymentStrategy {
//     processPayment(amount: number): boolean {
//         console.log(`💳 Charging $${amount} to credit card...`);
//         return true; // Simulate success
//     }
// }

// class PayPalStrategy implements PaymentStrategy {
//     processPayment(amount: number): boolean {
//         console.log(`📘 Redirecting to PayPal to pay $${amount}...`);
//         return Math.random() > 0.1; // 90% success rate
//     }
// }

// class UPIPaymentStrategy implements PaymentStrategy {
//     processPayment(amount: number): boolean {
//         console.log(`📱 Sending UPI request for ₹${amount * 80}...`);
//         return true;
//     }
// }

// // Context
// class ShoppingCart {
//     private items: { name: string; price: number }[] = [];
//     private paymentStrategy: PaymentStrategy;

//     setPaymentStrategy(strategy: PaymentStrategy): void {
//         this.paymentStrategy = strategy;
//     }

//     addItem(name: string, price: number): void {
//         this.items.push({ name, price });
//     }

//     calculateTotal(): number {
//         return this.items.reduce((sum, item) => sum + item.price, 0);
//     }

//     checkout(): void {
//         const total = this.calculateTotal();
//         console.log(`🛒 Total: $${total}`);
//         const success = this.paymentStrategy.processPayment(total);
//         if (success) {
//             console.log("✅ Order confirmed!");
//         } else {
//             console.log("❌ Payment failed!");
//         }
//     }
// }
// ```

// ### 💡 Usage

// ```typescript
// const cart = new ShoppingCart();
// cart.addItem("Laptop", 999);
// cart.addItem("Mouse", 25);

// // Pay with different strategies
// cart.setPaymentStrategy(new CreditCardStrategy());
// cart.checkout();

// cart.setPaymentStrategy(new PayPalStrategy());
// cart.checkout();

// cart.setPaymentStrategy(new UPIPaymentStrategy());
// cart.checkout();
// ```

// ### ✅ Output

// ```
// 🛒 Total: $1024
// 💳 Charging $1024 to credit card...
// ✅ Order confirmed!
// ```

// ✅ **Benefit**: Add new payment method without changing ShoppingCart.

// ## 3. 🧩 Template Method Design Pattern

// ### 📘 What Is It?

// The Template Method Pattern defines the skeleton of an algorithm in a method, deferring some steps to subclasses.

// The template method lets subclasses redefine certain steps without changing the algorithm's structure.

// Think of it as a **recipe outline**: "Boil water → Brew → Pour → Add Condiments" — exact details vary by tea/coffee.

// ### 💡 Where Is It Used?

// Use when:
// - Several classes follow the same process but differ in implementation of steps
// - You want to eliminate code duplication
// - Frameworks/libraries provide base flow (e.g., initialization hooks)

// Common in:
// - Build tools
// - Game development (game loop)
// - Web frameworks (middleware setup)

// ### 🔍 How to Identify Usage

// Look for:
// - Two or more methods with **identical structure**, differing only in step details
// - Abstract base class with both concrete and abstract methods
// - Subclasses overriding specific parts

// 👉 Use Template Method!

// ### 🧠 Real-Life Example: Making Beverages

// Making tea and coffee follows the same steps:
// 1. Boil water
// 2. Brew
// 3. Pour in cup
// 4. Add condiments

// But brewing and condiments differ.

// ---

// ## 4. 🧩 Command Design Pattern

// ### 📘 What Is It?

// The **Command Pattern** turns a request into a **stand-alone object** that contains all information about the request — such as:
// - What method to call
// - The object that owns the method  
// - The arguments

// This lets you **parameterize methods with different requests**, **delay or queue a request's execution**, and **support undo/redo**, logging, etc.

// Think of it as **"encapsulating a function call"**.

// ### 💡 Where Is It Used?

// Perfect when you want to:
// - Implement **undo/redo** (like in text editors)
// - Support **logging and transactional operations**
// - **Queue, schedule, or log** requests
// - Decouple **sender** (who asks) from **receiver** (who does the work)

// Common in:
// - GUI buttons & menus
// - Remote controls
// - Task scheduling systems
// - Macro recording

// ### 🔍 How to Identify Usage

// Look for:
// - A class has many similar methods like `copy()`, `paste()`, `undo()` — all doing different things but used uniformly
// - Need to **store commands** and execute them later
// - Want to **add new actions without changing existing code**

// 👉 Use **Command Pattern** to treat actions as objects.

// ### 🧠 Real-Life Analogy: Restaurant Order

// You (the **invoker**) tell a waiter (takes the **command**) your order. The waiter gives the **order slip** (command object) to the chef (the **receiver**). The order is processed later.

// You don't talk directly to the chef → **decoupling**.

// The order slip can be:
// - Queued
// - Canceled  
// - Repeated

// That's **Command Pattern** in action!

// ## 5. 🔁 Iterator Design Pattern

// ### 📘 What Is It?

// The **Iterator Pattern** provides a way to access elements of a collection sequentially without exposing the underlying representation of the collection.

// For each, we'll cover:
// - 📘 What it is
// - 💡 Where it's used
// - 🔍 How to identify its usage
// - 🧠 Real-life analogy
// - ✅ TypeScript code example
// - 🚀 Key benefits


// Receiver – Does the actual work
class Light {
    turnOn(): void {
        console.log("💡 Light is ON");
    }

    turnOff(): void {
        console.log("🌑 Light is OFF");
    }
}

// Command Interface
interface Command {
    execute(): void;
    undo(): void;
}

// Concrete Commands
class TurnOnLightCommand implements Command {
    constructor(private light: Light) {}

    execute(): void {
        this.light.turnOn();
    }

    undo(): void {
        this.light.turnOff();
    }
}

class TurnOffLightCommand implements Command {
    constructor(private light: Light) {}

    execute(): void {
        this.light.turnOff();
    }

    undo(): void {
        this.light.turnOn();
    }
}

// Invoker – Triggers the command
class RemoteControl {
    private commandHistory: Command[] = [];

    setCommand(command: Command): void {
        this.commandHistory.push(command);
    }

    pressButton(): void {
        const command = this.commandHistory.pop();
        if (command) {
            command.execute();
        }
    }

    undoLast(): void {
        const command = this.commandHistory[this.commandHistory.length - 1];
        if (command) {
            console.log("⏪ Undoing last command...");
            command.undo();
        }
    }
}

{

// Receiver
class TextEditor {
    private text: string = "";
    private clipboard: string = "";

    copy(): void {
        this.clipboard = this.text.slice(0, 10); // Copy first 10 chars
        console.log(`📎 Copied: "${this.clipboard}"`);
    }

    paste(): void {
        this.text += this.clipboard;
        console.log(`📋 Pasted: "${this.clipboard}"`);
    }

    undo(): void {
        console.log("↩️ Undo last action");
    }
}

// Command Interface
interface Command {
    execute(): void;
}

// Concrete Commands
class CopyCommand implements Command {
    constructor(private editor: TextEditor) {}

    execute(): void {
        this.editor.copy();
    }
}

class PasteCommand implements Command {
    constructor(private editor: TextEditor) {}

    execute(): void {
        this.editor.paste();
    }
}

class UndoCommand implements Command {
    constructor(private editor: TextEditor) {}

    execute(): void {
        this.editor.undo();
    }
}

// Invoker: Toolbar
class Toolbar {
    private buttons: { [name: string]: Command } = {};

    setCommand(name: string, command: Command): void {
        this.buttons[name] = command;
    }

    click(name: string): void {
        this.buttons[name]?.execute();
    }
}

// Usage
const editor = new TextEditor();
const toolbar = new Toolbar();

toolbar.setCommand("Copy", new CopyCommand(editor));
toolbar.setCommand("Paste", new PasteCommand(editor));
toolbar.setCommand("Undo", new UndoCommand(editor));

toolbar.click("Copy");  // 📎 Copied
toolbar.click("Paste"); // 📋 Pasted
toolbar.click("Undo");  // ↩️ Undo

}