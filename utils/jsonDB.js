const fs = require("fs").promises;
const path = require("path");

// Get the path of a JSON file
function getFilePath(filename){
    return path.join(__dirname, "..", "data", filename);
}


async function readData(filename){
    try {
        const filePath = getFilePath(filename);
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];

        }
        throw error;
    }
}

async function writeData(filename, data) {
    const filePath = getFilePath(filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
module.exports = { readData, writeData };