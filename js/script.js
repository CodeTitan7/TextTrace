function scrollToAnalyzer() {
    document.getElementById("analyzer").scrollIntoView({ behavior: "smooth" });
}

async function analyzeText() {
    const text = document.getElementById("textInput").value.trim();
    const infoText = document.querySelector(".info-text");

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    if (wordCount < 70) {
        infoText.textContent = `Please enter at least 70 words [Currently: ${wordCount}]`;
        infoText.style.color = "#4b3621";
        infoText.style.fontWeight = "bold";
        infoText.style.fontSize = "18px";
        return;
    }

    try {
        const response = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();
        const aiConfidence = data.probability * 100;

        infoText.textContent = aiConfidence > 50 
            ? "AI-Generated Content" 
            : "Human-Written Content";

        infoText.style.color = "#4b3621";
        infoText.style.fontSize = "22px";
        infoText.style.fontWeight = "bold";

        showChart(aiConfidence);
    } catch (error) {
        console.error("Error fetching API:", error);
        infoText.textContent = "Error analyzing text. Please try again.";
        infoText.style.color = "red";
        infoText.style.fontWeight = "bold";
    }
}

function showChart(aiConfidence) {
    const ctx = document.getElementById("resultChart").getContext("2d");

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["AI-Generated", "Human-Written"],
            datasets: [{
                data: [aiConfidence, 100 - aiConfidence],
                backgroundColor: ["#ff6384", "#36a2eb"],
                hoverBackgroundColor: ["#ff4d67", "#2f85d3"],
                borderWidth: 2
            }]
        },
        options: { responsive: true }
    });
}
