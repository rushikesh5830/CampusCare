const complaintsContainer =
    document.getElementById("complaintsContainer");

async function loadComplaints() {

    try {

        const response = await fetch("/api/complaints/my");

        const complaints = await response.json();

        if (!response.ok) {

            window.location.href = "/login.html";
            return;

        }

        if (complaints.length === 0) {

            complaintsContainer.innerHTML = `
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center py-5">

                        <h5>No complaints yet</h5>

                        <p class="text-muted">
                            You haven't submitted any complaints.
                        </p>

                        <a
                            href="/complaint.html"
                            class="btn btn-primary"
                        >
                            Submit Your First Complaint
                        </a>

                    </div>
                </div>
            `;

            return;
        }

        complaintsContainer.innerHTML = "";

        complaints.forEach(complaint => {

            let badgeClass = "bg-warning text-dark";

            if (complaint.status === "In Progress") {
                badgeClass = "bg-primary";
            }

            if (complaint.status === "Resolved") {
                badgeClass = "bg-success";
            }

            const date = new Date(
                complaint.createdAt
            ).toLocaleDateString();

            complaintsContainer.innerHTML += `
                <div class="card border-0 shadow-sm mb-3">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>

                                <h5 class="fw-bold">
                                    ${complaint.title}
                                </h5>

                                <small class="text-muted">
                                    ${complaint.category} • ${date}
                                </small>

                            </div>

                            <span class="badge ${badgeClass}">
                                ${complaint.status}
                            </span>

                        </div>

                        <p class="mt-3 mb-0">
                            ${complaint.description}
                        </p>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error("Complaints error:", error);

        complaintsContainer.innerHTML = `
            <div class="alert alert-danger">
                Unable to load complaints.
            </div>
        `;

    }

}

loadComplaints();