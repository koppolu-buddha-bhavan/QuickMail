require("dotenv").config();
const axios = require("axios");

// Load environment variables
const {
    AZURE_TEXT_ANALYTICS_ENDPOINT,
    AZURE_TEXT_ANALYTICS_KEY,
    AZURE_GPT4_ENDPOINT,
    AZURE_GPT4_KEY
} = process.env;

// Ensure all required environment variables are set
if (!AZURE_TEXT_ANALYTICS_ENDPOINT || !AZURE_TEXT_ANALYTICS_KEY) {
    throw new Error("Missing Azure Text Analytics credentials. Check your .env file.");
}
if (!AZURE_GPT4_ENDPOINT || !AZURE_GPT4_KEY) {
    throw new Error("Missing Azure GPT-4 credentials. Check your .env file.");
}

// Function to analyze sentiment
async function analyzeSentiment(text) {
    try {
        const response = await axios.post(
            `${AZURE_TEXT_ANALYTICS_ENDPOINT}/text/analytics/v3.1/sentiment`,
            { documents: [{ id: "1", language: "en", text }] },
            { headers: { "Ocp-Apim-Subscription-Key": AZURE_TEXT_ANALYTICS_KEY, "Content-Type": "application/json" } }
        );
        return response.data.documents[0].sentiment;
    } catch (error) {
        console.error("Error analyzing sentiment:", error.response?.data || error.message);
        throw new Error("Failed to analyze sentiment.");
    }
}

// Function to generate AI response using GPT-4
async function generateResponse(prompt) {
    try {
        const response = await axios.post(
            AZURE_GPT4_ENDPOINT,
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an email assistant." },
                    { role: "user", content: prompt }
                ],
            },
            { headers: { "Authorization": `Bearer ${AZURE_GPT4_KEY}`, "Content-Type": "application/json" } }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating AI response:", error.response?.data || error.message);
        throw new Error("Failed to generate AI response.");
    }
}

module.exports = { analyzeSentiment, generateResponse };
