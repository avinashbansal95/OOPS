// # Observer Design Pattern: Complete TypeScript Implementation

// ## Example 1: News Agency & Subscribers

// ```typescript
// // Observer Interface
// interface Observer {
//   update(news: string): void;
//   getName(): string;
// }

// // Subject Interface
// interface Subject {
//   subscribe(observer: Observer): void;
//   unsubscribe(observer: Observer): void;
//   notify(news: string): void;
// }

// // Concrete Subject: News Agency
// class NewsAgency implements Subject {
//   private observers: Observer[] = [];
//   private latestNews: string = '';

//   subscribe(observer: Observer): void {
//     const isExists = this.observers.includes(observer);
//     if (isExists) {
//       console.log(`${observer.getName()} is already subscribed.`);
//       return;
//     }

//     this.observers.push(observer);
//     console.log(`✅ ${observer.getName()} subscribed to news updates.`);
//   }

//   unsubscribe(observer: Observer): void {
//     const index = this.observers.indexOf(observer);
//     if (index === -1) {
//       console.log(`${observer.getName()} is not subscribed.`);
//       return;
//     }

//     this.observers.splice(index, 1);
//     console.log(`❌ ${observer.getName()} unsubscribed from news updates.`);
//   }

//   notify(news: string): void {
//     console.log(`\n📢 BREAKING NEWS: ${news}`);
//     console.log(`📡 Notifying ${this.observers.length} subscribers...\n`);
    
//     this.observers.forEach(observer => {
//       observer.update(news);
//     });
//   }

//   publishNews(news: string): void {
//     this.latestNews = news;
//     this.notify(news);
//   }

//   getLatestNews(): string {
//     return this.latestNews;
//   }
// }

// // Concrete Observers
// class TVChannel implements Observer {
//   private name: string;

//   constructor(name: string) {
//     this.name = name;
//   }

//   update(news: string): void {
//     console.log(`📺 ${this.name} TV: Broadcasting "${news}"`);
//     this.displayOnScreen(news);
//   }

//   getName(): string {
//     return this.name;
//   }

//   private displayOnScreen(news: string): void {
//     console.log(`🔴 LIVE: ${news.toUpperCase



// Observer Interface
interface Observer {
  update(news: string): void;
  getName(): string;
}

// Subject Interface
interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(news: string): void;
}

// Concrete Subject: News Agency
class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private latestNews: string = '';

  subscribe(observer: Observer): void {
    const isExists = this.observers.includes(observer);
    if (isExists) {
      console.log(`${observer.getName()} is already subscribed.`);
      return;
    }

    this.observers.push(observer);
    console.log(`✅ ${observer.getName()} subscribed to news updates.`);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log(`${observer.getName()} is not subscribed.`);
      return;
    }

    this.observers.splice(index, 1);
    console.log(`❌ ${observer.getName()} unsubscribed from news updates.`);
  }

  notify(news: string): void {
    console.log(`\n📢 BREAKING NEWS: ${news}`);
    console.log(`📡 Notifying ${this.observers.length} subscribers...\n`);
    
    this.observers.forEach(observer => {
      observer.update(news);
    });
  }

  publishNews(news: string): void {
    this.latestNews = news;
    this.notify(news);
  }

  getLatestNews(): string {
    return this.latestNews;
  }
}

// Concrete Observers
class TVChannel implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(news: string): void {
    console.log(`📺 ${this.name} TV: Broadcasting "${news}"`);
    this.displayOnScreen(news);
  }

  getName(): string {
    return this.name;
  }

  private displayOnScreen(news: string): void {
    console.log(`🔴 LIVE: ${news.toUpperCase()}`);
  }
}

class WebPortal implements Observer {
  private name: string;
  private articles: string[] = [];

  constructor(name: string) {
    this.name = name;
  }

  update(news: string): void {
    console.log(`💻 ${this.name}: Publishing article "${news}"`);
    this.articles.push(news);
    this.publishArticle(news);
  }

  getName(): string {
    return this.name;
  }

  private publishArticle(news: string): void {
    console.log(`🌐 Article published at ${new Date().toLocaleTimeString()}`);
    console.log(`📊 Total articles: ${this.articles.length}`);
  }

  getArticles(): string[] {
    return [...this.articles];
  }
}

class MobileApp implements Observer {
  private name: string;
  private notifications: Array<{news: string, timestamp: Date}> = [];

  constructor(name: string) {
    this.name = name;
  }

  update(news: string): void {
    console.log(`📱 ${this.name}: Sending push notification "${news}"`);
    this.sendPushNotification(news);
  }

  getName(): string {
    return this.name;
  }

  private sendPushNotification(news: string): void {
    this.notifications.push({
      news,
      timestamp: new Date()
    });
    console.log(`🔔 Push notification sent to mobile users`);
    console.log(`📈 Total notifications: ${this.notifications.length}`);
  }

  getNotifications(): Array<{news: string, timestamp: Date}> {
    return [...this.notifications];
  }
}

// Usage Example
function demonstrateNewsAgency() {
  console.log('🏢 News Agency Observer Pattern Demo\n');

  // Create news agency (subject)
  const newsAgency = new NewsAgency();

  // Create subscribers (observers)
  const cnnTV = new TVChannel('CNN');
  const bbcPortal = new WebPortal('BBC Online');
  const newsApp = new MobileApp('NewsApp');

  // Subscribe to news updates
  newsAgency.subscribe(cnnTV);
  newsAgency.subscribe(bbcPortal);
  newsAgency.subscribe(newsApp);

  // Publish news
  newsAgency.publishNews('Major earthquake hits California!');
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  newsAgency.publishNews('Stock market reaches all-time high!');

  console.log('\n' + '='.repeat(50) + '\n');

  // Unsubscribe one observer
  newsAgency.unsubscribe(cnnTV);
  newsAgency.publishNews('New COVID variant discovered!');

  console.log('\n' + '='.repeat(50) + '\n');

  // Try to subscribe same observer again
  newsAgency.subscribe(bbcPortal);
}

// Run the demo
demonstrateNewsAgency();

{
    // Observer
interface TemperatureObserver {
    update(temp: number): void;
}

// Subject
class TemperatureSensor {
    private observers: TemperatureObserver[] = [];
    private _temperature: number = 0;

    get temperature(): number {
        return this._temperature;
    }

    set temperature(temp: number) {
        this._temperature = temp;
        this.notifyObservers();
    }

    addObserver(observer: TemperatureObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: TemperatureObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    private notifyObservers(): void {
        this.observers.forEach(obs => obs.update(this._temperature));
    }
}

// Concrete Observers
class LivingRoomDisplay implements TemperatureObserver {
    update(temp: number): void {
        console.log(`🏠 Living Room: Temperature is now ${temp}°C`);
    }
}

class PhoneAppDisplay implements TemperatureObserver {
    update(temp: number): void {
        console.log(`📱 Phone App: 🌡️ Current temp: ${temp}°C`);
    }
}

class AirConditioner implements TemperatureObserver {
    update(temp: number): void {
        if (temp > 30) {
            console.log(`❄️ Air Conditioner: Turning ON (too hot: ${temp}°C)`);
        } else {
            console.log(`💤 Air Conditioner: Maintaining comfort at ${temp}°C`);
        }
    }
}
const sensor = new TemperatureSensor();

const livingRoom = new LivingRoomDisplay();
const phone = new PhoneAppDisplay();
const ac = new AirConditioner();

sensor.addObserver(livingRoom);
sensor.addObserver(phone);
sensor.addObserver(ac);

// Simulate temp changes
sensor.temperature = 25;
sensor.temperature = 32;
sensor.temperature = 28;
}