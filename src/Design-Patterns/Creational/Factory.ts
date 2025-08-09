// What it is
// Defines an interface for creating an object, but lets subclasses decide which class to instantiate.
// When to use

// When a class cannot anticipate the class of objects it must create
// When a class wants its subclasses to specify the objects it creates
// When you want to delegate the instantiation process to subclasses

// How to identify

// Creator class with factory method
// Product interface
// Concrete creators that implement the factory method
// Concrete products that implement the product interface

{
    // Product interface
    interface Document {
        open(): void;
        save(): void;
        close(): void;
    }

    // Concrete products
    class WordDocument implements Document {
        open(): void {
            console.log("Opening Word document");
        }
        
        save(): void {
            console.log("Saving Word document");
        }
        
        close(): void {
            console.log("Closing Word document");
        }
    }

    class PDFDocument implements Document {
        open(): void {
            console.log("Opening PDF document");
        }
        
        save(): void {
            console.log("Saving PDF document");
        }
        
        close(): void {
            console.log("Closing PDF document");
        }
    }

    // Creator abstract class
    abstract class DocumentCreator {
        public abstract createDocument(): Document;
        
        public processDocument(): void {
            const document = this.createDocument();
            document.open();
            document.save();
            document.close();
        }
    }

    // Concrete creators
    class WordDocumentCreator extends DocumentCreator {
        public createDocument(): Document {
            return new WordDocument();
        }
    }

    class PDFDocumentCreator extends DocumentCreator {
        public createDocument(): Document {
            return new PDFDocument();
        }
    }

    // Usage
    const wordCreator = new WordDocumentCreator();
    wordCreator.processDocument();

    const pdfCreator = new PDFDocumentCreator();
    pdfCreator.processDocument();
}


{

    // Product interface
interface Notification {
    send(message: string, recipient: string): void;
}

// Concrete products
class EmailNotification implements Notification {
    send(message: string, recipient: string): void {
        console.log(`Sending Email to ${recipient}: ${message}`);
    }
}

class SMSNotification implements Notification {
    send(message: string, recipient: string): void {
        console.log(`Sending SMS to ${recipient}: ${message}`);
    }
}

class PushNotification implements Notification {
    send(message: string, recipient: string): void {
        console.log(`Sending Push Notification to ${recipient}: ${message}`);
    }
}

// Creator
class NotificationFactory {
    public static createNotification(type: string): Notification | null {
        switch (type.toLowerCase()) {
            case 'email':
                return new EmailNotification();
            case 'sms':
                return new SMSNotification();
            case 'push':
                return new PushNotification();
            default:
                return null;
        }
    }
}

// Usage
const email = NotificationFactory.createNotification('email');
email?.send('Hello World', 'user@example.com');

const sms = NotificationFactory.createNotification('sms');
sms?.send('Hello World', '+1234567890');
}