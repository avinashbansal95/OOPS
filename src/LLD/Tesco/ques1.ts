// Problem Statement 
// Tesco has a fleet of vehicles to deliver orders to the customer. Assigning the right set of
// orders to different sized vehicles is crucial for efficient delivery of orders. Different vehicle
// can fit different container sizes.
// Given c containers, along with their volumes [l,b,h], catalogue of product with its volume
// requirement (l,b,h) and an order with p products and its quantity.
// Example:
// Containers:
// SMALL -&gt; id=1, length=10, breadth=20, height=30
// MEDIUM -&gt; id=2, length=50, breadth=60, height=70
// LARGE -&gt; id=3, length=100, breadth=200, height=300
// Product:
// productId=1, length=2, breadth=4, height=10
// productId=2, length=10, breadth=30, height=4
// productId=3, length=5, breadth=6, height=7
// Order:
// productId=1, quantity=3
// productId=3, quantity=7

// Determine if that order fits in any of the given c containers and return the ID of the container
// that can be used.
// For the above sample of example SMALL container with id=1 should be returned.
// Minimum scope for written code 
// Written code should solve determination of a container for an order with multiple products with
// the assumption of order should fit into one container.
// Scenarios
// 1. The order fits into a container
// 2. Order doesn’t fit into any container
// Scenarios &amp; Considerations 
//  The order could be split into multiple containers considering one vehicle can carry
// multiple containers
// o Basic assumption here is that one vehicle carries one container and one order
// goes into one container

//  The product may have an extra requirement of no other item being placed on top of it.
// o Basic scenarios assumes no such constraints are applicable.
//  There could be edge cases where length of a particular product is too big to fit into a
// container, but overall volume wise it could indicate that it will fit.
// o Basic assumption is to work with just volume.

//  This problems also can involve integrations to get order details, container details and
// product volume details
// o Basic assumption is to abstract such integrations.
//  Scaling of this may be influenced by
// o Number of order lines in a product
// o Number of calls to determine the container
// o Size of the product catalogue.

{
class Tesco {
    private containers : Container [] = [];
    private productsMap : Map<number,Product> = new Map();
    private containerVolumeMap : Map<number,number> = new Map();
    constructor(containerData : Container[]) {
        this.intializeContainers(containerData);
        this.initializeContainerVolumeMap();
    }
    intializeContainers(containerData:Container[]):void {
        for(let i=0;i<containerData.length;i++) {
            let {id,length, breadth, height} = containerData[i]
            this.containers.push(new Container(id,length,breadth,height));
        }
    };

    initializeContainerVolumeMap():void {
        for(let i=0;i<this.containers.length;i++) {
            let {id,length,breadth,height} = this.containers[i];
            this.containerVolumeMap.set(id,length*breadth*height);
        }
    }

    addProducts(productData : Product[]):void {
        for(let i=0;i<productData.length;i++) {
            let {productId,length, breadth, height} = productData[i]
            this.productsMap.set(productId,new Product(productId,length,breadth,height));
        }
    };

    createOrder(orderData : OrderData[]) {
        //calculateTotalVolume
        let totalVolume : number = 0;
        for(let i=0;i<orderData.length;i++) {
            let vol = this.calculateVolume(orderData[i].productId,orderData[i].quantity);
            if(vol!== -1) {
                totalVolume += vol;
            }
        }
        // Find smallest container that fits
        let bestId = -1;
        let minVolume = Infinity;

        for (const [id, volume] of this.containerVolumeMap) {
            if (volume >= totalVolume && volume < minVolume) {
                minVolume = volume;
                bestId = id;
            }
        }
        return bestId;
    }

    calculateVolume(productId : number, quantity : number) : number {
        //get the product
        let product = this.productsMap.get(productId);
        if(!product)  return -1;
        //get dimensions
        let {length,breadth,height} = product;
        //calculate total volume
        let volume : number = (length * breadth * height * quantity);
        return volume
    }
}

class Container {
    constructor(public id : number ,public length:number, public breadth:number, public height:number) {}
}

class Product {
    constructor(public productId : number ,public length:number, public breadth:number, public height:number) {}
}

interface OrderData {
    productId : number,
    quantity : number
}


}