class InventoryMgmt {
    private sellers : Map<string,Seller> = new Map();
    private orders : Map<string,Order> = new Map();
    constructor(productCount:number) {};

    createSeller(sellerId : string,  serviceablePincodes: string[], paymentModes : string []) {
        this.sellers.set(sellerId,new Seller(sellerId,serviceablePincodes,paymentModes));
    }

    addInventory(productId:number,sellerId:string,delta:number) {
        //get the seller
        let seller = this.sellers.get(sellerId);
        seller?.products.push(new Product(productId,delta));
    }

    getInventory(productId:number,sellerId:string):number {
        //get the seller
        let seller = this.sellers.get(sellerId);
        //get products of seller
        let items = seller?.products || [];
        //find the product
        let product = items.find((e)=>e.productId == productId);
        if(product) {
            return product.delta;
        }
        return 0;
    }

    createOrder(orderId:string,destinationPincode:string,sellerId:string,productId:number,productCount:number,paymentMode:string):string {
        //get the seller
        let seller = this.sellers.get(sellerId);
        // check pincode unserviceable
        if(seller?.serviceablePincodes.indexOf(destinationPincode) == -1)
            return "pincode unserviceable";
        //check payment mode not supported
        if(seller?.paymentModes.indexOf(paymentMode) == -1)
            return "payment mode not supported";
        //insufficient product inventory
        let product = seller?.products.find((e)=>e.productId == productId);
        if(!product?.delta) return 'product not found'
        if(product?.delta < productCount)
            return "insufficient product inventory";

        //create order
        let order = new Order(orderId,destinationPincode,sellerId,productId,productCount,paymentMode);
        this.orders.set(orderId,order);
        seller?.orders.push(order);
        return "order placed";
    }

}

class Seller {
    private _products : Product [] = [];
    private _orders : Order [] = [];
    constructor(public sellerId : string,public serviceablePincodes: string[], public paymentModes : string []) {}
    get products():Product [] {
        return this._products;
    }

     get orders():Order [] {
        return this._orders;
    }
};

class Product {
    constructor(public productId : number, public delta : number){}
}

class Order {
    constructor(orderId : string,destinationPincode : string, sellerId:string,productId:number,productCount:number,paymentMode:string) {}
}