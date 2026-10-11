const complaintForm = document.getElementById("complaintForm");
const message = document.getElementById("message");

complaintForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    try {

        const response = await fetch("/api/complaints", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                category: category,
                description: description
            })

        });

        const result = await response.json();

        if (response.ok) {

            message.className = "alert alert-success mt-3";
            message.textContent = result.message;

            complaintForm.reset();

        } else {

            message.className = "alert alert-danger mt-3";
            message.textContent = result.message;

        }

    } catch (error) {

        console.error("Complaint submission error:", error);

        message.className = "alert alert-danger mt-3";
        message.textContent =
            "Unable to connect to the server.";

    }

});