
{
    /**
     * SOLID Principles in TypeScript with Practical Examples
     * SOLID is an acronym representing five principles of object-oriented programming and design that help create more maintainable, flexible, and scalable software. Let's explore each principle with TypeScript examples.
     */

    /**
     * 1. Single Responsibility Principle (SRP)
     * Definition: A class should have only one reason to change, meaning it should have only one job or responsibility.
     * 
     * Bad Example (Violating SRP):
     */
    class User {
    constructor(private name: string, private email: string) {}

    saveToDatabase(): void {
        console.log(`Saving ${this.name} to database...`);
        // Database logic here
    }

    sendEmail(subject: string, body: string): void {
        console.log(`Sending email to ${this.email}`);
        // Email sending logic here
    }

    logUserActivity(action: string): void {
        console.log(`User ${this.name} performed ${action}`);
        // Activity logging logic here
    }
    }

    /**
     * Good Example (Following SRP):
     */
    class UserGood {
    constructor(public name: string, public email: string) {}
    }

    class UserRepository {
    saveToDatabase(user: UserGood): void {
        console.log(`Saving ${user.name} to database...`);
        // Database logic here
    }
    }

    class EmailService {
    sendEmail(user: UserGood, subject: string, body: string): void {
        console.log(`Sending email to ${user.email}`);
        // Email sending logic here
    }
    }

    class ActivityLogger {
    logActivity(user: UserGood, action: string): void {
        console.log(`User ${user.name} performed ${action}`);
        // Activity logging logic here
    }
    }

    /**
     * 2. Open/Closed Principle (OCP)
     * Definition: Software entities should be open for extension but closed for modification.
     * 
     * Bad Example (Violating OCP):
     */
    class Rectangle {
    constructor(public width: number, public height: number) {}
    }

    class Circle {
    constructor(public radius: number) {}
    }

    class AreaCalculator {
    calculateArea(shape: any): number {
        if (shape instanceof Rectangle) {
        return shape.width * shape.height;
        } else if (shape instanceof Circle) {
        return Math.PI * shape.radius * shape.radius;
        }
        // Adding a new shape requires modifying this class
        throw new Error("Shape not supported");
    }
    }

    /**
     * Good Example (Following OCP):
     */
    interface Shape {
    area(): number;
    }

    class RectangleGood implements Shape {
    constructor(private width: number, private height: number) {}
    
    area(): number {
        return this.width * this.height;
    }
    }

    class CircleGood implements Shape {
    constructor(private radius: number) {}
    
    area(): number {
        return Math.PI * this.radius * this.radius;
    }
    }

    class AreaCalculatorGood {
    calculateArea(shape: Shape): number {
        return shape.area();
    }
    }

    /**
     * Adding a new shape doesn't require changing AreaCalculator
     */
    class Triangle implements Shape {
    constructor(private base: number, private height: number) {}
    
    area(): number {
        return 0.5 * this.base * this.height;
    }
    }

    /**
     * 3. Liskov Substitution Principle (LSP)
     * Definition: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
     * 
     * Bad Example (Violating LSP):
     */
    class Bird {
    fly(): void {
        console.log("Flying...");
    }
    }

    class Duck extends Bird {
    // Duck can fly, so this is fine
    }

    class Ostrich extends Bird {
    // Ostrich can't fly, but it inherits fly() from Bird
    fly(): void {
        throw new Error("Ostriches can't fly!");
    }
    }

    function makeBirdFly(bird: Bird): void {
    bird.fly(); // This will throw an error for Ostrich
    }

    /**
     * Good Example (Following LSP):
     */
    class BirdGood {
    // Common bird properties/methods
    }

    interface FlyingBird {
    fly(): void;
    }

    class DuckGood extends BirdGood implements FlyingBird {
    fly(): void {
        console.log("Duck flying...");
    }
    }

    class OstrichGood extends BirdGood {
    // No fly method, which is correct
    }

    function makeBirdFlyGood(bird: FlyingBird): void {
    bird.fly(); // Only works with birds that can fly
    }

    /**
     * 4. Interface Segregation Principle (ISP)
     * Definition: Clients should not be forced to depend on interfaces they don't use.
     * 
     * Bad Example (Violating ISP):
     */
    interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
    }

    class HumanWorker implements Worker {
    work(): void { console.log("Human working"); }
    eat(): void { console.log("Human eating"); }
    sleep(): void { console.log("Human sleeping"); }
    }

    class RobotWorker implements Worker {
    work(): void { console.log("Robot working"); }
    eat(): void { throw new Error("Robots don't eat!"); }
    sleep(): void { throw new Error("Robots don't sleep!"); }
    }

    /**
     * Good Example (Following ISP):
     */
    interface Workable {
    work(): void;
    }

    interface Eatable {
    eat(): void;
    }

    interface Sleepable {
    sleep(): void;
    }

    class HumanWorkerGood implements Workable, Eatable, Sleepable {
    work(): void { console.log("Human working"); }
    eat(): void { console.log("Human eating"); }
    sleep(): void { console.log("Human sleeping"); }
    }

    class RobotWorkerGood implements Workable {
    work(): void { console.log("Robot working"); }
    }

    /**
     * 5. Dependency Inversion Principle (DIP)
     * Definition: High-level modules should not depend on low-level modules. Both should depend on abstractions.
     * 
     * Bad Example (Violating DIP):
     */
    class MySQLDatabase {
    save(data: string): void {
        console.log(`Saving ${data} to MySQL database`);
    }
    }

    class HighLevelModule {
    private database: MySQLDatabase;

    constructor() {
        this.database = new MySQLDatabase(); // Direct dependency
    }

    execute(data: string): void {
        this.database.save(data);
    }
    }

    /**
     * Good Example (Following DIP):
     */
    interface Database {
    save(data: string): void;
    }

    class MySQLDatabaseGood implements Database {
    save(data: string): void {
        console.log(`Saving ${data} to MySQL database`);
    }
    }

    class MongoDBDatabase implements Database {
    save(data: string): void {
        console.log(`Saving ${data} to MongoDB database`);
    }
    }

    class HighLevelModuleGood {
    constructor(private database: Database) {} // Depends on abstraction
    }

    /**
     * Usage:
     */
    const mySQL = new MySQLDatabaseGood();
    const mongoDB = new MongoDBDatabase();

    const module1 = new HighLevelModuleGood(mySQL);
    const module2 = new HighLevelModuleGood(mongoDB);

    /**
     * Practical Scenario Applying All SOLID Principles
     * Let's create a payment processing system that follows all SOLID principles:
     */

    /**
     * Interfaces (Abstractions)
     */
    interface PaymentProcessor {
    processPayment(amount: number): void;
    }

    interface PaymentValidator {
    validate(): boolean;
    }

    interface PaymentNotifier {
    notifyUser(message: string): void;
    }

    /**
     * Concrete implementations
     */
    class CreditCardProcessor implements PaymentProcessor {
    constructor(
        private validator: PaymentValidator,
        private notifier: PaymentNotifier
    ) {}

    processPayment(amount: number): void {
        if (!this.validator.validate()) {
        throw new Error("Payment validation failed");
        }
        
        console.log(`Processing credit card payment of $${amount}`);
        this.notifier.notifyUser(`Credit card payment of $${amount} processed`);
    }
    }

    class PayPalProcessor implements PaymentProcessor {
    constructor(
        private validator: PaymentValidator,
        private notifier: PaymentNotifier
    ) {}

    processPayment(amount: number): void {
        if (!this.validator.validate()) {
        throw new Error("Payment validation failed");
        }
        
        console.log(`Processing PayPal payment of $${amount}`);
        this.notifier.notifyUser(`PayPal payment of $${amount} processed`);
    }
    }

    class BasicPaymentValidator implements PaymentValidator {
    validate(): boolean {
        console.log("Basic validation passed");
        return true;
    }
    }

    class EmailNotifier implements PaymentNotifier {
    constructor(private email: string) {}

    notifyUser(message: string): void {
        console.log(`Sending email to ${this.email}: ${message}`);
    }
    }

    /**
     * High-level module
     */
    class PaymentService {
    constructor(private paymentProcessor: PaymentProcessor) {}

    makePayment(amount: number): void {
        this.paymentProcessor.processPayment(amount);
    }
    }

    /**
     * Usage
     */
    const emailNotifier = new EmailNotifier("user@example.com");
    const basicValidator = new BasicPaymentValidator();

    const creditCardProcessor = new CreditCardProcessor(basicValidator, emailNotifier);
    const payPalProcessor = new PayPalProcessor(basicValidator, emailNotifier);

    const creditCardService = new PaymentService(creditCardProcessor);
    creditCardService.makePayment(100);

    const payPalService = new PaymentService(payPalProcessor);
    payPalService.makePayment(200);

    /**
     * This example demonstrates all SOLID principles:
     * 
     * SRP: Each class has a single responsibility
     * 
     * OCP: New payment methods can be added without modifying existing code
     * 
     * LSP: All payment processors can be substituted for the PaymentProcessor interface
     * 
     * ISP: Interfaces are small and focused
     * 
     * DIP: High-level modules depend on abstractions, not concrete implementations
     */
}