// Constants
const BOARD_SIZE = 8;
const MIN_INDEX = 0;
const MAX_INDEX = BOARD_SIZE - 1;

// Enums for better type safety
enum PieceColor {
    WHITE = 'W',
    BLACK = 'B'
}

enum PieceType {
    PAWN = 'P',
    ROOK = 'R',
    BISHOP = 'B',
    KNIGHT = 'H',
    QUEEN = 'Q',
    KING = 'K'
}

enum GameStatus {
    ONGOING = 0,
    WHITE_WINS = 1,
    BLACK_WINS = 2
}

enum GameTurn {
    WHITE = 0,
    BLACK = 1,
    GAME_OVER = -1
}

// Interfaces
interface Helper {
    println(msg: string): void;
}

interface Position {
    row: number;
    col: number;
}

interface MoveResult {
    success: boolean;
    capturedPiece: string;
    error?: string;
}

interface PieceMoveStrategy {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean;
}

// Base class to reduce code duplication
abstract class BasePiece implements PieceMoveStrategy {
    protected isValidPosition(pos: Position): boolean {
        return pos.row >= MIN_INDEX && pos.row <= MAX_INDEX && 
               pos.col >= MIN_INDEX && pos.col <= MAX_INDEX;
    }

    protected isPathClear(chessboard: string[][], start: Position, end: Position, 
                         rowStep: number, colStep: number): boolean {
        let currentRow = start.row + rowStep;
        let currentCol = start.col + colStep;

        while (currentRow !== end.row || currentCol !== end.col) {
            if (chessboard[currentRow][currentCol] !== "") {
                return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }
        return true;
    }

    protected mustActuallyMove(start: Position, end: Position): boolean {
        return !(start.row === end.row && start.col === end.col);
    }

    abstract movePiece(chessboard: string[][], start: Position, end: Position): boolean;
}

// Complete Piece Implementations
class Pawn extends BasePiece {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        const piece = chessboard[start.row][start.col];
        if (!piece || piece[1] !== PieceType.PAWN) return false;

        const color = piece[0] as PieceColor;
        const isWhite = color === PieceColor.WHITE;
        const direction = isWhite ? 1 : -1;
        const startingRow = isWhite ? 1 : 6;

        const rowDiff = end.row - start.row;
        const colDiff = Math.abs(end.col - start.col);

        // Vertical move (non-capture)
        if (colDiff === 0) {
            // Single move forward
            if (rowDiff === direction) {
                return chessboard[end.row][end.col] === "";
            }
            // Double move from starting position
            else if (rowDiff === 2 * direction && start.row === startingRow) {
                return chessboard[start.row + direction][start.col] === "" && 
                       chessboard[end.row][end.col] === "";
            }
            return false;
        }
        // Diagonal capture
        else if (colDiff === 1 && rowDiff === direction) {
            const target = chessboard[end.row][end.col];
            return target !== "" && target[0] !== color;
        }

        return false;
    }
}

class Rook extends BasePiece {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        // Rook must move straight (same row OR same column)
        if (start.row !== end.row && start.col !== end.col) return false;

        // Check path is clear
        if (start.row === end.row) { // Horizontal move
            const step = start.col < end.col ? 1 : -1;
            return this.isPathClear(chessboard, start, end, 0, step);
        } else { // Vertical move
            const step = start.row < end.row ? 1 : -1;
            return this.isPathClear(chessboard, start, end, step, 0);
        }
    }
}

class Bishop extends BasePiece {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        // Bishop must move diagonally (same absolute row and column difference)
        const rowDiff = Math.abs(end.row - start.row);
        const colDiff = Math.abs(end.col - start.col);

        if (rowDiff !== colDiff || rowDiff === 0) return false;

        // Determine direction of movement
        const rowStep = end.row > start.row ? 1 : -1;
        const colStep = end.col > start.col ? 1 : -1;

        return this.isPathClear(chessboard, start, end, rowStep, colStep);
    }
}

class Knight extends BasePiece {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        // Calculate row and column differences
        const rowDiff = Math.abs(end.row - start.row);
        const colDiff = Math.abs(end.col - start.col);

        // Knight moves in L-shape: (2,1) or (1,2) pattern
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
}

class Queen extends BasePiece {
    private rookStrategy = new Rook();
    private bishopStrategy = new Bishop();

    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        // Queen combines rook and bishop movements
        return this.rookStrategy.movePiece(chessboard, start, end) || 
               this.bishopStrategy.movePiece(chessboard, start, end);
    }
}

class King extends BasePiece {
    movePiece(chessboard: string[][], start: Position, end: Position): boolean {
        if (!this.isValidPosition(end) || !this.mustActuallyMove(start, end)) return false;

        // Calculate row and column differences
        const rowDiff = Math.abs(end.row - start.row);
        const colDiff = Math.abs(end.col - start.col);

        // King can move exactly one square in any direction
        return rowDiff <= 1 && colDiff <= 1;
    }
}

// Complete Piece Factory
class PieceFactory {
    private static instance: PieceFactory;
    private pieceCache: Map<PieceType, PieceMoveStrategy> = new Map();

    private constructor() {
        // Initialize piece instances (singleton pattern for performance)
        this.pieceCache.set(PieceType.PAWN, new Pawn());
        this.pieceCache.set(PieceType.ROOK, new Rook());
        this.pieceCache.set(PieceType.BISHOP, new Bishop());
        this.pieceCache.set(PieceType.KNIGHT, new Knight());
        this.pieceCache.set(PieceType.QUEEN, new Queen());
        this.pieceCache.set(PieceType.KING, new King());
    }

    static getInstance(): PieceFactory {
        if (!PieceFactory.instance) {
            PieceFactory.instance = new PieceFactory();
        }
        return PieceFactory.instance;
    }

    getPieceObj(type: string): PieceMoveStrategy | null {
        const pieceType = type as PieceType;
        return this.pieceCache.get(pieceType) || null;
    }

    // Alternative method for enum input
    getPieceByType(type: PieceType): PieceMoveStrategy | null {
        return this.pieceCache.get(type) || null;
    }
}

// Utility class for chess validation
class ChessValidator {
    static isValidPiece(piece: string): boolean {
        return piece.length === 2 && 
               Object.values(PieceColor).includes(piece[0] as PieceColor) && 
               Object.values(PieceType).includes(piece[1] as PieceType);
    }

    static isValidPosition(pos: Position): boolean {
        return pos.row >= MIN_INDEX && pos.row <= MAX_INDEX && 
               pos.col >= MIN_INDEX && pos.col <= MAX_INDEX;
    }

    static isSameColor(piece1: string, piece2: string): boolean {
        return piece1[0] === piece2[0];
    }

    static getOppositeColor(color: PieceColor): PieceColor {
        return color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    }

    static isValidCoordinates(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        return this.isValidPosition({ row: startRow, col: startCol }) && 
               this.isValidPosition({ row: endRow, col: endCol });
    }
}

// Enhanced Chess Game with better error handling and validation
class ChessGame {
    private status: GameStatus = GameStatus.ONGOING;
    private turn: GameTurn = GameTurn.WHITE;
    private chessBoard: string[][];
    private pieceFactory: PieceFactory;
    private moveHistory: string[] = [];

    constructor(chessBoard: string[][]) {
        this.validateInitialBoard(chessBoard);
        this.chessBoard = this.deepCopyBoard(chessBoard);
        this.pieceFactory = PieceFactory.getInstance();
    }

    private validateInitialBoard(board: string[][]): void {
        if (!board || board.length !== BOARD_SIZE) {
            throw new Error(`Board must have exactly ${BOARD_SIZE} rows`);
        }
        
        for (let i = 0; i < board.length; i++) {
            if (!board[i] || board[i].length !== BOARD_SIZE) {
                throw new Error(`Row ${i} must have exactly ${BOARD_SIZE} columns`);
            }
            
            for (let j = 0; j < board[i].length; j++) {
                const piece = board[i][j];
                if (piece !== "" && !ChessValidator.isValidPiece(piece)) {
                    throw new Error(`Invalid piece '${piece}' at position [${i}][${j}]`);
                }
            }
        }
    }

    private deepCopyBoard(board: string[][]): string[][] {
        return board.map(row => [...row]);
    }

    getNextTurn(): GameTurn {
        return this.turn;
    }

    getGameStatus(): GameStatus {
        return this.status;
    }

    getBoard(): string[][] {
        return this.deepCopyBoard(this.chessBoard);
    }

    getMoveHistory(): string[] {
        return [...this.moveHistory];
    }

    move(startRow: number, startCol: number, endRow: number, endCol: number): string {
        const result = this.executeMove(startRow, startCol, endRow, endCol);
        return result.success ? result.capturedPiece : "invalid";
    }

    private executeMove(startRow: number, startCol: number, endRow: number, endCol: number): MoveResult {
        const start: Position = { row: startRow, col: startCol };
        const end: Position = { row: endRow, col: endCol };

        // Validate game state and coordinates
        const validation = this.validateMove(start, end);
        if (!validation.success) {
            return validation;
        }

        const piece = this.chessBoard[start.row][start.col];
        
        // Validate piece movement
        if (!this.isValidPieceMove(piece, start, end)) {
            return { success: false, capturedPiece: "", error: "Invalid move for piece type" };
        }

        // Execute the move
        return this.performMove(piece, start, end);
    }

    private validateMove(start: Position, end: Position): MoveResult {
        // Check game status
        if (this.status !== GameStatus.ONGOING) {
            return { success: false, capturedPiece: "", error: "Game is over" };
        }

        // Check coordinates
        if (!ChessValidator.isValidPosition(start) || !ChessValidator.isValidPosition(end)) {
            return { success: false, capturedPiece: "", error: "Invalid coordinates" };
        }

        // Check piece exists
        const piece = this.chessBoard[start.row][start.col];
        if (!piece || !ChessValidator.isValidPiece(piece)) {
            return { success: false, capturedPiece: "", error: "No valid piece at start position" };
        }

        // Check turn
        const currentColor = piece[0] as PieceColor;
        const expectedTurn = currentColor === PieceColor.WHITE ? GameTurn.WHITE : GameTurn.BLACK;
        if (this.turn !== expectedTurn) {
            return { success: false, capturedPiece: "", error: "Not your turn" };
        }

        return { success: true, capturedPiece: "" };
    }

    private isValidPieceMove(piece: string, start: Position, end: Position): boolean {
        const pieceType = piece[1];
        const pieceObj = this.pieceFactory.getPieceObj(pieceType);
        
        if (!pieceObj) return false;
        
        // Check basic piece movement rules
        if (!pieceObj.movePiece(this.chessBoard, start, end)) return false;

        // Check if capturing own piece
        const targetPiece = this.chessBoard[end.row][end.col];
        if (targetPiece && ChessValidator.isSameColor(piece, targetPiece)) return false;

        return true;
    }

    private performMove(piece: string, start: Position, end: Position): MoveResult {
        const targetPiece = this.chessBoard[end.row][end.col];
        let capturedPiece = "";

        // Handle capture
        if (targetPiece) {
            capturedPiece = targetPiece;
            // Check if king was captured (game ends)
            if (targetPiece[1] === PieceType.KING) {
                const currentColor = piece[0] as PieceColor;
                this.status = currentColor === PieceColor.WHITE ? GameStatus.WHITE_WINS : GameStatus.BLACK_WINS;
                this.turn = GameTurn.GAME_OVER;
            }
        }

        // Execute the move
        this.chessBoard[end.row][end.col] = piece;
        this.chessBoard[start.row][start.col] = "";

        // Record move in history
        const moveNotation = `${piece}:${start.row}${start.col}-${end.row}${end.col}${capturedPiece ? `x${capturedPiece}` : ''}`;
        this.moveHistory.push(moveNotation);

        // Switch turns if game is ongoing
        if (this.status === GameStatus.ONGOING) {
            this.turn = this.turn === GameTurn.WHITE ? GameTurn.BLACK : GameTurn.WHITE;
        }

        return { success: true, capturedPiece };
    }

    // Utility methods
    getPieceAt(row: number, col: number): string {
        if (!ChessValidator.isValidPosition({ row, col })) return "";
        return this.chessBoard[row][col];
    }

    isPieceAt(row: number, col: number, color?: PieceColor, type?: PieceType): boolean {
        const piece = this.getPieceAt(row, col);
        if (!piece) return false;
        
        if (color && piece[0] !== color) return false;
        if (type && piece[1] !== type) return false;
        
        return true;
    }

    countPieces(color?: PieceColor, type?: PieceType): number {
        let count = 0;
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.chessBoard[row][col];
                if (piece) {
                    if (color && piece[0] !== color) continue;
                    if (type && piece[1] !== type) continue;
                    count++;
                }
            }
        }
        return count;
    }
}

// Complete Solution class with enhanced functionality
class Solution {
    private chessGame: ChessGame | null = null;

    init(helper: Helper, chessBoard: string[][]): void {
        try {
            this.chessGame = new ChessGame(chessBoard);
            helper.println("Chess game initialized successfully");
        } catch (error) {
            helper.println(`Failed to initialize chess game: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.chessGame = null;
        }
    }

    move(startRow: number, startCol: number, endRow: number, endCol: number): string {
        if (!this.chessGame) {
            return "invalid";
        }

        // Validate coordinates before passing to game
        if (!ChessValidator.isValidCoordinates(startRow, startCol, endRow, endCol)) {
            return "invalid";
        }

        return this.chessGame.move(startRow, startCol, endRow, endCol);
    }

    getNextTurn(): number {
        if (!this.chessGame) return -1;
        return this.chessGame.getNextTurn();
    }

    getGameStatus(): number {
        if (!this.chessGame) return -1;
        return this.chessGame.getGameStatus();
    }

    // Additional utility methods
    getBoard(): string[][] | null {
        if (!this.chessGame) return null;
        return this.chessGame.getBoard();
    }

    getMoveHistory(): string[] {
        if (!this.chessGame) return [];
        return this.chessGame.getMoveHistory();
    }

    getPieceAt(row: number, col: number): string {
        if (!this.chessGame) return "";
        return this.chessGame.getPieceAt(row, col);
    }

    countPieces(color?: string, type?: string): number {
        if (!this.chessGame) return 0;
        const pieceColor = color as PieceColor | undefined;
        const pieceType = type as PieceType | undefined;
        return this.chessGame.countPieces(pieceColor, pieceType);
    }
}

// Export all classes for potential external use
export {
    Solution,
    ChessGame,
    PieceFactory,
    ChessValidator,
    Pawn,
    Rook,
    Bishop,
    Knight,
    Queen,
    King,
    PieceColor,
    PieceType,
    GameStatus,
    GameTurn,
    Helper,
    Position,
    MoveResult
};