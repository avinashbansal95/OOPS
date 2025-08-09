// 1. 🔄 Adapter Pattern
// 🧠 Real-Life Example: Travel Plug Adapter
// You're traveling from the US (uses Type A plug) to Europe (needs Type C socket). You can't plug directly — so you use a plug adapter .

// Target Interface (what the client expects)
interface EuropeanSocket {
    plugIn(): void;
}

// Existing incompatible class (US Socket)
class USSocket {
    plugAmericanStyle(): void {
        console.log("⚡ US plug connected!");
    }
}

// Adapter that adapts USSocket to EuropeanSocket
class SocketAdapter implements EuropeanSocket {
    private usSocket: USSocket;

    constructor(usSocket: USSocket) {
        this.usSocket = usSocket;
    }

    plugIn(): void {
        console.log("🔌 Using adapter to convert EU plug to US...");
        this.usSocket.plugAmericanStyle(); // Delegate to original method
    }
}

// Client code
const usSocket = new USSocket();
const adapter = new SocketAdapter(usSocket);
adapter.plugIn(); 
// Output:
// 🔌 Using adapter to convert EU plug to US...
// ⚡ US plug connected!



// Why Use It?
// Integrates legacy/third-party systems.
// No need to change existing code.
// Promotes loose coupling .

