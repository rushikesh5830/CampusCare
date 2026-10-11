const express = require("express");
const { readData, writeData } = require("../utils/jsonDB");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

// Submit a new complaint
router.post("/", requireLogin, async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const complaints = await readData("complaints.json");

        // Store complaint details with the logged-in student's information
        const newComplaint = {
            id: Date.now().toString(),
            userId: req.session.user.id,
            studentName: req.session.user.name,
            title: title.trim(),
            category,
            description: description.trim(),
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        complaints.push(newComplaint);
        await writeData("complaints.json", complaints);

        return res.status(201).json({
            message: "Complaint submitted successfully!",
            complaint: newComplaint
        });

    } catch (error) {
        console.error("Complaint submission error:", error);

        return res.status(500).json({
            message: "Something went wrong while submitting the complaint."
        });
    }
});

// Retrieve complaints submitted by the logged-in student
router.get("/my", requireLogin, async (req, res) => {
    
    try {
        const complaints = await readData("complaints.json");

        const myComplaints = complaints.filter(
            complaint => complaint.userId === req.session.user.id
        );

        return res.status(200).json(myComplaints);

    } catch (error) {
        console.error("Fetch complaints error:", error);

        return res.status(500).json({
            message: "Unable to load your complaints."
        });
    }
});

// Update complaint status (admin access only)
router.patch("/:id/status", requireLogin, async (req, res) => {
    try {
        // Verify that the logged-in user has the admin role
        if (req.session.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required."
            });
        }

        const { status } = req.body;

        // Accept only the supported complaint statuses
        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status."
            });
        }

        const complaints = await readData("complaints.json");

        const complaint = complaints.find(
            item => item.id === req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        // Save the updated status to the JSON database
        complaint.status = status;
        await writeData("complaints.json", complaints);

        return res.status(200).json({
            message: "Complaint status updated successfully.",
            complaint: complaint
        });

    } catch (error) {
        console.error("Status update error:", error);

        return res.status(500).json({
            message: "Unable to update complaint status."
        });
    }
});

module.exports = router;