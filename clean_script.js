
const fs = require('fs');
const path = 'c:\\Users\\raffy\\OneDrive\\Desktop\\Portafoglio\\script.js';

try {
    let content = fs.readFileSync(path, 'utf8'); // Try utf8 first

    // Check if it looks like it has null bytes (simple check)
    if (content.indexOf('\u0000') !== -1) {
        console.log("Null bytes found, attempting to clean...");
        content = content.replace(/\u0000/g, '');
    }

    // Look for the spaced out version
    const corruptedStart = content.indexOf('w i n d o w');
    if (corruptedStart !== -1) {
        console.log("Found corrupted start at index " + corruptedStart);
        content = content.substring(0, corruptedStart);
    }

    // Also check for the specific mangled content seen in logs
    const garbageStart = content.indexOf(' / /   H e l p e r');
    if (garbageStart !== -1) {
        console.log("Found garbage start at index " + garbageStart);
        content = content.substring(0, garbageStart);
    }

    // Write back cleaned content
    fs.writeFileSync(path, content, 'utf8');
    console.log("File cleaned. New length: " + content.length);
} catch (e) {
    console.error("Error cleaning file:", e);
}
