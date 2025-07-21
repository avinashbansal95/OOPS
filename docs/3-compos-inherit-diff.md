Key Takeaways:
When to Use Inheritance:

Clear "IS-A" relationship: Car IS-A Vehicle, Dog IS-A Animal
Stable hierarchy: Vehicle types, Employee types, Shape types
Shared behavior: Common methods like startEngine(), calculateSalary()
Polymorphism needed: Treating different types uniformly

When to Use Composition:

"HAS-A" relationship: Computer HAS-A CPU, Car HAS-A Engine
Flexibility needed: Changing behaviors at runtime
Avoiding rigid hierarchies: Like the Penguin-Bird problem
Multiple capabilities: Character with attack, defense, magic abilities
Easier testing: Test individual components separately

Real-World Decision Examples:
✅ Use Inheritance:

Employee → Manager, Developer, Intern
Shape → Circle, Rectangle, Triangle
Payment → CreditCard, DebitCard, BankTransfer

✅ Use Composition:

Computer → CPU, RAM, Storage, Graphics
Car → Engine, Transmission, Brakes
Game Character → Attack, Defense, Magic abilities

The "Favor Composition Over Inheritance" Principle:
This doesn't mean "never use inheritance" - it means:

Consider composition first when designing relationships
Use inheritance for natural taxonomies (IS-A relationships)
Use composition for behaviors and capabilities (HAS-A relationships)
Composition offers more flexibility for changing requirements

The key is recognizing that most real-world problems involve objects that have capabilities rather than objects that are types. A warrior character has sword attack ability, shield defense ability, and healing ability - these are better modeled as composed components than inherited behaviors.