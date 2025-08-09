//The State Pattern allows an object to change its behavior when its internal state changes . The object appears to change its class.
// # State Pattern Guide

// ## 💡 Where Is It Used?

// Perfect when:
// * An object behaves differently depending on its **current state**
// * You have lots of conditional logic like `if (state == 'ON') ... else if (state == 'OFF') ...`
// * Behavior must **transition smoothly** from one state to another

// ## 🔍 How to Identify Usage

// Look for:
// * A variable like `state`, `status`, `mode`, etc.
// * Big methods full of conditionals checking this state
// * Transitions: e.g., `pending → approved → shipped`

// 👉 Refactor such cases with the **State Pattern**

// ## 🧠 Real-Life Example: Vending Machine

// A vending machine can be in different states:
// * `NoCoin`
// * `HasCoin`
// * `Sold`
// * `OutOfStock`

// Each state defines what happens when you insert a coin, press a button, etc.


// Context
class VendingMachine {
    private state: State;
    private itemCount: number = 1;

    constructor() {
        this.state = new NoCoinState(this);
    }

    setState(state: State): void {
        this.state = state;
    }

    insertCoin(): void {
        this.state.insertCoin();
    }

    pressButton(): void {
        this.state.pressButton();
    }

    dispense(): void {
        console.log("📦 Releasing product...");
        if (this.itemCount > 0) {
            this.itemCount--;
        }
        this.state = new NoCoinState(this); // Reset after dispensing
    }

    hasItem(): boolean {
        return this.itemCount > 0;
    }
}

// State Interface
interface State {
    insertCoin(): void;
    pressButton(): void;
}

// Concrete States
class NoCoinState {
    constructor(private machine: VendingMachine) {}

    insertCoin(): void {
        console.log("✅ Coin inserted.");
        this.machine.setState(new HasCoinState(this.machine));
    }

    pressButton(): void {
        console.log("❌ Insert coin first!");
    }
}

class HasCoinState implements State {
    constructor(private machine: VendingMachine) {}

    insertCoin(): void {
        console.log("⚠️ Already has a coin!");
    }

    pressButton(): void {
        if (this.machine.hasItem()) {
            console.log("🚀 Preparing to dispense...");
            this.machine.setState(new SoldState(this.machine));
            this.machine.dispense();
        } else {
            console.log("🚫 Out of stock!");
            this.machine.setState(new NoCoinState(this.machine));
        }
    }
}

class SoldState implements State {
    constructor(private machine: VendingMachine) {}

    insertCoin(): void {
        console.log("⏳ Already dispensing... Please wait.");
    }

    pressButton(): void {
        console.log("⏳ Transaction in progress...");
    }
}