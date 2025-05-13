import fs from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "src");
const outputFile = path.resolve(__dirname, "project-export.txt");

const allowedExtensions = [".ts", ".tsx", ".css", ".json", ".mjs"];
const excludedFolders = ["node_modules", ".git", ".idea"];

function walkDir(dir: string, callback: (filePath: string) => void) {
    fs.readdirSync(dir).forEach((filename) => {
        const filePath = path.join(dir, filename);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!excludedFolders.includes(filename)) {
                walkDir(filePath, callback);
            }
        } else if (allowedExtensions.includes(path.extname(filename))) {
            callback(filePath);
        }
    });
}

function writeStructureAndFiles() {
    const outputLines: string[] = [];

    outputLines.push("# 📁 Структура проекта\n");

    function writeTree(dir: string, depth = 0) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            const indent = "│  ".repeat(depth) + (depth ? "├─ " : "");

            if (stat.isDirectory()) {
                outputLines.push(`${indent}${file}/`);
                writeTree(filePath, depth + 1);
            } else {
                outputLines.push(`${indent}${file}`);
            }
        }
    }

    writeTree(projectRoot);

    outputLines.push("\n# 📄 Ключевые файлы и их содержимое\n");

    walkDir(projectRoot, (filePath) => {
        const relPath = path.relative(projectRoot, filePath);
        const content = fs.readFileSync(filePath, "utf-8");
        outputLines.push(`\n\n===== 📁 ${relPath} =====\n`);
        outputLines.push(content);
    });

    fs.writeFileSync(outputFile, outputLines.join("\n"), "utf-8");
    console.log(`✅ Файл успешно записан в ${outputFile}`);
}

writeStructureAndFiles();
