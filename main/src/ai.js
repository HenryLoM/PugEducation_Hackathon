// ========== ========== ========== ========== ========== ========== ========== ========== ========== ========== Imports

import rawInstructions from "./contexts/instructions.txt?raw";

// ========== ========== ========== ========== ========== ========== ========== ========== ========== ========== Variables

let model            = "NicoleShelterV1";         // Using LLM
let port             = "11434";                   // Port for streaming AI messaging
let errorMessage     = "(Pet can't be heard...)"  // Eroor messsage to save in memory and display to user
let trimLimit = 100;                              // Максимум сообщений
let trimCut   = 80;                               // Сколько срезать при переполнении
let memory                = [];                   // AI memory in an array
let ollamaAbortController = null;                 // Abortion control via the variable
let instructions = rawInstructions.replace(/\r?\n/g, " ");

// Global (window)
window.appearanceContext = "Pet wears Green hoodie\nPet is in Digital program window"
window.timeContext       = `Current time in the real world is ${new Date().toLocaleTimeString()}`
window.themeContext      = "Currently it is light in the website, Pet has a day time in her locations"

// ========== ========== ========== ========== ========== ========== ========== ========== ========== ========== Chat working

/**
 * Is the main function to chat with the AI.
 * 
 * @param {Array}    messages - Array of message objects (role + content).
 * @param {Function} callback - Function to handle streaming response chunks.
 * @returns {void}
 */
async function chatWithOllama(messages, callback) {
    // Abort previous if running
    if (ollamaAbortController) {
        ollamaAbortController.abort();
        await fetch(`http://localhost:${port}/api/shutdown`, { method: 'POST' });  // Force stop AI message generating
        console.warn("[⚠︎ WARNING ⚠︎] — Previous request was aborted");
    }
    ollamaAbortController = new AbortController();  // Create new controller for this request

    let response;
    // Try to connect to the local Ollama serviices
    try {
        response = await fetch(`http://localhost:${port}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({model: model, stream: true, messages: messages,}),
            signal: ollamaAbortController.signal
        });
    } catch (err) {
        if (err.name === 'AbortError') return;                               // Quit generating new response if the error is abort
        ollamaAbortController = null;                                       //  Prevent abortion control from bugging error displaying
        callback(`${errorMessage}`);                                       //   Show to user prepared error message for displaying
        console.error("[⚙ ALARMING ERROR ⚙] — Connection failed:", err);  //    LOGGING: Error
        return;
    }
    // Some settings
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    // Collect message in one streaming variable
    let buffer = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;  // Finish "while" cycle
        // Streaming settings
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop();
        // Streaming itself
        for (let line of parts) {
            if (!line.trim()) continue;
            try {
                const json = JSON.parse(line);
                if (json.done) break;  // Finish "for" cycle
                const content = json.message.content;
                if (content) callback(content);
            } catch (err) {
                console.error("[⚙ ALARMING ERROR ⚙] — JSON parse error:", err);  // LOGGING: Error
            }
        }
    }
    ollamaAbortController = null;
}

/**
 * Sends the user message to AI and streams AI response.
 *
 * @param {string}   userInput   - The raw text string entered by the user.
 * @param {Function} onChunk     - Callback for streaming response chunks.
 * @param {boolean} [allowPartialSave=true] - Allows partial save if aborted.
 * @returns {Promise<string>} - Full AI message after streaming.
 */
export async function handleAiResponse(userInput, onChunk, allowPartialSave = true) {
    let aiMessage = "";

    let logMessage = [
        window.timeContext,
        window.appearanceContext,
        window.themeContext
    ];

    const chatHistory = memory
        .map(({ role, content }) => `${role}: ${content}`)
        .join("\n");

    const fullMessagePayload = [
        { role: "system", content: `::INFO ABOUT NICOLE::\n${instructions}\n\n` +
                                   `::CONTEXT OF THE MOMENT::\n${logMessage}` },
        { role: "system", content: `::PREVIOUS MESSAGES::\n${chatHistory}` },
        { role: "user",   content: userInput }
    ];

    try {
        await chatWithOllama(fullMessagePayload, (chunk) => {
            aiMessage += chunk;
            if (onChunk) onChunk(chunk);
        });

        // 🧠 сохраняем новые сообщения в память
        memory.push({ role: "user", content: userInput });
        memory.push({ role: "assistant", content: aiMessage });

        // ✂️ подрезаем память
        trimMemory();

        return aiMessage;

    } catch (err) {
        if (err.name === "AbortError" && allowPartialSave) return aiMessage;
        throw err;
    }
}

// Хелпер: обрезка памяти
function trimMemory() {
    if (memory.length > trimLimit) {
        memory = memory.slice(trimCut);  
        console.log(`[ℹ] Memory trimmed. Current size: ${memory.length}`);
    }
}
