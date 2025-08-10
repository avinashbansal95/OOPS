import { Mutex } from 'async-mutex';

// Helper interface
interface Helper04 {
    log(message: string): void;
}

// ============ Classes ============

class Order {
    constructor(
        public orderId: string,
        public destinationPincode: string,
        public sellerId: string,
        public productId: number,
        public productCount: number,
        public paymentMode: string
    ) {}
}

class Seller {
    private _inventory: Map<number, number> = new Map(); // productId → count
    private _orders: Order[] = [];

    constructor(
        public sellerId: string,
        public serviceablePincodes: string[],
        public paymentModes: string[]
    ) {}

    // Add inventory (delta)
    addInventory(productId: number, delta: number): void {
        const current = this._inventory.get(productId) || 0;
        this._inventory.set(productId, current + delta);
    }

    // Get current inventory
    getInventory(productId: number): number {
        return this._inventory.get(productId) || 0;
    }

    // Reduce inventory if sufficient stock
    reduceInventory(productId: number, count: number): boolean {
        const current = this._inventory.get(productId) || 0;
        if (current < count) return false;
        this._inventory.set(productId, current - count);
        return true;
    }

    // Check if seller delivers to pincode
    canDeliverTo(pincode: string): boolean {
        return this.serviceablePincodes.includes(pincode);
    }

    // Check if seller supports payment mode
    supportsPayment(paymentMode: string): boolean {
        return this.paymentModes.includes(paymentMode);
    }

    // Record order
    recordOrder(order: Order): void {
        this._orders.push(order);
    }
}

// ============ Main System ============

class InventoryMgmt {
    private sellers: Map<string, Seller> = new Map();
    private orders: Map<string, Order> = new Map();
    private productsCount: number = 0;
    private helper!: Helper04;
    private mutex: Mutex = new Mutex(); // For thread safety

    // Initialize system
    async init(helper: Helper04, productsCount: number): Promise<void> {
        const release = await this.mutex.acquire();
        try {
            this.helper = helper;
            this.productsCount = productsCount;
            this.sellers.clear();
            this.orders.clear();
        } finally {
            release();
        }
    }

    // Create a new seller
    async createSeller(
        sellerId: string,
        serviceablePincodes: string[],
        paymentModes: string[]
    ): Promise<void> {
        const release = await this.mutex.acquire();
        try {
            if (this.sellers.has(sellerId)) {
                return; // Assume idempotent; seller already exists
            }
            this.sellers.set(sellerId, new Seller(sellerId, serviceablePincodes, paymentModes));
            this.helper.log(`Seller ${sellerId} created with pincodes [${serviceablePincodes.join(', ')}] and payment modes [${paymentModes.join(', ')}]`);
        } finally {
            release();
        }
    }

    // Add inventory for a product by seller
    async addInventory(productId: number, sellerId: string, delta: number): Promise<void> {
        const release = await this.mutex.acquire();
        try {
            // Validate productId
            if (productId < 0 || productId >= this.productsCount) {
                return;
            }

            const seller = this.sellers.get(sellerId);
            if (!seller) return;

            seller.addInventory(productId, delta);
            this.helper.log(`Added ${delta} units of product ${productId} for seller ${sellerId}`);
        } finally {
            release();
        }
    }

    // Get inventory count
    async getInventory(productId: number, sellerId: string): Promise<number> {
        const release = await this.mutex.acquire();
        try {
            if (productId < 0 || productId >= this.productsCount) {
                return 0;
            }

            const seller = this.sellers.get(sellerId);
            return seller ? seller.getInventory(productId) : 0;
        } finally {
            release();
        }
    }

    // Create an order
    async createOrder(
        orderId: string,
        destinationPincode: string,
        sellerId: string,
        productId: number,
        productCount: number,
        paymentMode: string
    ): Promise<string> {
        const release = await this.mutex.acquire();
        try {
            // Validate productId
            if (productId < 0 || productId >= this.productsCount) {
                return "insufficient product inventory"; // or treat as inventory 0
            }

            const seller = this.sellers.get(sellerId);
            if (!seller) {
                return "insufficient product inventory";
            }

            // 1. Check pincode
            if (!seller.canDeliverTo(destinationPincode)) {
                return "pincode unserviceable";
            }

            // 2. Check payment mode
            if (!seller.supportsPayment(paymentMode)) {
                return "payment mode not supported";
            }

            // 3. Check inventory
            if (!seller.reduceInventory(productId, productCount)) {
                return "insufficient product inventory";
            }

            // 4. Create and record order
            const order = new Order(orderId, destinationPincode, sellerId, productId, productCount, paymentMode);
            this.orders.set(orderId, order);
            seller.recordOrder(order);

            this.helper.log(`Order ${orderId} placed successfully for ${productCount} units of product ${productId}`);
            return "order placed";
        } finally {
            release();
        }
    }
}