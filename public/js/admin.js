const complaintsContainer =
    document.getElementById("complaintsContainer");

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const resolvedCount =
    document.getElementById("resolvedCount");


async function loadComplaints() {

    try {

        const response =
            await fetch("/api/admin/complaints");

        const complaints =
            await response.json();


        if (!response.ok) {

            if (response.status === 401) {
                window.location.href = "/login.html";
                return;
            }

            if (response.status === 403) {

                complaintsContainer.innerHTML = `
                    <div class="alert alert-danger">
                        Admin access required.
                    </div>
                `;

                return;
            }

            throw new Error(
                complaints.message ||
                "Unable to load complaints."
            );

        }


        totalCount.textContent = complaints.length;

        const pending = complaints.filter(
            complaint => complaint.status === "Pending"
        );

        const resolved = complaints.filter(
            complaint => complaint.status === "Resolved"
        );

        pendingCount.textContent = pending.length;
        resolvedCount.textContent = resolved.length;


        if (complaints.length === 0) {

            complaintsContainer.innerHTML = `
                <div class="text-center py-5">

                    <h5>No complaints yet</h5>

                    <p class="text-muted">
                        There are currently no student complaints.
                    </p>

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

                        <div class="d-flex justify-content-between flex-wrap gap-2">

                            <div>

                                <h5 class="fw-bold">
                                    ${complaint.title}
                                </h5>

                                <small class="text-muted">
                                    Student: ${complaint.studentName}
                                </small>

                                <br>

                                <small class="text-muted">
                                    ${complaint.category} • ${date}
                                </small>

                            </div>

                            <span class="badge ${badgeClass}">
                                ${complaint.status}
                            </span>

                        </div>


                        <p class="mt-3">
                            ${complaint.description}
                        </p>


                        <div class="row g-2 align-items-center">

                            <div class="col-md-8">

                                <label
                                    for="status-${complaint.id}"
                                    class="form-label"
                                >
                                    Update complaint status
                                </label>

                                <select
                                    class="form-select"
                                    id="status-${complaint.id}"
                                >

                                    <option
                                        value="Pending"
                                        ${complaint.status === "Pending" ? "selected" : ""}
                                    >
                                        Pending
                                    </option>

                                    <option
                                        value="In Progress"
                                        ${complaint.status === "In Progress" ? "selected" : ""}
                                    >
                                        In Progress
                                    </option>

                                    <option
                                        value="Resolved"
                                        ${complaint.status === "Resolved" ? "selected" : ""}
                                    >
                                        Resolved
                                    </option>

                                </select>

                            </div>


                            <div class="col-md-4">

                                <button
                                    type="button"
                                    class="btn btn-primary w-100 mt-md-4"
                                    onclick="updateStatus('${complaint.id}')"
                                >
                                    Update Status
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Admin complaints error:",
            error
        );

        complaintsContainer.innerHTML = `
            <div class="alert alert-danger">
                Unable to load complaints. Please try again.
            </div>
        `;

    }

}


async function updateStatus(complaintId) {
    const statusSelect = document.getElementById(
        `status-${complaintId}`
    );

    const status = statusSelect.value;

    try {
        const response = await fetch(
            `/api/complaints/${complaintId}/status`,
            {
                method: "PATCH",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify({ status })
            }
        );

        const result = await response.json();

        if (response.status === 401) {
            alert("Your session has expired. Please log in again.");
            window.location.href = "/login.html";
            return;
        }

        if (response.status === 403) {
            alert("Admin access required.");
            return;
        }

        if (!response.ok) {
            alert(result.message || "Unable to update complaint status.");
            return;
        }

        await loadComplaints();

        alert("Complaint status updated successfully!");

    } catch (error) {
        console.error("Status update error:", error);
        alert("Unable to connect to the server. Please try again.");
    }
}

loadComplaints();