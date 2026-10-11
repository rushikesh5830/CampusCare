const studentName = document.getElementById("studentName");

async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard");
        const result = await response.json();

        console.log("Dashboard response:", result);

        if (!response.ok) {
            window.location.href = "/login.html";
            return;
        }

        studentName.textContent = result.user.name;

        document.getElementById("pendingCount").textContent =
            result.stats.pending;

        document.getElementById("progressCount").textContent =
            result.stats.inProgress;

        document.getElementById("resolvedCount").textContent =
            result.stats.resolved;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

loadDashboard();