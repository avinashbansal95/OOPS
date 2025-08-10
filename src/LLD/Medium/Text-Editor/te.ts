{
interface Helper09 {
    print(message: string): void;
    println(message: string): void;
}

class CharacterStyle {
    constructor(
        public char: string = "",
        public fontName: string = "",
        public fontSize: number = 0,
        public isBold: boolean = false,
        public isItalic: boolean = false
    ) {}
}

class TextEditor {
    private document: CharacterStyle[][] = [];

    constructor() {}

    addCharacter(row: number, col: number, ch: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {

        // Validate input bounds
        if (row < 0 || col < 0 || row > 1000 || col > 1000) {
            return;
        }
        // Add new rows if needed
        while (this.document.length <= row) {
            this.document.push([]);
        }

        const currentRow = this.document[row];

         // Fill gaps with empty characters if column is beyond current length
        while (currentRow.length < col) {
            currentRow.push(new CharacterStyle());
        }

        // If column is at the end, append
        if (col >= currentRow.length) {
            currentRow.push(new CharacterStyle(ch, fontName, fontSize, isBold, isItalic));
        } else {
            // Insert and shift right
            currentRow.splice(col, 0, new CharacterStyle(ch, fontName, fontSize, isBold, isItalic));
        }
    }

    getStyle(row: number, col: number): string {
        if (!this.document[row] || !this.document[row][col] || this.document[row][col].char === "") {
            return "";
        }

        const style = this.document[row][col];
        let result = `${style.char}-${style.fontName}-${style.fontSize}`;
        if (style.isBold) result += "-b";
        if (style.isItalic) result += "-i";
        return result;
    }

    readLine(row: number): string {
        if (!this.document[row]) return "";
        return this.document[row].map(c => c.char).join("");
    }

    deleteCharacter(row: number, col: number): boolean {
        const currentRow = this.document[row];
        if (!currentRow || col >= currentRow.length || currentRow[col].char === "") {
            return false;
        }

        // Remove and shift left
        currentRow.splice(col, 1);
        return true;
    }
}

class Solution {
    private editor!: TextEditor;
    private helper!: Helper09;

    init(helper: Helper09): void {
        this.editor = new TextEditor();
        this.helper = helper;
    }

    addCharacter(row: number, col: number, ch: string, fontName: string, fontSize: number, isBold: boolean, isItalic: boolean): void {
        this.editor.addCharacter(row, col, ch, fontName, fontSize, isBold, isItalic);
    }

    getStyle(row: number, col: number): string {
        return this.editor.getStyle(row, col);
    }

    readLine(row: number): string {
        return this.editor.readLine(row);
    }

    deleteCharacter(row: number, col: number): boolean {
        return this.editor.deleteCharacter(row, col);
    }
}


class MockHelper implements Helper09 {
    print(message: string): void {
        console.log(message);
    }
    println(message: string): void {
        console.log(message);
    }
}

const helper = new MockHelper();
const solution = new Solution();
solution.init(helper);

solution.addCharacter(0, 0, 'g', 'Cambria', 17, true, true);
solution.addCharacter(1, 0, 'y', 'Century Gothic', 14, true, true);
solution.addCharacter(1, 1, 'h', 'Courier New', 22, false, false);
solution.addCharacter(1, 2, 'y', 'Georgia', 14, false, false);

console.log(solution.getStyle(0, 0)); // Expected: g-Cambria-17-b-i
console.log(solution.readLine(0));    // Expected: "g"
solution.addCharacter(0, 0, 'q', 'Arial', 21, false, true);
console.log(solution.readLine(0));    // Expected: "qg"
console.log(solution.readLine(1));    // Expected: "yhy"
console.log(solution.deleteCharacter(1, 1)); // Expected: true
console.log(solution.readLine(1));    // Expected: "yy"
console.log(solution.deleteCharacter(1, 4)); // Expected: false

}