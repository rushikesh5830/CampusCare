const express = require("express");
const { readData } = require("../utils/jsonDB");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireLogin, async (req, res) => {
    try {
        const complaints = await readData("complaints.json");

        const myComplaints = complaints.filter(
            complaint => complaint.userId === req.session.user.id
        );

        return res.status(200).json({
            message: "Welcome to your dashboard!",
            user: req.session.user,
            stats: {
                pending: myComplaints.filter(
                    c => c.status === "Pending"
                ).length,

                inProgress: myComplaints.filter(
                    c => c.status === "In Progress"
                ).length,

                resolved: myComplaints.filter(
                    c => c.status === "Resolved"
                ).length
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            message: "Unable to load dashboard."
        });
    }
});

module.exports = router;