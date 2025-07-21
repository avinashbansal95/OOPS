// ===============================================
// INTERFACES vs ABSTRACT CLASSES - REAL WORLD EXAMPLES
// ===============================================

// ===============================================
// 1. WHAT ARE THEY?
// ===============================================

// INTERFACE: Pure contract - defines WHAT must be implemented
{
interface PaymentProcessor {
    processPayment(amount: number): Promise<boolean>;
    validateCard(cardNumber: string): boolean;
    getTransactionFee(amount: number): number;
}

// ABSTRACT CLASS: Partial implementation - defines WHAT and some HOW
abstract class Employee {
    protected name: string;
    protected id: string;
    protected salary: number;
    
    constructor(name: string, id: string, salary: number) {
        this.name = name;
        this.id = id;
        this.salary = salary;
    }
    
    // Concrete method - shared implementation
    public getInfo(): string {
        return `${this.name} (ID: ${this.id})`;
    }
    
    // Abstract method - must be implemented by subclasses
    abstract calculateBonus(): number;
    abstract getJobTitle(): string;
}

// ===============================================
// 2. KEY DIFFERENCES DEMONSTRATED
// ===============================================

// INTERFACE EXAMPLE: Payment Processing System
// Multiple unrelated classes can implement the same interface

class StripePaymentProcessor implements PaymentProcessor {
    processPayment(amount: number): Promise<boolean> {
        console.log(`Processing $${amount} via Stripe`);
        return Promise.resolve(true);
    }
    
    validateCard(cardNumber: string): boolean {
        return cardNumber.length === 16;
    }
    
    getTransactionFee(amount: number): number {
        return amount * 0.029; // 2.9% fee
    }
}

class PayPalPaymentProcessor implements PaymentProcessor {
    processPayment(amount: number): Promise<boolean> {
        console.log(`Processing $${amount} via PayPal`);
        return Promise.resolve(true);
    }
    
    validateCard(cardNumber: string): boolean {
        return cardNumber.length >= 15;
    }
    
    getTransactionFee(amount: number): number {
        return amount * 0.034; // 3.4% fee
    }
}

class CryptoPaymentProcessor implements PaymentProcessor {
    processPayment(amount: number): Promise<boolean> {
        console.log(`Processing $${amount} via Crypto`);
        return Promise.resolve(true);
    }
    
    validateCard(cardNumber: string): boolean {
        return true; // No card validation for crypto
    }
    
    getTransactionFee(amount: number): number {
        return 0.50; // Fixed fee
    }
}

// ABSTRACT CLASS EXAMPLE: Employee Management System
// Related classes that share common behavior

class Developer extends Employee {
    private programmingLanguages: string[];
    
    constructor(name: string, id: string, salary: number, languages: string[]) {
        super(name, id, salary);
        this.programmingLanguages = languages;
    }
    
    calculateBonus(): number {
        return this.salary * 0.15; // 15% bonus
    }
    
    getJobTitle(): string {
        return "Software Developer";
    }
    
    // Developer-specific method
    public getSkills(): string[] {
        return this.programmingLanguages;
    }
}

class Manager extends Employee {
    private teamSize: number;
    
    constructor(name: string, id: string, salary: number, teamSize: number) {
        super(name, id, salary);
        this.teamSize = teamSize;
    }
    
    calculateBonus(): number {
        return this.salary * 0.20 + (this.teamSize * 1000); // 20% + team bonus
    }
    
    getJobTitle(): string {
        return "Team Manager";
    }
    
    // Manager-specific method
    public getTeamSize(): number {
        return this.teamSize;
    }
}

class Intern extends Employee {
    private duration: number; // in months
    
    constructor(name: string, id: string, salary: number, duration: number) {
        super(name, id, salary);
        this.duration = duration;
    }
    
    calculateBonus(): number {
        return this.duration > 6 ? 500 : 0; // Bonus after 6 months
    }
    
    getJobTitle(): string {
        return "Intern";
    }
}

// ===============================================
// 3. WHEN TO USE WHAT - REAL SCENARIOS
// ===============================================

// SCENARIO 1: E-commerce Platform
// Use INTERFACE for different services that are unrelated but need same contract

interface NotificationService {
    sendNotification(message: string, recipient: string): Promise<void>;
    validateRecipient(recipient: string): boolean;
}

class EmailNotificationService implements NotificationService {
    async sendNotification(message: string, recipient: string): Promise<void> {
        console.log(`Sending email to ${recipient}: ${message}`);
    }
    
    validateRecipient(recipient: string): boolean {
        return recipient.includes('@');
    }
}

class SMSNotificationService implements NotificationService {
    async sendNotification(message: string, recipient: string): Promise<void> {
        console.log(`Sending SMS to ${recipient}: ${message}`);
    }
    
    validateRecipient(recipient: string): boolean {
        return /^\d{10}$/.test(recipient);
    }
}

class PushNotificationService implements NotificationService {
    async sendNotification(message: string, recipient: string): Promise<void> {
        console.log(`Sending push notification to ${recipient}: ${message}`);
    }
    
    validateRecipient(recipient: string): boolean {
        return recipient.length > 20; // Device token validation
    }
}

// SCENARIO 2: Game Development
// Use ABSTRACT CLASS for related game entities with shared behavior

abstract class GameCharacter {
    protected name: string;
    protected health: number;
    protected maxHealth: number;
    protected level: number;
    
    constructor(name: string, health: number, level: number) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.level = level;
    }
    
    // Shared behavior
    public takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
        console.log(`${this.name} took ${damage} damage. Health: ${this.health}`);
    }
    
    public heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
        console.log(`${this.name} healed ${amount}. Health: ${this.health}`);
    }
    
    public getStatus(): string {
        return `${this.name} (Level ${this.level}) - Health: ${this.health}/${this.maxHealth}`;
    }
    
    // Abstract methods - each character type implements differently
    abstract attack(target: GameCharacter): void;
    abstract getAttackPower(): number;
    abstract levelUp(): void;
}

class Warrior extends GameCharacter {
    private armor: number;
    
    constructor(name: string, health: number, level: number, armor: number) {
        super(name, health, level);
        this.armor = armor;
    }
    
    attack(target: GameCharacter): void {
        const damage = this.getAttackPower();
        console.log(`${this.name} performs a sword attack!`);
        target.takeDamage(damage);
    }
    
    getAttackPower(): number {
        return 20 + (this.level * 5);
    }
    
    levelUp(): void {
        this.level++;
        this.maxHealth += 10;
        this.health = this.maxHealth;
        this.armor += 2;
        console.log(`${this.name} leveled up! New level: ${this.level}`);
    }
}

class Mage extends GameCharacter {
    private mana: number;
    
    constructor(name: string, health: number, level: number, mana: number) {
        super(name, health, level);
        this.mana = mana;
    }
    
    attack(target: GameCharacter): void {
        if (this.mana >= 10) {
            const damage = this.getAttackPower();
            console.log(`${this.name} casts a fireball!`);
            target.takeDamage(damage);
            this.mana -= 10;
        } else {
            console.log(`${this.name} is out of mana!`);
        }
    }
    
    getAttackPower(): number {
        return 15 + (this.level * 8);
    }
    
    levelUp(): void {
        this.level++;
        this.maxHealth += 5;
        this.health = this.maxHealth;
        this.mana += 20;
        console.log(`${this.name} leveled up! New level: ${this.level}`);
    }
}

// ===============================================
// 4. COMBINING BOTH - REAL WORLD SCENARIO
// ===============================================

// SCENARIO: Document Management System
// Abstract class for common document behavior
abstract class Document {
    protected title: string;
    protected content: string;
    protected createdAt: Date;
    
    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
    }
    
    public getInfo(): string {
        return `${this.title} - Created: ${this.createdAt.toDateString()}`;
    }
    
    public updateContent(newContent: string): void {
        this.content = newContent;
    }
    
    // Abstract methods
    abstract save(): Promise<void>;
    abstract validate(): boolean;
}

// Interfaces for different capabilities
interface Printable {
    print(): void;
    getPrintPreview(): string;
}

interface Shareable {
    share(recipient: string): Promise<void>;
    getShareableLink(): string;
}

interface Editable {
    edit(newContent: string): void;
    getEditHistory(): string[];
}

// Concrete implementations
class PDFDocument extends Document implements Printable, Shareable {
    private pages: number;
    
    constructor(title: string, content: string, pages: number) {
        super(title, content);
        this.pages = pages;
    }
    
    async save(): Promise<void> {
        console.log(`Saving PDF: ${this.title}`);
    }
    
    validate(): boolean {
        return this.content.length > 0 && this.pages > 0;
    }
    
    print(): void {
        console.log(`Printing PDF: ${this.title} (${this.pages} pages)`);
    }
    
    getPrintPreview(): string {
        return `PDF Preview: ${this.title}`;
    }
    
    async share(recipient: string): Promise<void> {
        console.log(`Sharing PDF ${this.title} with ${recipient}`);
    }
    
    getShareableLink(): string {
        return `https://docs.com/pdf/${this.title}`;
    }
}

class TextDocument extends Document implements Printable, Shareable, Editable {
    private editHistory: string[] = [];
    
    constructor(title: string, content: string) {
        super(title, content);
    }
    
    async save(): Promise<void> {
        console.log(`Saving text document: ${this.title}`);
    }
    
    validate(): boolean {
        return this.content.length > 0;
    }
    
    print(): void {
        console.log(`Printing text document: ${this.title}`);
    }
    
    getPrintPreview(): string {
        return `Text Preview: ${this.content.substring(0, 50)}...`;
    }
    
    async share(recipient: string): Promise<void> {
        console.log(`Sharing text document ${this.title} with ${recipient}`);
    }
    
    getShareableLink(): string {
        return `https://docs.com/text/${this.title}`;
    }
    
    edit(newContent: string): void {
        this.editHistory.push(this.content);
        this.content = newContent;
    }
    
    getEditHistory(): string[] {
        return [...this.editHistory];
    }
}

// ===============================================
// 5. USAGE EXAMPLES
// ===============================================

console.log("=== PAYMENT PROCESSING EXAMPLE ===");
const paymentProcessors: PaymentProcessor[] = [
    new StripePaymentProcessor(),
    new PayPalPaymentProcessor(),
    new CryptoPaymentProcessor()
];

// Polymorphism with interface
paymentProcessors.forEach(processor => {
    console.log(`Fee for $100: $${processor.getTransactionFee(100)}`);
});

console.log("\n=== EMPLOYEE MANAGEMENT EXAMPLE ===");
const employees: Employee[] = [
    new Developer("Alice", "DEV001", 80000, ["TypeScript", "React"]),
    new Manager("Bob", "MGR001", 120000, 5),
    new Intern("Charlie", "INT001", 30000, 8)
];

employees.forEach(emp => {
    console.log(`${emp.getInfo()} - ${emp.getJobTitle()}`);
    console.log(`Bonus: $${emp.calculateBonus()}`);
});

console.log("\n=== GAME CHARACTER EXAMPLE ===");
const warrior = new Warrior("Thor", 100, 1, 10);
const mage = new Mage("Gandalf", 80, 1, 50);

console.log(warrior.getStatus());
console.log(mage.getStatus());

warrior.attack(mage);
mage.attack(warrior);

console.log("\n=== DOCUMENT MANAGEMENT EXAMPLE ===");
const pdfDoc = new PDFDocument("Report", "Annual report content", 25);
const textDoc = new TextDocument("Notes", "Meeting notes");

// Using interface methods
pdfDoc.print();
textDoc.edit("Updated meeting notes");
console.log(textDoc.getPrintPreview());
}
// ===============================================
// DECISION MATRIX
// ===============================================

/*
USE INTERFACE WHEN:
✓ You need a contract that unrelated classes can implement
✓ You want to support multiple inheritance (a class can implement multiple interfaces)
✓ You're defining capabilities/abilities (Printable, Shareable, Flyable)
✓ You need pure abstraction (no implementation)
✓ You want to enforce a specific API across different implementations

USE ABSTRACT CLASS WHEN:
✓ You have related classes that share common behavior
✓ You want to provide some default implementation
✓ You need to maintain state (instance variables)
✓ You want to use access modifiers (private, protected)
✓ You have a clear "is-a" relationship
✓ You want to prevent instantiation of the base class

REAL WORLD EXAMPLES:
Interface: PaymentProcessor, NotificationService, DatabaseDriver, ApiClient
Abstract Class: Employee, Animal, GameCharacter, Document, Vehicle
*/