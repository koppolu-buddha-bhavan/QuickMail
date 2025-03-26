const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const { listEmails, sendEmail } = require("./gmail");
const { analyzeSentiment, generateResponse } = require("./azure");
const cors = require("cors");

const app = express();
const PORT = 3000;
require("dotenv").config();

app.use(cors());

const credentials = require("./credentials.json");
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Store SSE clients
let clients = [];

// 🔥 Route 1: SSE Connection for Real-Time Updates
app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Add client to list
    clients.push(res);

    // Remove client on disconnect
    req.on("close", () => {
        clients = clients.filter(client => client !== res);
    });
});

// Route 2: Google Authentication
app.get("/auth", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
    });
    res.redirect(authUrl);
});

// Route 3: OAuth Callback
app.get("/oauth2callback", async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).send("No authorization code provided.");
        }

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync("token.json", JSON.stringify(tokens));

        console.log("✅ Authentication successful! Redirecting to frontend...");
        res.redirect("http://localhost:3001/dashboard");
    } catch (error) {
        console.error("❌ Authentication failed:", error);
        res.status(500).send("Authentication failed.");
    }
});

// 🔥 Route 4: Process Emails and Send SSE Updates
app.get("/process-emails", async (req, res) => {
    try {
        const tokens = JSON.parse(fs.readFileSync("token.json"));
        oAuth2Client.setCredentials(tokens);

        const emails = await listEmails(oAuth2Client);

        for (let email of emails) {
            console.log(`📩 Processing Email: ${email.snippet}`);

            // Notify frontend
            clients.forEach(client => client.write(`data: ${JSON.stringify({ stage: "Processing", snippet: email.snippet })}\n\n`));

            const sentiment = await analyzeSentiment(email.snippet);
            console.log(`📊 Sentiment: ${sentiment}`);

            clients.forEach(client => client.write(`data: ${JSON.stringify({ stage: "Sentiment Analyzed", snippet: email.snippet, sentiment })}\n\n`));

            const aiResponse = await generateResponse(email.snippet);
            console.log(`🤖 AI Response: ${aiResponse}`);

            clients.forEach(client => client.write(`data: ${JSON.stringify({ stage: "AI Response Generated", snippet: email.snippet, sentiment, aiResponse })}\n\n`));

            await sendEmail(oAuth2Client, email.sender, aiResponse);
            console.log(`✅ Email processed successfully!`);

            clients.forEach(client => client.write(`data: ${JSON.stringify({ stage: "Completed", snippet: email.snippet, sentiment, aiResponse })}\n\n`));
        }

        res.json({ message: "✅ Email Automation Started!" });
    } catch (error) {
        console.error("❌ Error processing emails:", error);
        res.status(500).json({ message: "Failed to start email automation" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
