const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"];
const TOKEN_PATH = "token.json";

// Load client secrets from a file
fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading credentials:", err);
    authorize(JSON.parse(content));
});

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we already have a token
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log("Token already exists.");
    });
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);
            oAuth2Client.setCredentials(token);
            
            // Save the token to a file
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log("Token saved to", TOKEN_PATH);
            });
        });
    });
}
