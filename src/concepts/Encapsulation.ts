// ===============================================
// 1. ENCAPSULATION
// ===============================================
// Definition: Bundling data and methods together, hiding internal implementation details
// and exposing only necessary functionality through public interfaces.

class BankAccount {
    private balance: number;           // Private - hidden from outside
    private accountNumber: string;     // Private - hidden from outside
    private readonly accountType: string; // Readonly - cannot be changed after initialization
    
    constructor(initialBalance: number, accountNumber: string, accountType: string) {
        this.balance = initialBalance;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
    }
    
    // Public methods - the interface exposed to outside world
    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposited $${amount}. New balance: $${this.balance}`);
        }
    }
    
    public withdraw(amount: number): boolean {
        if (this.isValidWithdrawal(amount)) {
            this.balance -= amount;
            console.log(`Withdrew $${amount}. New balance: $${this.balance}`);
            return true;
        }
        return false;
    }
    
    public getBalance(): number {
        return this.balance; // Controlled access to balance
    }
    
    public getAccountInfo(): string {
        return `Account Type: ${this.accountType}`;
    }
    
    // Private method - internal implementation detail
    private isValidWithdrawal(amount: number): boolean {
        return amount > 0 && amount <= this.balance;
    }
}

// Usage example
const account = new BankAccount(1000, "123456789", "Savings");
account.deposit(500);
account.withdraw(200);
console.log("Current balance:", account.getBalance());
// account.balance = 5000; // Error: Property 'balance' is private