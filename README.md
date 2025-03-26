# 📩 QuickMail: Automated Email Response System  

## 🚀 Overview  
QuickMail is an AI-powered automated email response system that integrates the **Google Gmail API** and **Microsoft Azure AI services** to process incoming emails and generate smart replies. It authenticates users via **Google OAuth** and leverages **Azure AI** for sentiment analysis and response generation.  

---

## 🔥 Features  
✅ **OAuth Authentication** – Secure login via Google OAuth 2.0.  
✅ **Email Retrieval** – Fetches recent emails using Gmail API.  
✅ **Sentiment Analysis** – Analyzes email content with Azure AI.  
✅ **Automated Response Generation** – Uses **Azure GPT-4** to generate intelligent replies.  
✅ **Email Reply Automation** – Sends responses through Gmail API.  

---

## 🛠 Technologies Used  
### **Backend**  
- **Node.js** with **Express.js**  
- **Google Gmail API** (OAuth Authentication, Read, and Send Emails)  
- **Microsoft Azure Text Analytics API** (Sentiment Analysis)  
- **Microsoft Azure OpenAI GPT-4** (AI Response Generation)  

### **Libraries**  
- **googleapis** → Gmail API integration  
- **axios** → API requests  
- **dotenv** → Environment variable management  
- **express** → Server implementation  

---

## ⚙ **System Architecture**  
### **1️⃣ Authentication (`auth.js`)**  
🔹 Loads credentials from `credentials.json`.  
🔹 Generates OAuth URL for user login.  
🔹 Exchanges authorization code for access tokens.  
🔹 Stores OAuth tokens in `token.json`.  

### **2️⃣ Email Processing (`gmail.js`)**  
🔹 Fetches recent emails using Gmail API.  
🔹 Extracts sender details and email content.  

### **3️⃣ Sentiment Analysis & AI Response (`azure.js`)**  
🔹 Calls **Azure Text Analytics API** to analyze email sentiment.  
🔹 Uses **Azure GPT-4** to generate a contextual response.  

### **4️⃣ Email Reply Automation (`app.js`)**  
🔹 Fetches emails from Gmail.  
🔹 Processes sentiment and generates an AI response.  
🔹 Sends automated replies via Gmail API.  

---

## 🛠 **Environment Setup**  
### **1️⃣ Prerequisites**  
- ✅ **Node.js** installed  
- ✅ **Google Cloud API credentials**  
- ✅ **Microsoft Azure API keys**  

### **2️⃣ Installation**  
```bash  
# Clone repository  
git clone <repo-url>  
cd quickmail  

# Install dependencies  
npm install  
```

### **3️⃣ Configuration**  
🔹 **Update `credentials.json`** with Google API credentials.  
🔹 **Update `.env`** with Azure API keys.  
🔹 **Run authentication** to generate `token.json`.  

### **4️⃣ Running the Application**  
```bash  
node app.js  
```

---

## 🌐 **API Endpoints**  
| Endpoint         | Method | Description                          |  
|-----------------|--------|--------------------------------------|  
| `/auth`         | `GET`  | Redirects to Google OAuth login     |  
| `/oauth2callback` | `GET`  | Handles OAuth token exchange       |  
| `/process-emails` | `GET`  | Processes incoming emails & replies |  

---

## 🔒 **Security Considerations**  
🔹 Store sensitive credentials in **environment variables** (`.env`).  
🔹 **Do not expose `token.json`** in public repositories.  
🔹 **Restrict API permissions** for least privilege access.  

---

## 🔮 **Future Enhancements**  
🚀 Implement logging and monitoring.  
🚀 Add support for multiple email accounts.  
🚀 Improve response customization using AI models.  

---

## 📌 **Conclusion**  
QuickMail leverages **AI-powered automation** to streamline email processing, ensuring **efficient and intelligent responses** while maintaining **security and scalability**.  

---

**🔗 Developed with ❤️ using Node.js, Google API, and Azure AI.**  

