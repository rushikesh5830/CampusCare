const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        logoutBtn.disabled = true;
        logoutBtn.textContent = "Logging out...";

        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "same-origin"
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = "/login.html";
                return;
            }

            alert(result.message || "Unable to logout.");

        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to connect to the server. Please try again.");

        } finally {
            logoutBtn.disabled = false;
            logoutBtn.textContent = "Logout";
        }
    });
}