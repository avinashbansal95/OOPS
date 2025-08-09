// # Strategy Pattern Guide

// The **Strategy Pattern** defines a family of algorithms, encapsulates each one, and makes them **interchangeable at runtime**.

// "Encapsulate what varies" — let clients choose behavior dynamically.

// Instead of hardcoding logic (e.g., sorting, payment), inject a strategy.

// ## 💡 Where Is It Used?

// Use when:
// * Multiple ways to do something: e.g., pay via **Credit Card**, **PayPal**, **Crypto**
// * You want to **avoid inheritance explosion** (e.g., `PremiumUserWithDiscountCashPayment`)
// * Need to **switch algorithms dynamically**

// Common in:
// * Payment gateways
// * Sorting/filtering
// * Navigation apps (fastest vs shortest route)

// ## 🔍 How to Identify Usage

// Look for:
// * Multiple `if-else` branches choosing between similar behaviors
// * Duplicated code across classes differing only in algorithm
// * Want to **inject behavior** like plugins

// 👉 Replace with Strategy!

// ## 🧠 Real-Life Example: Payment Methods

// You can pay with Credit Card, PayPal, or UPI. All perform `processPayment(amount)` but implement it differently.

{
// Strategy Interface
interface PaymentStrategy {
    processPayment(amount: number): boolean;
}

// Concrete Strategies
class CreditCardStrategy implements PaymentStrategy {
    processPayment(amount: number): boolean {
        console.log(`💳 Charging $${amount} to credit card...`);
        return true; // Simulate success
    }
}

class PayPalStrategy implements PaymentStrategy {
    processPayment(amount: number): boolean {
        console.log(`📘 Redirecting to PayPal to pay $${amount}...`);
        return Math.random() > 0.1; // 90% success rate
    }
}

class UPIPaymentStrategy implements PaymentStrategy {
    processPayment(amount: number): boolean {
        console.log(`📱 Sending UPI request for ₹${amount * 80}...`);
        return true;
    }
}

// Context
class ShoppingCart {
    private items: { name: string; price: number }[] = [];
    private paymentStrategy!: PaymentStrategy;

    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
    }

    addItem(name: string, price: number): void {
        this.items.push({ name, price });
    }

    calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    checkout(): void {
        const total = this.calculateTotal();
        console.log(`🛒 Total: $${total}`);
        const success = this.paymentStrategy.processPayment(total);
        if (success) {
            console.log("✅ Order confirmed!");
        } else {
            console.log("❌ Payment failed!");
        }
    }
}

const cart = new ShoppingCart();
cart.addItem("Laptop", 999);
cart.addItem("Mouse", 25);

// Pay with different strategies
cart.setPaymentStrategy(new CreditCardStrategy());
cart.checkout();

cart.setPaymentStrategy(new PayPalStrategy());
cart.checkout();

cart.setPaymentStrategy(new UPIPaymentStrategy());
cart.checkout();
}