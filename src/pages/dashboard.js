import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [emails, setEmails] = useState([]);
    const [status, setStatus] = useState("Click 'Start Automation' to begin.");

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:3000/events");

        eventSource.onmessage = (event) => {
            const newEmail = JSON.parse(event.data);
            console.log("📩 Update received:", newEmail);

            setEmails((prev) => [newEmail, ...prev]);
            setStatus("✅ Email Automation Running...");
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const startEmailProcessing = () => {
        setStatus("🔄 Processing emails...");
        fetch("http://localhost:3000/process-emails")
            .then((res) => res.json())
            .then((data) => {
                console.log("🚀 Automation started:", data);
                setStatus("✅ Email Automation Started!");
            })
            .catch((err) => {
                console.error("❌ Error starting automation:", err);
                setStatus("❌ Failed to start automation.");
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Email Automation Dashboard</h1>
            <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg mb-4"
                onClick={startEmailProcessing}
            >
                Start Automation
            </button>
            <p className="text-green-600 font-semibold">{status}</p>
            <div className="mt-4">
                {emails.length === 0 ? (
                    <p>No emails processed yet...</p>
                ) : (
                    emails.map((email, index) => (
                        <div key={index} className="p-4 bg-white shadow-md mb-2 rounded-md">
                            <p className="text-gray-700"><strong>📩 Email:</strong> {email.snippet}</p>
                            <p className="text-blue-600"><strong>🔄 Stage:</strong> {email.stage}</p>
                            {email.sentiment && <p className="text-purple-600"><strong>📊 Sentiment:</strong> {email.sentiment}</p>}
                            {email.aiResponse && <p className="text-green-600"><strong>🤖 AI Response:</strong> {email.aiResponse}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
