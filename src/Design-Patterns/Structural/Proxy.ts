// It acts as a "stand-in" or "surrogate" for another object to control access to it. Think of it like a bodyguard , gatekeeper , or middleman 
//Need to add logic before accessing a real object (e.g., lazy loading, security, logging).
//admin-only features in a web app (e.g., delete user, view logs).
{
interface Document {
    view(): void;
    edit(): void;
}

class RealDocument implements Document {
    constructor(public content: string) {}

    view(): void {
        console.log(`📄 Viewing: ${this.content}`);
    }

    edit(): void {
        console.log(`✏️ Editing: ${this.content}`);
    }
}

class DocumentProxy implements Document {
    constructor(
        private userId: string,
        private role: 'user' | 'admin',
        private realDoc: RealDocument
    ) {}

    view(): void {
        this.realDoc.view(); // Everyone can view
    }

    edit(): void {
        if (this.role === 'admin') {
            this.realDoc.edit();
        } else {
            console.log(`🚫 User ${this.userId} is not allowed to edit!`);
        }
    }
}

// Usage
const doc = new RealDocument("Sensitive Data");
const adminProxy = new DocumentProxy("U123", "admin", doc);
const userProxy = new DocumentProxy("U456", "user", doc);

adminProxy.edit(); // ✅ Edit allowed
userProxy.edit();  // ❌ "User U456 is not allowed to edit!"


//2 Calling a payment gateway hosted on another server.
interface PaymentProcessor {
    process(amount: number): boolean;
}

class PayPalAPI implements PaymentProcessor {
    process(amount: number): boolean {
        console.log(`🌐 Sending $${amount} to PayPal servers...`);
        return Math.random() > 0.1; // Simulate success/failure
    }
}

class PayPalProxy implements PaymentProcessor {
    private realAPI: PayPalAPI | null = null;

    process(amount: number): boolean {
        console.log(`🔒 Validating request before sending...`);
        if (amount <= 0) {
            console.log("❌ Invalid amount!");
            return false;
        }

        if (!this.realAPI) {
            console.log("🚀 Initializing connection to PayPal...");
            this.realAPI = new PayPalAPI();
        }

        const result = this.realAPI.process(amount);
        console.log(result ? "✅ Payment successful" : "❌ Payment failed");
        return result;
    }
}


// Subject Interface
interface Account {
    viewBalance(): number;
    deposit(amount: number): void;
}

// Real Object
class BankAccount implements Account {
    private balance: number = 0;

    viewBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }
}

// Proxy
class SecureAccountProxy implements Account {
    private bankAccount: BankAccount | null = null;
    private password: string;

    constructor(password: string) {
        this.password = password;
    }

    authenticate(pwd: string | null): boolean {
        return pwd === this.password;
    }

    viewBalance(): number {
        if (!this.authenticate(prompt("Enter password: "))) {
            console.log("🚫 Access denied!");
            return 0;
        }

        // Lazy initialization
        if (!this.bankAccount) {
            this.bankAccount = new BankAccount();
            console.log("Intialized real account.");
        }

        return this.bankAccount.viewBalance();
    }

    deposit(amount: number): void {
        if (!this.authenticate(prompt("Enter password: "))) {
            console.log("🚫 Deposit failed: Unauthorized!");
            return;
        }

        if (!this.bankAccount) {
            this.bankAccount = new BankAccount();
        }

        this.bankAccount.deposit(amount);
        console.log(`✅ Deposited $${amount}`);
    }
}
}