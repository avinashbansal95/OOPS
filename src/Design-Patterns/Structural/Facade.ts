// 🧠 Real-Life Example: Restaurant Waiter
// You don’t go to the kitchen, talk to chef, bartender, and cashier. You just tell the waiter : “I want pasta and wine.” He coordinates everything behind the scenes.

// Problem
// System has many complex parts; client shouldn’t deal with all of them.


// Subsystems
class Chef {
    cookPasta(): void {
        console.log("🍝 Chef is cooking pasta...");
    }
}

class Bartender {
    pourWine(): void {
        console.log("🍷 Bartender is pouring red wine...");
    }
}

class Cashier {
    takePayment(amount: number): void {
        console.log(`💰 Cashier received $${amount}`);
    }
}

// Facade
class RestaurantFacade {
    private chef: Chef;
    private bartender: Bartender;
    private cashier: Cashier;

    constructor() {
        this.chef = new Chef();
        this.bartender = new Bartender();
        this.cashier = new Cashier();
    }

    orderDinner(): void {
        console.log("🍽️ Starting dinner order...");
        this.chef.cookPasta();
        this.bartender.pourWine();
        this.cashier.takePayment(50);
        console.log("✅ Dinner served!");
    }
}

const restaurant = new RestaurantFacade();
restaurant.orderDinner();

// Output:
// 🍽️ Starting dinner order...
// 🍝 Chef is cooking pasta...
// 🍷 Bartender is pouring red wine...
// 💰 Cashier received $50
// ✅ Dinner served!


// Why Use It?
// Hide complexity.
// Reduce dependencies on internal components.
// Great for APIs, SDKs, libraries.