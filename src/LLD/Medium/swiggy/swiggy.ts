{

// Helper class provided by platform (just for logging)
class Helper05 {
    log(message: string): void {
        console.log(message);
    }
}

// Represents a food item (e.g. 'Veg Burger')
class FoodItem {
    constructor(public id: string) {}
}

// Represents a restaurant (e.g. 'Burger King')
class Restaurant {
    // Tracks total rating sum and count for overall restaurant rating
    private totalRatingSum: number = 0;
    private totalRatingCount: number = 0;

    // Tracks rating per food item: foodId -> { sum, count }
    private foodRatings: Map<string, { sum: number; count: number }> = new Map();

    constructor(public id: string) {}

    // Add a rating for this restaurant (affects overall rating)
    addRating(rating: number): void {
        this.totalRatingSum += rating;
        this.totalRatingCount++;
    }

    // Add a rating for a specific food item in this restaurant
    addFoodRating(foodItemId: string, rating: number): void {
        if (!this.foodRatings.has(foodItemId)) {
            this.foodRatings.set(foodItemId, { sum: 0, count: 0 });
        }
        const data = this.foodRatings.get(foodItemId)!;
        data.sum += rating;
        data.count++;
    }

    // Get average overall rating (rounded to 1 decimal using proper formula)
    getAverageRating(): number {
        if (this.totalRatingCount === 0) return 0;
        const avg = this.totalRatingSum / this.totalRatingCount;
        // Correct rounding formula as per requirements
        return Math.floor((avg + 0.05) * 10) / 10;
    }

    // Get average rating for a specific food item (rounded to 1 decimal using proper formula)
    getAverageFoodRating(foodItemId: string): number {
        const data = this.foodRatings.get(foodItemId);
        if (!data || data.count === 0) return 0;
        const avg = data.sum / data.count;
        // Correct rounding formula as per requirements
        return Math.floor((avg + 0.05) * 10) / 10;
    }

    // Check if restaurant has any ratings for a specific food item
    hasFoodRatings(foodItemId: string): boolean {
        const data = this.foodRatings.get(foodItemId);
        return data !== undefined && data.count > 0;
    }
}

// Represents an order (single food item per order)
class Order {
    constructor(
        public id: string,
        public restaurantId: string,
        public foodItemId: string
    ) {}
}

// Main System
class FoodOrderingSystem {
    private helper!: Helper05;

    // Map: orderId -> Order
    private orders: Map<string, Order> = new Map();

    // Map: restaurantId -> Restaurant
    private restaurants: Map<string, Restaurant> = new Map();

    // Map: foodItemId -> FoodItem (for completeness)
    private foodItems: Map<string, FoodItem> = new Map();

    constructor() {}

    // Initialize the system
    init(helper: Helper05): void {
        this.helper = helper;
    }

    // Places an order for a food item from a restaurant
    orderFood(orderId: string, restaurantId: string, foodItemId: string): void {
        // Create order
        const order = new Order(orderId, restaurantId, foodItemId);
        this.orders.set(orderId, order);

        // Ensure restaurant exists in our system
        if (!this.restaurants.has(restaurantId)) {
            this.restaurants.set(restaurantId, new Restaurant(restaurantId));
        }

        // Ensure food item exists in our system
        if (!this.foodItems.has(foodItemId)) {
            this.foodItems.set(foodItemId, new FoodItem(foodItemId));
        }

        this.helper.log(`Ordered ${foodItemId} from ${restaurantId} with order ${orderId}`);
    }

    // Rate an existing order (1 to 5 stars)
    rateOrder(orderId: string, rating: number): void {
        const order = this.orders.get(orderId);
        if (!order) return; // Should not happen per problem

        const restaurant = this.restaurants.get(order.restaurantId)!;

        // Step 1: Rate the restaurant overall
        restaurant.addRating(rating);

        // Step 2: Rate the food item in this restaurant
        restaurant.addFoodRating(order.foodItemId, rating);

        this.helper.log(`Rated order ${orderId} with ${rating} stars. Restaurant: ${order.restaurantId}, Food: ${order.foodItemId}`);
    }

    // Get top 20 restaurants based on average rating of a specific food item
    getTopRestaurantsByFood(foodItemId: string): string[] {
        const ratedRestaurants: { id: string; rating: number }[] = [];
        const unratedRestaurants: string[] = [];

        for (const restaurant of this.restaurants.values()) {
            if (restaurant.hasFoodRatings(foodItemId)) {
                const avgRating = restaurant.getAverageFoodRating(foodItemId);
                ratedRestaurants.push({ id: restaurant.id, rating: avgRating });
            } else {
                unratedRestaurants.push(restaurant.id);
            }
        }

        // Sort rated restaurants: by rating descending, then by restaurantId lexicographically ascending
        ratedRestaurants.sort((a, b) => {
            if (a.rating !== b.rating) {
                return b.rating - a.rating; // Descending by rating
            }
            return a.id.localeCompare(b.id); // Lexicographic ascending
        });

        // Sort unrated restaurants lexicographically
        unratedRestaurants.sort();

        // Combine: rated first, then unrated (as per requirements)
        const result = ratedRestaurants.map(r => r.id).concat(unratedRestaurants);

        // Extract top 20 restaurant IDs
        return result.slice(0, 20);
    }

    // Get top 20 restaurants by overall average rating
    getTopRatedRestaurants(): string[] {
        const result: { id: string; rating: number }[] = [];

        for (const restaurant of this.restaurants.values()) {
            const avgRating = restaurant.getAverageRating();
            result.push({ id: restaurant.id, rating: avgRating });
        }

        // Sort: by rating descending, then by restaurantId lexicographically ascending
        result.sort((a, b) => {
            if (a.rating !== b.rating) {
                return b.rating - a.rating;
            }
            return a.id.localeCompare(b.id);
        });

        // Return top 20 restaurant IDs
        return result.slice(0, 20).map(r => r.id);
    }
}

// Example usage and testing
function testSystem() {
    const helper = new Helper05();
    const system = new FoodOrderingSystem();
    
    system.init(helper);
    
    // Test the example from the problem
    system.orderFood('order-0', 'restaurant-0', 'food-1');
    system.rateOrder('order-0', 3);
    
    system.orderFood('order-1', 'restaurant-2', 'food-0');
    system.rateOrder('order-1', 1);
    
    system.orderFood('order-2', 'restaurant-1', 'food-0');
    system.rateOrder('order-2', 3);
    
    system.orderFood('order-3', 'restaurant-2', 'food-0');
    system.rateOrder('order-3', 5);
    
    system.orderFood('order-4', 'restaurant-0', 'food-0');
    system.rateOrder('order-4', 3);
    
    system.orderFood('order-5', 'restaurant-1', 'food-0');
    system.rateOrder('order-5', 4);
    
    system.orderFood('order-6', 'restaurant-0', 'food-1');
    system.rateOrder('order-6', 2);
    
    system.orderFood('order-7', 'restaurant-0', 'food-1');
    system.rateOrder('order-7', 2);
    
    system.orderFood('order-8', 'restaurant-1', 'food-0');
    system.rateOrder('order-8', 2);
    
    system.orderFood('order-9', 'restaurant-1', 'food-0');
    system.rateOrder('order-9', 4);
    
    console.log('Top restaurants for food-0:', system.getTopRestaurantsByFood('food-0'));
    console.log('Top restaurants for food-1:', system.getTopRestaurantsByFood('food-1'));
    console.log('Top rated restaurants:', system.getTopRatedRestaurants());
}

// Uncomment to test
// testSystem();

}