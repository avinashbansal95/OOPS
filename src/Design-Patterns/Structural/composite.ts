// The Composite Design Pattern is a structural design pattern that allows you to treat individual objects and groups of objects uniformly . It lets you build tree-like structures (part-whole hierarchies) where both leaves (individual items) and composites (containers) are treated the same way.

// You have components that can be either:
// A leaf (a simple object, e.g., a file),
// Or a composite (a container holding other components, e.g., a folder).
// Both implement the same interface , so the client doesn’t need to know if it's dealing with one item or many.

interface Component {
    getName(): string;
    getSize(): number;
}

{
    interface FileSystemItem {
        getName(): string;
        getSize(): number;
    }
    // Leaf
    class File implements FileSystemItem {
        constructor(private name: string, private size: number) {}

        getName(): string { return this.name; }
        getSize(): number { return this.size; }
    }
    // Composite
    class Folder implements FileSystemItem {
        private children: FileSystemItem[] = [];

        constructor(private name: string) {}

        add(item: FileSystemItem): void {
            this.children.push(item);
        }

        remove(item: FileSystemItem): void {
            this.children = this.children.filter(i => i !== item);
        }

        getName(): string { return this.name; }

        getSize(): number {
            return this.children.reduce((sum, child) => sum + child.getSize(), 0);
        }
        // getSize(): number {
        //     console.log(`🔍 Calculating size of folder: ${this.name}`);
        //     let total = 0;
        //     for (const child of this.children) {
        //         total += child.getSize(); // Polymorphic call
        //     }
        //     console.log(`📦 ${this.name} total: ${total} KB`);
        //     return total;
        // }
    }
    // Usage
    const root = new Folder("Root");
    const docs = new Folder("Documents");
    docs.add(new File("resume.pdf", 120));
    docs.add(new File("budget.xlsx", 80));

    const pics = new Folder("Pictures");
    pics.add(new File("photo.jpg", 300));
    docs.add(pics);
    root.add(docs);
    root.add(pics);

    console.log(root.getSize());
}