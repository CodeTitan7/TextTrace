export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const API_URL = process.env.API_URL;  

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("API request error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
