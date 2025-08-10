// Interface for helper logging
interface Helper09 {
    print(message: string): void;
    println(message: string): void;
}

// Character style information
interface CharacterStyle {
    char: string;
    fontName: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
}

// Individual character with styling
class StyledCharacter implements CharacterStyle {
    constructor(
        public char: string = "",
        public fontName: string = "",
        public fontSize: number = 0,
        public isBold: boolean = false,
        public isItalic: boolean = false
    ) {}

    // Create a copy of the character
    clone(): StyledCharacter {
        return new StyledCharacter(
            this.char,
            this.fontName,
            this.fontSize,
            this.isBold,
            this.isItalic
        );
    }

    // Check if character is empty (no content)
    isEmpty(): boolean {
        return this.char === "";
    }

    // Get formatted style string
    getStyleString(): string {
        if (this.isEmpty()) return "";
        
        let style = `${this.char}-${this.fontName}-${this.fontSize}`;
        if (this.isBold) style += "-b";
        if (this.isItalic) style += "-i";
        return style;
    }

    // Update character with new values
    update(char: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {
        this.char = char;
        this.fontName = fontName;
        this.fontSize = fontSize;
        this.isBold = isBold;
        this.isItalic = isItalic;
    }

    // Clear character content
    clear(): void {
        this.char = "";
        this.fontName = "";
        this.fontSize = 0;
        this.isBold = false;
        this.isItalic = false;
    }
}

// Document row management
class DocumentRow {
    private characters: StyledCharacter[] = [];

    // Get character at specific column
    getCharacterAt(col: number): StyledCharacter {
        if (col < 0 || col >= this.characters.length) {
            return new StyledCharacter(); // Return empty character
        }
        return this.characters[col];
    }

    // Insert character at specific position, shifting others right
    insertCharacter(col: number, char: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {
        const newChar = new StyledCharacter(char, fontName, fontSize, isBold, isItalic);
        
        // If column is beyond current length, fill with empty characters
        while (this.characters.length < col) {
            this.characters.push(new StyledCharacter());
        }
        
        // Insert at specified position
        if (col >= this.characters.length) {
            this.characters.push(newChar);
        } else {
            this.characters.splice(col, 0, newChar);
        }
    }

    // Delete character at specific position, shifting others left
    deleteCharacter(col: number): boolean {
        if (col < 0 || col >= this.characters.length || this.characters[col].isEmpty()) {
            return false;
        }
        
        this.characters.splice(col, 1);
        return true;
    }

    // Get all characters as string
    getText(): string {
        let text = "";
        for (const char of this.characters) {
            text += char.char;
        }
        return text;
    }

    // Get actual length (excluding trailing empty characters)
    getActualLength(): number {
        let length = this.characters.length;
        while (length > 0 && this.characters[length - 1].isEmpty()) {
            length--;
        }
        return length;
    }

    // Check if row is empty
    isEmpty(): boolean {
        return this.getActualLength() === 0;
    }

    // Clear row
    clear(): void {
        this.characters = [];
    }
}

// Main text editor document
class TextEditorDocument {
    private rows: DocumentRow[] = [];
    private helper: Helper09;

    constructor(helper: Helper09) {
        this.helper = helper;
        this.helper.println("Text editor document initialized");
    }

    // Ensure sufficient rows exist
    private ensureRowExists(row: number): void {
        while (this.rows.length <= row) {
            this.rows.push(new DocumentRow());
        }
    }

    // Add character at specified position
    addCharacter(row: number, col: number, char: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {
        // Validate input
        if (row < 0 || col < 0 || row > 1000 || col > 1000) {
            this.helper.println(`Invalid position: row=${row}, col=${col}`);
            return;
        }

        // Ensure row exists
        this.ensureRowExists(row);
        
        // Insert character
        this.rows[row].insertCharacter(col, char, fontName, fontSize, isBold, isItalic);
        
        this.helper.println(`Added character '${char}' at position [${row}][${col}]`);
    }

    // Get style of character at position
    getStyle(row: number, col: number): string {
        if (row < 0 || col < 0 || row >= this.rows.length) {
            return "";
        }

        const character = this.rows[row].getCharacterAt(col);
        return character.getStyleString();
    }

    // Read entire line as string
    readLine(row: number): string {
        if (row < 0 || row >= this.rows.length) {
            return "";
        }

        return this.rows[row].getText();
    }

    // Delete character at position
    deleteCharacter(row: number, col: number): boolean {
        if (row < 0 || col < 0 || row >= this.rows.length) {
            return false;
        }

        const success = this.rows[row].deleteCharacter(col);
        if (success) {
            this.helper.println(`Deleted character at position [${row}][${col}]`);
        }
        return success;
    }

    // Get document statistics
    getDocumentStats(): { rows: number; totalCharacters: number; nonEmptyRows: number } {
        let totalCharacters = 0;
        let nonEmptyRows = 0;

        for (const row of this.rows) {
            const rowLength = row.getActualLength();
            totalCharacters += rowLength;
            if (rowLength > 0) {
                nonEmptyRows++;
            }
        }

        return {
            rows: this.rows.length,
            totalCharacters,
            nonEmptyRows
        };
    }

    // Clear entire document
    clearDocument(): void {
        this.rows = [];
        this.helper.println("Document cleared");
    }

    // Get character at specific position (for debugging)
    getCharacterAt(row: number, col: number): StyledCharacter | null {
        if (row < 0 || col < 0 || row >= this.rows.length) {
            return null;
        }
        return this.rows[row].getCharacterAt(col);
    }
}

// Main Solution class
class Solution {
    private document!: TextEditorDocument;

    init(helper: Helper09): void {
        this.document = new TextEditorDocument(helper);
    }

    addCharacter(row: number, column: number, ch: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {
        if (!this.document) {
            throw new Error("Document not initialized. Call init() first.");
        }
        this.document.addCharacter(row, column, ch, fontName, fontSize, isBold, isItalic);
    }

    getStyle(row: number, col: number): string {
        if (!this.document) {
            return "";
        }
        return this.document.getStyle(row, col);
    }

    readLine(row: number): string {
        if (!this.document) {
            return "";
        }
        return this.document.readLine(row);
    }

    deleteCharacter(row: number, col: number): boolean {
        if (!this.document) {
            return false;
        }
        return this.document.deleteCharacter(row, col);
    }

    // Additional utility methods
    getDocumentStats(): { rows: number; totalCharacters: number; nonEmptyRows: number } | null {
        if (!this.document) {
            return null;
        }
        return this.document.getDocumentStats();
    }

    clearDocument(): void {
        if (this.document) {
            this.document.clearDocument();
        }
    }
}

// Test helper implementation
class TestHelper implements Helper09 {
    print(message: string): void {
        process.stdout.write(message);
    }
    
    println(message: string): void {
        console.log(message);
    }
}

// Comprehensive test function
function runTextEditorTests(): void {
    const helper = new TestHelper();
    const obj = new Solution();
    
    console.log("=== Text Editor Test Results ===\n");
    
    // Initialize
    obj.init(helper);
    
    // Test the given example
    console.log("1. Testing basic operations:");
    obj.addCharacter(0, 0, 'g', 'Cambria', 17, true, true);
    obj.addCharacter(1, 0, 'y', 'Century Gothic', 14, true, true);
    obj.addCharacter(1, 1, 'h', 'Courier New', 22, false, false);
    obj.addCharacter(1, 2, 'y', 'Georgia', 14, false, false);
    
    console.log("getStyle(0,0):", obj.getStyle(0, 0)); // Should be 'g-Cambria-17-b-i'
    console.log("readLine(0):", obj.readLine(0)); // Should be 'g'
    
    // Test insertion
    console.log("\n2. Testing character insertion:");
    obj.addCharacter(0, 0, 'q', 'Arial', 21, false, true);
    console.log("readLine(0) after inserting 'q' at position 0:", obj.readLine(0)); // Should be 'qg'
    console.log("readLine(1):", obj.readLine(1)); // Should be 'yhy'
    
    // Test deletion
    console.log("\n3. Testing character deletion:");
    console.log("deleteCharacter(1, 1):", obj.deleteCharacter(1, 1)); // Should be true
    console.log("readLine(1) after deletion:", obj.readLine(1)); // Should be 'yy'
    console.log("deleteCharacter(1, 4):", obj.deleteCharacter(1, 4)); // Should be false
    
    // Test edge cases
    console.log("\n4. Testing edge cases:");
    console.log("getStyle(10, 10) (non-existent):", obj.getStyle(10, 10)); // Should be ""
    console.log("readLine(10) (non-existent):", obj.readLine(10)); // Should be ""
    
    // Test large row/column
    console.log("\n5. Testing large positions:");
    obj.addCharacter(50, 100, 'x', 'Times', 16, true, false);
    console.log("Added character at row 50, col 100");
    console.log("getStyle(50, 100):", obj.getStyle(50, 100));
    
    // Show document statistics
    const stats = obj.getDocumentStats();
    console.log("\n6. Document Statistics:");
    console.log("Total rows:", stats?.rows);
    console.log("Total characters:", stats?.totalCharacters);
    console.log("Non-empty rows:", stats?.nonEmptyRows);
}

// Export for external use
export { 
    Solution, 
    TextEditorDocument, 
    StyledCharacter, 
    DocumentRow, 
    Helper09, 
    TestHelper 
};

// Uncomment to run tests
// runTextEditorTests();