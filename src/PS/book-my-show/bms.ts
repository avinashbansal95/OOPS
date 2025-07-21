// Helper interface
{
interface Helper10 {
    print(message: string): void;
    println(message: string): void;
}

// Seat class to represent individual seats
class Seat {
    constructor(
        public row: number,
        public column: number,
        public isBooked: boolean = false,
        public ticketId: string | null = null
    ) {}

    book(ticketId: string): void {
        this.isBooked = true;
        this.ticketId = ticketId;
    }

    cancel(): void {
        this.isBooked = false;
        this.ticketId = null;
    }

    toString(): string {
        return `${this.row}-${this.column}`;
    }
}

// Screen class to manage seats and shows
class Screen {
    public seats: Seat[][];

    constructor(
        public screenIndex: number,
        public rows: number,
        public columns: number
    ) {
        this.seats = [];
        this.initializeSeats();
    }

    private initializeSeats(): void {
        for (let row = 0; row < this.rows; row++) {
            this.seats[row] = [];
            for (let col = 0; col < this.columns; col++) {
                this.seats[row][col] = new Seat(row, col);
            }
        }
    }

    getFreeSeatsCount(): number {
        let count = 0;
        for (const row of this.seats) {
            for (const seat of row) {
                if (!seat.isBooked) count++;
            }
        }
        return count;
    }

    findBestSeats(count: number): Seat[] {
        // Try to find continuous seats in the same row
        for (let row = 0; row < this.rows; row++) {
            let consecutive = 0;
            for (let col = 0; col < this.columns; col++) {
                if (!this.seats[row][col].isBooked) {
                    consecutive++;
                    if (consecutive === count) {
                        return this.seats[row].slice(col - count + 1, col + 1);
                    }
                } else {
                    consecutive = 0;
                }
            }
        }

        // If continuous seats not found, pick individual seats from lowest row, column
        const availableSeats: Seat[] = [];
        for (let row = 0; row < this.rows && availableSeats.length < count; row++) {
            for (let col = 0; col < this.columns && availableSeats.length < count; col++) {
                if (!this.seats[row][col].isBooked) {
                    availableSeats.push(this.seats[row][col]);
                }
            }
        }

        return availableSeats.length === count ? availableSeats : [];
    }

    bookSeats(seats: Seat[], ticketId: string): void {
        for (const seat of seats) {
            seat.book(ticketId);
        }
    }

    cancelSeats(ticketId: string): Seat[] {
        const cancelledSeats: Seat[] = [];
        for (const row of this.seats) {
            for (const seat of row) {
                if (seat.ticketId === ticketId) {
                    seat.cancel();
                    cancelledSeats.push(seat);
                }
            }
        }
        return cancelledSeats;
    }
}

// Show class to represent a movie show
class Show {
    public screen!: Screen;
    public bookedTickets: Map<string, Seat[]> = new Map();

    constructor(
        public showId: number,
        public movieId: number,
        public cinemaId: number,
        public startTime: number,
        public endTime: number
    ) {
        
    }

    book(ticketId: string, count: number): string[] {
        const availableSeats = this.screen.findBestSeats(count);
        if (availableSeats.length !== count) {
            return [];
        }

        this.screen.bookSeats(availableSeats, ticketId);
        this.bookedTickets.set(ticketId, availableSeats);
        return availableSeats.map(seat => seat.toString());
    }

    cancel(ticketId: string): boolean {
        if (!this.bookedTickets.has(ticketId)) {
            return false;
        }

        this.screen.cancelSeats(ticketId);
        this.bookedTickets.delete(ticketId);
        return true;
    }

    getFreeSeatsCount(): number {
        return this.screen.getFreeSeatsCount();
    }
}

// Cinema class to manage screens and shows
class Cinema {
    public screens: Screen[] = [];
    public shows: Show[] = [];

    constructor(
        public cinemaId: number,
        public cityId: number,
        screenCount: number,
        screenRows: number,
        screenColumns: number
    ) {
        for (let i = 0; i < screenCount; i++) {
            this.screens.push(new Screen(i + 1, screenRows, screenColumns));
        }
    }

    addShow(show: Show): void {
        this.shows.push(show);
    }

    getShowsForMovie(movieId: number): Show[] {
        return this.shows.filter(show => show.movieId === movieId)
            .sort((a, b) => {
                if (b.startTime !== a.startTime) {
                    return b.startTime - a.startTime;
                }
                return a.showId - b.showId;
            });
    }
}

// Main Movie Ticket Booking System
class MovieTicketBookingSystem {
    private cinemas: Map<number, Cinema> = new Map();
    private shows: Map<number, Show> = new Map();
    private helper: Helper10 = new MockHelper10();

    init(helper: Helper10): void {
        this.helper = helper;
        this.cinemas.clear();
        this.shows.clear();
    }

    addCinema(
        cinemaId: number,
        cityId: number,
        screenCount: number,
        screenRows: number,
        screenColumns: number
    ): void {
        const cinema = new Cinema(cinemaId, cityId, screenCount, screenRows, screenColumns);
        this.cinemas.set(cinemaId, cinema);
        this.helper.println(`Added cinema ${cinemaId} in city ${cityId} with ${screenCount} screens`);
    }

    addShow(
        showId: number,
        movieId: number,
        cinemaId: number,
        screenIndex: number,
        startTime: number,
        endTime: number
    ): void {
        const cinema = this.cinemas.get(cinemaId);
        if (!cinema) {
            this.helper.println(`Cinema ${cinemaId} not found`);
            return;
        }

        if (screenIndex < 1 || screenIndex > cinema.screens.length) {
            this.helper.println(`Invalid screen index ${screenIndex}`);
            return;
        }

        const screen = cinema.screens[screenIndex - 1];
        const show = new Show(
            showId,
            movieId,
            cinemaId,
            startTime,
            endTime
        );
        show.screen = screen;
        cinema.addShow(show);
        this.shows.set(showId, show);
        this.helper.println(`Added show ${showId} for movie ${movieId} in cinema ${cinemaId}`);
    }

    bookTicket(ticketId: string, showId: number, ticketsCount: number): string[] {
        const show = this.shows.get(showId);
        if (!show) {
            this.helper.println(`Show ${showId} not found`);
            return [];
        }

        const seats = show.book(ticketId, ticketsCount);
        if (seats.length > 0) {
            this.helper.println(`Booked ${ticketsCount} seats for ticket ${ticketId} in show ${showId}`);
        } else {
            this.helper.println(`Failed to book ${ticketsCount} seats for show ${showId}`);
        }
        return seats;
    }

    cancelTicket(ticketId: string): boolean {
        for (const show of this.shows.values()) {
            if (show.cancel(ticketId)) {
                this.helper.println(`Cancelled ticket ${ticketId}`);
                return true;
            }
        }
        this.helper.println(`Ticket ${ticketId} not found`);
        return false;
    }

    getFreeSeatsCount(showId: number): number {
        const show = this.shows.get(showId);
        return show ? show.getFreeSeatsCount() : 0;
    }

    listCinemas(movieId: number, cityId: number): number[] {
        const result: number[] = [];
        for (const cinema of this.cinemas.values()) {
            if (cinema.cityId === cityId) {
                for (const show of cinema.shows) {
                    if (show.movieId === movieId) {
                        result.push(cinema.cinemaId);
                        break;
                    }
                }
            }
        }
        return result.sort((a, b) => a - b);
    }

    listShows(movieId: number, cinemaId: number): number[] {
        const cinema = this.cinemas.get(cinemaId);
        if (!cinema) return [];

        return cinema.getShowsForMovie(movieId).map(show => show.showId);
    }
}

// Solution class as required by the problem statement
class Solution {
    private bookingSystem: MovieTicketBookingSystem = new MovieTicketBookingSystem();

    init(helper: Helper10): void {
        this.bookingSystem.init(helper);
    }

    addCinema(
        cinemaId: number,
        cityId: number,
        screenCount: number,
        screenRows: number,
        screenColumns: number
    ): void {
        this.bookingSystem.addCinema(cinemaId, cityId, screenCount, screenRows, screenColumns);
    }

    addShow(
        showId: number,
        movieId: number,
        cinemaId: number,
        screenIndex: number,
        startTime: number,
        endTime: number
    ): void {
        this.bookingSystem.addShow(showId, movieId, cinemaId, screenIndex, startTime, endTime);
    }

    bookTicket(ticketId: string, showId: number, ticketsCount: number): string[] {
        return this.bookingSystem.bookTicket(ticketId, showId, ticketsCount);
    }

    cancelTicket(ticketId: string): boolean {
        return this.bookingSystem.cancelTicket(ticketId);
    }

    getFreeSeatsCount(showId: number): number {
        return this.bookingSystem.getFreeSeatsCount(showId);
    }

    listCinemas(movieId: number, cityId: number): number[] {
        return this.bookingSystem.listCinemas(movieId, cityId);
    }

    listShows(movieId: number, cinemaId: number): number[] {
        return this.bookingSystem.listShows(movieId, cinemaId);
    }
}
// Mock Helper implementation for testing
class MockHelper10 implements Helper10 {
    logs: string[] = [];
    
    print(message: string): void {
        this.logs.push(message);
        console.log(message);
    }
    
    println(message: string): void {
        this.logs.push(message + '\n');
        console.log(message);
    }
}

// Test function
function testMovieTicketBookingSystem() {
    const helper = new MockHelper10();
    const solution = new Solution();

    // Initialize system
    solution.init(helper);
    helper.println("System initialized");

    // Add cinema
    solution.addCinema(0, 1, 4, 5, 10);
    helper.println("Cinema added");

    // Add shows
    solution.addShow(1, 4, 0, 1, 1710516108725, 1710523308725);
    solution.addShow(2, 11, 0, 3, 1710516108725, 1710523308725);
    helper.println("Shows added");

    // Test list functions
    helper.println("\nTesting list functions:");
    let cinemas = solution.listCinemas(0, 1);
    helper.println(`Cinemas showing movie 0 in city 1: ${cinemas} (Expected: [])`);
    
    let shows = solution.listShows(4, 0);
    helper.println(`Shows for movie 4 in cinema 0: ${shows} (Expected: [1])`);
    
    shows = solution.listShows(11, 0);
    helper.println(`Shows for movie 11 in cinema 0: ${shows} (Expected: [2])`);

    // Test booking
    helper.println("\nTesting booking:");
    let freeSeats = solution.getFreeSeatsCount(1);
    helper.println(`Free seats for show 1: ${freeSeats} (Expected: 50)`);
    
    let bookedSeats = solution.bookTicket('tkt-1', 1, 4);
    helper.println(`Booked seats: ${bookedSeats} (Expected: ["0-0", "0-1", "0-2", "0-3"])`);
    
    freeSeats = solution.getFreeSeatsCount(1);
    helper.println(`Free seats after booking: ${freeSeats} (Expected: 46)`);

    // Test cancellation
    helper.println("\nTesting cancellation:");
    let cancelResult = solution.cancelTicket('tkt-1');
    helper.println(`Cancellation result: ${cancelResult} (Expected: true)`);
    
    freeSeats = solution.getFreeSeatsCount(1);
    helper.println(`Free seats after cancellation: ${freeSeats} (Expected: 50)`);

    // Test edge cases
    helper.println("\nTesting edge cases:");
    // Booking more seats than available
    bookedSeats = solution.bookTicket('tkt-2', 1, 100);
    helper.println(`Booking 100 seats result: ${bookedSeats.length} (Expected: 0)`);
    
    // Cancelling non-existent ticket
    cancelResult = solution.cancelTicket('non-existent');
    helper.println(`Cancelling non-existent ticket: ${cancelResult} (Expected: false)`);
    
    // Getting seats for non-existent show
    freeSeats = solution.getFreeSeatsCount(999);
    helper.println(`Free seats for non-existent show: ${freeSeats} (Expected: 0)`);
}

// Run the tests
testMovieTicketBookingSystem();
}