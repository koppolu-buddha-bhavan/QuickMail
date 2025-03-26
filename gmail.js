const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const TOKEN_PATH = path.join(__dirname, "token.json");
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"];

async function authorize() {
    const credentials = JSON.parse(fs.readFileSync("credentials.json"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    if (fs.existsSync(TOKEN_PATH)) {
        oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    } else {
        throw new Error("Token not found. Run authentication process.");
    }
    return oAuth2Client;
}

async function listEmails(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({ userId: "me", maxResults: 2 });
    if (!res.data.messages) return [];
    return Promise.all(res.data.messages.map(async msg => {
        let email = await gmail.users.messages.get({ userId: "me", id: msg.id });
        return { id: msg.id, snippet: email.data.snippet, sender: email.data.payload.headers.find(h => h.name === "From").value };
    }));
}

async function sendEmail(auth, recipient, message) {
    const gmail = google.gmail({ version: "v1", auth });
    const emailContent = [
        `To: ${recipient}`,
        "Subject: Re: Your Inquiry",
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=\"UTF-8\"",
        "",
        message,
    ].join("\n");
    const encodedMessage = Buffer.from(emailContent).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    await gmail.users.messages.send({ userId: "me", requestBody: { raw: encodedMessage } });
}

module.exports = { authorize, listEmails, sendEmail };