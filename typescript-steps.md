# ✅ Step-by-Step TypeScript Setup in VS Code

## 1. Initialize Node.js Project

Open the VS Code terminal in your folder and run:

```bash
npm init -y
```

This creates a `package.json` file.

---

## 2. Install TypeScript

```bash
npm install typescript --save-dev
```

---

## 3. Initialize TypeScript Config

```bash
npx tsc --init
```

This creates a `tsconfig.json` file.

---

## 4. Create `src` and `dist` Folders

Structure your project like this:

```
project-folder/
├── src/
│   └── index.ts
├── dist/
├── package.json
├── tsconfig.json
```

Put your TypeScript code in the `src/` folder.

---

## 5. Update `tsconfig.json` (Recommended)

Change or verify these fields:

```jsonc
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## 6. Compile TypeScript

Run:

```bash
npx tsc
```

This compiles everything in `src/` into `dist/`.

---

## 7. Run Compiled JavaScript

Use Node.js to run the compiled file:

```bash
node dist/index.js
```

---

## 🛠 Optional: Add Scripts to `package.json`

To make it easier:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsc --watch"
}
```

Then you can run:

```bash
npm run build   # compiles
npm run start   # runs the compiled JS
npm run dev     # watches TS files and recompiles on change
```