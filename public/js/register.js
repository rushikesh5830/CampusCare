
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const rollNumber = document
        .getElementById("rollNumber")
        .value.trim()
        .toUpperCase();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "";

    // Validate roll number before sending the request
    if (!/^[A-Z]{3}[0-9]{7}$/.test(rollNumber)) {
        message.textContent =
            "Roll number must contain 3 letters followed by 7 digits.";
        message.className = "text-danger mb-3";
        return;
    }

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                rollNumber,
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent =
                result.message || "Registration failed.";
            message.className = "text-danger mb-3";
            return;
        }

        message.textContent =
            "Registration successful! Redirecting to login...";
        message.className = "text-success mb-3";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1000);

    } catch (error) {
        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to the server. Please try again.";
        message.className = "text-danger mb-3";
    }
});
