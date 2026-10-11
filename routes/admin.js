const express = require("express");
const { readData } = require("../utils/jsonDB");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/complaints", requireAdmin, async (req, res) => {
    try {
        const complaints = await readData("complaints.json");

        return res.status(200).json(complaints);
    } catch (error) {
        console.error("Admin complaint fetch error:", error);

        return res.status(500).json({
            message: "Unable to load complaints."
        });
    }
});

module.exports = router;