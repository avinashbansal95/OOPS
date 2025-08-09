// What it is
// Provides an interface for creating families of related or dependent objects without specifying their concrete classes.
// When to use

// When your system should be independent of how its products are created
// When your system should be configured with one of multiple families of products
// When you need to enforce that products from the same family are used together

// How to identify

// Abstract factory interface with methods to create products
// Multiple concrete factories implementing the abstract factory
// Product families (related products)
// Client code that uses the abstract factory
// Abstract products
interface Button {
    render(): void;
}

interface Checkbox {
    toggle(): void;
}

// Concrete products for Windows
class WindowsButton implements Button {
    render(): void {
        console.log("Rendering Windows button");
    }
}

class WindowsCheckbox implements Checkbox {
    toggle(): void {
        console.log("Toggling Windows checkbox");
    }
}

// Concrete products for Mac
class MacButton implements Button {
    render(): void {
        console.log("Rendering Mac button");
    }
}

class MacCheckbox implements Checkbox {
    toggle(): void {
        console.log("Toggling Mac checkbox");
    }
}

// Abstract factory
interface UIFactory {
    createButton(): Button;
    createCheckbox(): Checkbox;
}

// Concrete factories
class WindowsFactory implements UIFactory {
    createButton(): Button {
        return new WindowsButton();
    }
    
    createCheckbox(): Checkbox {
        return new WindowsCheckbox();
    }
}

class MacFactory implements UIFactory {
    createButton(): Button {
        return new MacButton();
    }
    
    createCheckbox(): Checkbox {
        return new MacCheckbox();
    }
}

// Client code
class Application {
    private button: Button;
    private checkbox: Checkbox;
    
    constructor(factory: UIFactory) {
        this.button = factory.createButton();
        this.checkbox = factory.createCheckbox();
    }
    
    public renderUI(): void {
        this.button.render();
        this.checkbox.toggle();
    }
}

// Usage
const windowsFactory = new WindowsFactory();
const windowsApp = new Application(windowsFactory);
windowsApp.renderUI();

const macFactory = new MacFactory();
const macApp = new Application(macFactory);
macApp.renderUI();



//Example 2: Database Driver Factory
// Abstract products
interface Connection {
    connect(): void;
    disconnect(): void;
}

interface QueryBuilder {
    select(table: string): string;
    insert(table: string, data: any): string;
}

// Concrete products for MySQL
class MySQLConnection implements Connection {
    connect(): void {
        console.log("Connecting to MySQL database");
    }
    
    disconnect(): void {
        console.log("Disconnecting from MySQL database");
    }
}

class MySQLQueryBuilder implements QueryBuilder {
    select(table: string): string {
        return `SELECT * FROM ${table}`;
    }
    
    insert(table: string, data: any): string {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data).map(v => `'${v}'`).join(', ');
        return `INSERT INTO ${table} (${keys}) VALUES (${values})`;
    }
}

// Concrete products for PostgreSQL
class PostgreSQLConnection implements Connection {
    connect(): void {
        console.log("Connecting to PostgreSQL database");
    }
    
    disconnect(): void {
        console.log("Disconnecting from PostgreSQL database");
    }
}

class PostgreSQLQueryBuilder implements QueryBuilder {
    select(table: string): string {
        return `SELECT * FROM ${table}`;
    }
    
    insert(table: string, data: any): string {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data).map(v => `'${v}'`).join(', ');
        return `INSERT INTO ${table} (${keys}) VALUES (${values}) RETURNING *`;
    }
}

// Abstract factory
interface DatabaseFactory {
    createConnection(): Connection;
    createQueryBuilder(): QueryBuilder;
}

// Concrete factories
class MySQLFactory implements DatabaseFactory {
    createConnection(): Connection {
        return new MySQLConnection();
    }
    
    createQueryBuilder(): QueryBuilder {
        return new MySQLQueryBuilder();
    }
}

class PostgreSQLFactory implements DatabaseFactory {
    createConnection(): Connection {
        return new PostgreSQLConnection();
    }
    
    createQueryBuilder(): QueryBuilder {
        return new PostgreSQLQueryBuilder();
    }
}

// Client code
class DatabaseClient {
    private connection: Connection;
    private queryBuilder: QueryBuilder;
    
    constructor(factory: DatabaseFactory) {
        this.connection = factory.createConnection();
        this.queryBuilder = factory.createQueryBuilder();
    }
    
    public executeQuery(): void {
        this.connection.connect();
        console.log(this.queryBuilder.select('users'));
        console.log(this.queryBuilder.insert('users', { name: 'John', email: 'john@example.com' }));
        this.connection.disconnect();
    }
}

// Usage
const mysqlFactory = new MySQLFactory();
const mysqlClient = new DatabaseClient(mysqlFactory);
mysqlClient.executeQuery();

const postgresFactory = new PostgreSQLFactory();
const postgresClient = new DatabaseClient(postgresFactory);
postgresClient.executeQuery();