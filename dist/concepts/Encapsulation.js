"use strict";
// ===============================================
// 1. ENCAPSULATION
// ===============================================
// Definition: Bundling data and methods together, hiding internal implementation details
// and exposing only necessary functionality through public interfaces.
class BankAccount {
    constructor(initialBalance, accountNumber, accountType) {
        this.balance = initialBalance;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
    }
    // Public methods - the interface exposed to outside world
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposited $${amount}. New balance: $${this.balance}`);
        }
    }
    withdraw(amount) {
        if (this.isValidWithdrawal(amount)) {
            this.balance -= amount;
            console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
            return true;
        }
        return false;
    }
    getBalance() {
        return this.balance; // Controlled access to balance
    }
    getAccountInfo() {
        return `Account Type: ${this.accountType}`;
    }
    // Private method - internal implementation detail
    isValidWithdrawal(amount) {
        return amount > 0 && amount <= this.balance;
    }
}
// Usage example
const account = new BankAccount(1000, "123456789", "Savings");
account.deposit(500);
account.withdraw(200);
console.log("Current balance:", account.getBalance());
// account.balance = 5000; // Error: Property 'balance' is private
