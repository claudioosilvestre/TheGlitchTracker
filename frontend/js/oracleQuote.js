// ORACLE QUOTE
// Fetches a dynamically generated quote from the AI Oracle
// and injects it into the footer on page load.

const API_BASE = 'http://localhost:8080/api';

export async function loadOracleQuote() {
    try {
        const res = await fetch(`${API_BASE}/ai/quote`);
        const quote = await res.text();
        document.getElementById('oracle-quote').textContent = `"${quote}"`;
    } catch {
        // Keep the original sentence if it fails
    }
}