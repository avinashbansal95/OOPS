// ===============================================
// TYPESCRIPT ACCESS MODIFIERS - COMPLETE GUIDE
// ===============================================

// ===============================================
// 1. PUBLIC (Default) - Accessible everywhere
// ===============================================
{
class PublicExample {
    public name: string;           // Explicitly public
    age: number;                   // Implicitly public (default)
    public readonly id: string;    // Public readonly
    
    constructor(name: string, age: number, id: string) {
        this.name = name;
        this.age = age;
        this.id = id;
    }
    
    public greet(): string {       // Explicitly public method
        return `Hello, I'm ${this.name}`;
    }
    
    getInfo(): string {            // Implicitly public method
        return `${this.name} is ${this.age} years old`;
    }
}

// Usage of public members
const publicUser = new PublicExample("Alice", 25, "USER001");
console.log(publicUser.name);        // ✅ Accessible
console.log(publicUser.age);         // ✅ Accessible
console.log(publicUser.id);          // ✅ Accessible
console.log(publicUser.greet());     // ✅ Accessible
console.log(publicUser.getInfo());   // ✅ Accessible

publicUser.name = "Bob";             // ✅ Can modify
publicUser.age = 30;                 // ✅ Can modify
// publicUser.id = "USER002";        // ❌ Error: Cannot assign to 'id' because it is read-only

// ===============================================
// 2. PRIVATE - Accessible only within the same class
// ===============================================

class PrivateExample {
    private balance: number;           // Private property
    private accountNumber: string;     // Private property
    public customerName: string;       // Public property
    
    constructor(customerName: string, initialBalance: number, accountNumber: string) {
        this.customerName = customerName;
        this.balance = initialBalance;
        this.accountNumber = accountNumber;
    }
    
    // Private method - only accessible within this class
    private validateTransaction(amount: number): boolean {
        return amount > 0 && amount <= this.balance;
    }
    
    // Private method for internal logging
    private logTransaction(type: string, amount: number): void {
        console.log(`[${this.accountNumber}] ${type}: $${amount} | Balance: $${this.balance}`);
    }
    
    // Public methods that use private members
    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            this.logTransaction("DEPOSIT", amount);
        }
    }
    
    public withdraw(amount: number): boolean {
        if (this.validateTransaction(amount)) {
            this.balance -= amount;
            this.logTransaction("WITHDRAWAL", amount);
            return true;
        }
        console.log("Invalid transaction");
        return false;
    }
    
    public getBalance(): number {
        return this.balance;  // Controlled access to private field
    }
    
    // Public method accessing private members
    public getAccountSummary(): string {
        return `Account ${this.accountNumber}: ${this.customerName} - Balance: $${this.balance}`;
    }
}

// Usage of private members
const account = new PrivateExample("John Doe", 1000, "ACC123456");
console.log(account.customerName);     // ✅ Public - accessible
console.log(account.getBalance());     // ✅ Public method - accessible
account.deposit(500);                  // ✅ Public method - accessible
account.withdraw(200);                 // ✅ Public method - accessible

// console.log(account.balance);       // ❌ Error: Property 'balance' is private
// console.log(account.accountNumber); // ❌ Error: Property 'accountNumber' is private
// account.validateTransaction(100);   // ❌ Error: Method 'validateTransaction' is private
// account.logTransaction("TEST", 50); // ❌ Error: Method 'logTransaction' is private

// ===============================================
// 3. PROTECTED - Accessible within class and subclasses
// ===============================================

class ProtectedExample {
    protected name: string;           // Protected property
    protected age: number;            // Protected property
    private ssn: string;              // Private property
    public email: string;             // Public property
    
    constructor(name: string, age: number, ssn: string, email: string) {
        this.name = name;
        this.age = age;
        this.ssn = ssn;
        this.email = email;
    }
    
    // Protected method - accessible in this class and subclasses
    protected validateAge(): boolean {
        return this.age >= 18;
    }
    
    // Protected method for formatting
    protected formatName(): string {
        return this.name.toUpperCase();
    }
    
    // Private method - only in this class
    private validateSSN(): boolean {
        return this.ssn.length === 9;
    }
    
    // Public method using protected and private members
    public getPublicInfo(): string {
        return `${this.formatName()} - ${this.email}`;
    }
}

// Subclass demonstrating protected access
class Employee extends ProtectedExample {
    private employeeId: string;
    private department: string;
    
    constructor(name: string, age: number, ssn: string, email: string, employeeId: string, department: string) {
        super(name, age, ssn, email);
        this.employeeId = employeeId;
        this.department = department;
    }
    
    // Can access protected members from parent class
    public getEmployeeInfo(): string {
        return `${this.formatName()} (${this.employeeId}) - ${this.department}`;
    }
    
    // Can access protected members in methods
    public canWorkNightShift(): boolean {
        return this.validateAge() && this.age >= 21;
    }
    
    // Method using protected properties
    public getBasicInfo(): string {
        return `Employee: ${this.name}, Age: ${this.age}`;  // ✅ Can access protected members
    }
    
    // Cannot access private members from parent
    // public getSSN(): string {
    //     return this.ssn;  // ❌ Error: Property 'ssn' is private
    // }
}

// Usage of protected members
const employee = new Employee("Jane Smith", 25, "123456789", "jane@company.com", "EMP001", "Engineering");
console.log(employee.email);              // ✅ Public - accessible
console.log(employee.getEmployeeInfo());  // ✅ Public method - accessible
console.log(employee.canWorkNightShift());// ✅ Public method - accessible
console.log(employee.getBasicInfo());     // ✅ Public method - accessible

// console.log(employee.name);            // ❌ Error: Property 'name' is protected
// console.log(employee.age);             // ❌ Error: Property 'age' is protected
// employee.formatName();                 // ❌ Error: Method 'formatName' is protected
// employee.validateAge();                // ❌ Error: Method 'validateAge' is protected

// ===============================================
// 4. READONLY - Can only be assigned during declaration or in constructor
// ===============================================

class ReadonlyExample {
    readonly id: string;                    // Readonly property
    readonly createdAt: Date;               // Readonly property
    public readonly version: string = "1.0"; // Readonly with default value
    private readonly secret: string;        // Private readonly
    
    public name: string;                    // Regular public property
    
    constructor(id: string, name: string, secret: string) {
        this.id = id;                       // ✅ Can assign in constructor
        this.name = name;
        this.createdAt = new Date();        // ✅ Can assign in constructor
        this.secret = secret;               // ✅ Can assign in constructor
    }
    
    public updateName(newName: string): void {
        this.name = newName;                // ✅ Can modify regular property
        // this.id = "NEW_ID";              // ❌ Error: Cannot assign to 'id' because it is read-only
        // this.createdAt = new Date();     // ❌ Error: Cannot assign to 'createdAt' because it is read-only
    }
    
    public getInfo(): string {
        return `${this.id}: ${this.name} (Created: ${this.createdAt})`;
    }
}

const readonlyObj = new ReadonlyExample("OBJ001", "Sample Object", "secret123");
console.log(readonlyObj.id);            // ✅ Can read readonly property
console.log(readonlyObj.version);       // ✅ Can read readonly property
console.log(readonlyObj.name);          // ✅ Can read regular property

readonlyObj.updateName("Updated Name"); // ✅ Can modify regular property
// readonlyObj.id = "NEW_ID";           // ❌ Error: Cannot assign to 'id' because it is read-only
// readonlyObj.createdAt = new Date();  // ❌ Error: Cannot assign to 'createdAt' because it is read-only

// ===============================================
// 5. STATIC - Belongs to the class, not instances
// ===============================================

class StaticExample {
    static readonly PI: number = 3.14159;           // Static readonly property
    static instanceCount: number = 0;               // Static property
    private static secretKey: string = "SECRET123"; // Private static property
    
    public id: number;                              // Instance property
    public name: string;                            // Instance property
    
    constructor(name: string) {
        this.name = name;
        this.id = ++StaticExample.instanceCount;    // Access static property
    }
    
    // Static method - belongs to class, not instance
    static getInstanceCount(): number {
        return StaticExample.instanceCount;
    }
    
    // Static method with private static access
    static validateSecret(input: string): boolean {
        return input === StaticExample.secretKey;
    }
    
    // Static utility method
    static calculateCircleArea(radius: number): number {
        return StaticExample.PI * radius * radius;
    }
    
    // Instance method accessing static member
    public getInstanceInfo(): string {
        return `Instance ${this.id} of ${StaticExample.instanceCount} total instances`;
    }
}

// Usage of static members
console.log(StaticExample.PI);                     // ✅ Access static property
console.log(StaticExample.getInstanceCount());     // ✅ Access static method
console.log(StaticExample.calculateCircleArea(5)); // ✅ Access static method

const obj1 = new StaticExample("Object 1");
const obj2 = new StaticExample("Object 2");
const obj3 = new StaticExample("Object 3");

console.log(StaticExample.getInstanceCount());     // Output: 3
console.log(obj1.getInstanceInfo());               // Instance method accessing static
console.log(obj2.getInstanceInfo());               // Instance method accessing static

// console.log(obj1.PI);                          // ❌ Error: Property 'PI' is static
// console.log(obj1.getInstanceCount());          // ❌ Error: Property 'getInstanceCount' is static
// console.log(StaticExample.secretKey);          // ❌ Error: Property 'secretKey' is private

// ===============================================
// 6. REAL-WORLD EXAMPLE - COMPREHENSIVE USAGE
// ===============================================

// Database connection example showing all access modifiers
class DatabaseConnection {
    private static readonly MAX_CONNECTIONS: number = 10;      // Private static readonly
    private static connectionCount: number = 0;                // Private static
    public static readonly DB_VERSION: string = "2.1.0";      // Public static readonly
    
    private readonly connectionId: string;                     // Private readonly
    protected connectionString: string;                        // Protected
    private isConnected: boolean = false;                     // Private
    public readonly createdAt: Date;                           // Public readonly
    
    constructor(connectionString: string) {
        if (DatabaseConnection.connectionCount >= DatabaseConnection.MAX_CONNECTIONS) {
            throw new Error("Maximum connections reached");
        }
        
        this.connectionId = `CONN_${++DatabaseConnection.connectionCount}`;
        this.connectionString = connectionString;
        this.createdAt = new Date();
    }
    
    // Private method
    private validateConnection(): boolean {
        return this.connectionString.length > 0;
    }
    
    // Protected method - can be overridden in subclasses
    protected establishConnection(): void {
        if (this.validateConnection()) {
            this.isConnected = true;
            console.log(`Connection ${this.connectionId} established`);
        }
    }
    
    // Public method
    public connect(): void {
        if (!this.isConnected) {
            this.establishConnection();
        }
    }
    
    // Public method
    public disconnect(): void {
        if (this.isConnected) {
            this.isConnected = false;
            console.log(`Connection ${this.connectionId} disconnected`);
        }
    }
    
    // Public method accessing private members
    public getStatus(): string {
        return `${this.connectionId}: ${this.isConnected ? 'Connected' : 'Disconnected'}`;
    }
    
    // Static method
    public static getConnectionCount(): number {
        return DatabaseConnection.connectionCount;
    }
    
    // Static method accessing private static
    public static canCreateConnection(): boolean {
        return DatabaseConnection.connectionCount < DatabaseConnection.MAX_CONNECTIONS;
    }
}

// Specialized database connection
class PostgreSQLConnection extends DatabaseConnection {
    private schema: string;
    
    constructor(connectionString: string, schema: string = "public") {
        super(connectionString);
        this.schema = schema;
    }
    
    // Override protected method
    protected establishConnection(): void {
        console.log(`Establishing PostgreSQL connection with schema: ${this.schema}`);
        super.establishConnection();
    }
    
    // Method accessing protected member from parent
    public changeSchema(newSchema: string): void {
        this.schema = newSchema;
        console.log(`Schema changed to: ${newSchema} for connection: ${this.connectionString}`);
    }
}

// Usage example
console.log("=== DATABASE CONNECTION EXAMPLE ===");
console.log(`DB Version: ${DatabaseConnection.DB_VERSION}`);
console.log(`Can create connection: ${DatabaseConnection.canCreateConnection()}`);

const connection1 = new DatabaseConnection("server1:5432/mydb");
const connection2 = new PostgreSQLConnection("server2:5432/mydb", "analytics");

connection1.connect();
connection2.connect();

console.log(connection1.getStatus());
console.log(connection2.getStatus());
console.log(`Total connections: ${DatabaseConnection.getConnectionCount()}`);

connection2.changeSchema("reporting");
}
// ===============================================
// 7. ACCESS MODIFIER SUMMARY TABLE
// ===============================================

/*
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Modifier    │ Same Class  │ Subclass    │ Other Class │ Outside     │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ public      │     ✅      │     ✅      │     ✅      │     ✅      │
│ protected   │     ✅      │     ✅      │     ❌      │     ❌      │
│ private     │     ✅      │     ❌      │     ❌      │     ❌      │
│ readonly    │     ✅*     │     ✅*     │     ✅*     │     ✅*     │
│ static      │     ✅      │     ✅      │     ✅      │     ✅      │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

* readonly: Can be read but not modified after initialization

WHEN TO USE EACH:

PUBLIC:
- Default visibility
- API methods and properties
- Properties that need external access
- Methods that form the public interface

PRIVATE:
- Internal implementation details
- Helper methods
- Sensitive data (passwords, keys)
- Methods that should not be accessed externally

PROTECTED:
- Properties/methods that subclasses need access to
- Template method pattern implementations
- Shared functionality in inheritance hierarchies
- When you want controlled access in subclasses

READONLY:
- Configuration values
- IDs and timestamps
- Immutable properties
- Values set once during initialization

STATIC:
- Utility functions
- Constants
- Factory methods
- Class-level counters or caches
- Methods that don't need instance data

BEST PRACTICES:
1. Start with private, make public only when needed
2. Use protected for inheritance scenarios
3. Use readonly for immutable data
4. Use static for class-level functionality
5. Combine modifiers when appropriate (private static readonly)
*/