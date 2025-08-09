// What it is:
// Ensures a class has only one instance and provides a global point of access to it.

// When to use:
// When you need exactly one instance of a class
// When you need controlled access to a shared resource
// When the sole instance should be extensible by subclassing
// How to identify:
// Class with private constructor
// Static method to get the instance
// Private static instance variable

class Logger {
    private static instance : Logger;
    private constructor () {};
    private logs : string [] = [];
    
    static getInstance () {
        if(!Logger.instance) {
             Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(msg:string):void {
        this.logs.push(msg);
    }

    public getLogs():string [] {
        return this.logs;
    }

}


// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true - same instance

logger1.log("Application started");
logger2.log("User logged in");
console.log(logger1.getLogs()); // Both logs appear



class DatabaseConnection {
    private static instance: DatabaseConnection;
    private connectionString: string;
    private isConnected: boolean = false;

    private constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    public static getInstance(connectionString: string = "default"): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(connectionString);
        }
        return DatabaseConnection.instance;
    }

    public connect(): void {
        if (!this.isConnected) {
            console.log(`Connecting to database: ${this.connectionString}`);
            this.isConnected = true;
        } else {
            console.log("Already connected to database");
        }
    }

    public disconnect(): void {
        if (this.isConnected) {
            console.log("Disconnecting from database");
            this.isConnected = false;
        }
    }
}

// Usage
const db1 = DatabaseConnection.getInstance("mongodb://localhost:27017");
const db2 = DatabaseConnection.getInstance("postgresql://localhost:5432"); // Will still use first connection

db1.connect(); // Connecting to database: mongodb://localhost:27017
db2.connect(); // Already connected to database