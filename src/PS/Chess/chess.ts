{
interface Helper {
    println(msg: string): void;
}

type GameStatus = 0 | 1 | 2;
type GameTurn = 0 | 1 | -1;

interface PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean;
}

class Pawn implements PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        const piece = chessboard[startRow][startCol];
        if (!piece || piece[1] !== 'P') return false;

        const color = piece[0];
        const isWhite = color === 'W';
        const direction = isWhite ? 1 : -1;
        const startingRow = isWhite ? 1 : 6;

        const rowDiff = endRow - startRow;
        const colDiff = Math.abs(endCol - startCol);

        // Vertical move (non-capture)
        if (colDiff === 0) {
            // Single move forward
            if (rowDiff === direction) {
                return chessboard[endRow][endCol] === "";
            }
            // Double move from starting position
            else if (rowDiff === 2 * direction && startRow === startingRow) {
                return chessboard[startRow + direction][startCol] === "" && 
                       chessboard[endRow][endCol] === "";
            }
            return false;
        }
        // Diagonal capture
        else if (colDiff === 1 && rowDiff === direction) {
            const target = chessboard[endRow][endCol];
            return target !== "" && target[0] !== color;
        }

        return false;
    }
}

class Rook implements PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // Check bounds
        if (endRow > 7 || endRow < 0 || endCol > 7 || endCol < 0) {
            return false;
        }

        // Rook must move straight (same row OR same column)
        if (startRow !== endRow && startCol !== endCol) {
            return false;
        }

        // Must actually move
        if (startRow === endRow && startCol === endCol) {
            return false;
        }

        // Check path is clear
        if (startRow === endRow) { // Horizontal move
            const step = startCol < endCol ? 1 : -1;
            for (let col = startCol + step; col !== endCol; col += step) {
                if (chessboard[startRow][col] !== "") {
                    return false; // Path blocked
                }
            }
        } else { // Vertical move
            const step = startRow < endRow ? 1 : -1;
            for (let row = startRow + step; row !== endRow; row += step) {
                if (chessboard[row][startCol] !== "") {
                    return false; // Path blocked
                }
            }
        }
        return true;
    }
}

class Bishop implements PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // Check if move is out of bounds
        if (endRow > 7 || endRow < 0 || endCol > 7 || endCol < 0) {
            return false;
        }

        // Bishop must move diagonally (same absolute row and column difference)
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);

        if (rowDiff !== colDiff) {
            return false;
        }

        // Bishop must actually move
        if (rowDiff === 0) {
            return false;
        }

        // Determine direction of movement
        const rowStep = endRow > startRow ? 1 : -1;
        const colStep = endCol > startCol ? 1 : -1;

        // Check if path is clear (excluding destination)
        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow && currentCol !== endCol) {
            if (chessboard[currentRow][currentCol] !== "") {
                return false; // Path is blocked
            }
            currentRow += rowStep;
            currentCol += colStep;
        }
        return true;
    }
}

class Knight implements PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // Check if move is out of bounds
        if (endRow > 7 || endRow < 0 || endCol > 7 || endCol < 0) {
            return false;
        }

        // Calculate row and column differences
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);

        // Knight moves in L-shape: (2,1) or (1,2) pattern
        const isLegalKnightMove = (rowDiff === 2 && colDiff === 1) || 
                                 (rowDiff === 1 && colDiff === 2);

        return isLegalKnightMove;
    }
}

class Queen implements PieceMoveStrategy {
    private rookStrategy = new Rook();
    private bishopStrategy = new Bishop();

    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        return this.rookStrategy.movePiece(chessboard, startRow, startCol, endRow, endCol) || 
               this.bishopStrategy.movePiece(chessboard, startRow, startCol, endRow, endCol);
    }
}

class King implements PieceMoveStrategy {
    movePiece(chessboard: string[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        // Check if move is out of bounds
        if (endRow > 7 || endRow < 0 || endCol > 7 || endCol < 0) {
            return false;
        }

        // Calculate row and column differences
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);

        // King can move exactly one square in any direction
        if (rowDiff > 1 || colDiff > 1) {
            return false;
        }

        // King must actually move
        if (rowDiff === 0 && colDiff === 0) {
            return false;
        }
        return true;
    }
}

class PieceFactory {
    getPieceObj(type: string): PieceMoveStrategy | null {
        switch(type) {
            case 'P': return new Pawn();
            case 'R': return new Rook();
            case 'B': return new Bishop();
            case 'H': return new Knight();
            case 'Q': return new Queen();
            case 'K': return new King();
            default: return null;
        }
    }
}

class ChessGame {
    private status: GameStatus = 0;
    private turn: GameTurn = 0;
    private chessBoard: string[][];

    constructor(chessBoard: string[][]) {
        this.chessBoard = chessBoard.map(row => [...row]);
    }

    getNextTurn(): GameTurn {
        return this.turn;
    }

    getGameStatus(): GameStatus {
        return this.status;
    }

    move(startRow: number, startCol: number, endRow: number, endCol: number): string {
        // Check if game is already over
        if (this.status !== 0) return "invalid";

        // Validate coordinates
        if (startRow < 0 || startRow > 7 || startCol < 0 || startCol > 7 ||
            endRow < 0 || endRow > 7 || endCol < 0 || endCol > 7) {
            return "invalid";
        }

        const piece = this.chessBoard[startRow][startCol];
        if (!piece) return "invalid";

        // Check if moving correct color piece
        const currentColor = piece[0];
        if ((currentColor === 'W' && this.turn !== 0) || 
            (currentColor === 'B' && this.turn !== 1)) {
            return "invalid";
        }

        const pieceType = piece[1];
        const pieceObj = new PieceFactory().getPieceObj(pieceType);
        if (!pieceObj || !pieceObj.movePiece(this.chessBoard, startRow, startCol, endRow, endCol)) {
            return "invalid";
        }

        const targetPiece = this.chessBoard[endRow][endCol];
        let captured = "";

        // Check if capturing own piece
        if (targetPiece && targetPiece[0] === currentColor) {
            return "invalid";
        }

        // Perform move
        if (targetPiece) {
            captured = targetPiece;
            // Check if king was captured
            if (targetPiece[1] === 'K') {
                this.status = currentColor === 'W' ? 1 : 2;
                this.turn = -1;
            }
        }

        this.chessBoard[endRow][endCol] = piece;
        this.chessBoard[startRow][startCol] = "";

        // Only change turn if game is still ongoing
        if (this.status === 0) {
            this.turn = currentColor === 'W' ? 1 : 0;
        }

        return captured;
    }
}

class Solution {
    private chessGame: ChessGame | null = null;

    init(helper: Helper, chessBoard: string[][]) {
        this.chessGame = new ChessGame(chessBoard);
        helper.println("Chess game initialized");
    }

    move(startRow: number, startCol: number, endRow: number, endCol: number): string {
        if (!this.chessGame) return "invalid";
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
}
}