
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const identifier = document
        .getElementById("identifier")
        .value
        .trim();

    const password = document.getElementById("password").value;

    // Show loading state
    message.className = "alert d-none";
    message.textContent = "";

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent =
                result.message || "Login failed. Please try again.";

            message.className = "alert alert-danger";
            return;
        }

        message.textContent = "Login successful! Redirecting...";
        message.className = "alert alert-success";

        if (result.user.role === "admin") {
            window.location.href = "/admin.html";
        } else {
            window.location.href = "/dashboard.html";
        }

    } catch (error) {
        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to the server. Please try again.";

        message.className = "alert alert-danger";

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});
