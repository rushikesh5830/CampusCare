
const express = require("express");
const bcrypt = require("bcryptjs");
const { readData, writeData } = require("../utils/jsonDB");

const router = express.Router();

// Register a new student
router.post("/register", async (req, res) => {
    try {
        const { name, rollNumber, email, password } = req.body;

        // Validate required fields
        if (!name || !rollNumber || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        // Normalize input
        const normalizedName = name.trim();
        const normalizedRollNumber = rollNumber.trim().toUpperCase();
        const normalizedEmail = email.trim().toLowerCase();

        // Validate roll number: 3 letters followed by 7 digits
        if (!/^[A-Z]{3}[0-9]{7}$/.test(normalizedRollNumber)) {
            return res.status(400).json({
                message: "Roll number must contain 3 letters followed by 7 digits."
            });
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        // Read existing users
        const users = await readData("users.json");

        // Check duplicate roll number
        const existingRollNumber = users.find(
            user =>
                user.rollNumber &&
                user.rollNumber.toUpperCase() === normalizedRollNumber
        );

        if (existingRollNumber) {
            return res.status(409).json({
                message: "This college roll number is already registered."
            });
        }

        // Check duplicate email
        const existingEmail = users.find(
            user =>
                user.email &&
                user.email.toLowerCase() === normalizedEmail
        );

        if (existingEmail) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student account
        const newUser = {
            id: Date.now().toString(),
            name: normalizedName,
            rollNumber: normalizedRollNumber,
            email: normalizedEmail,
            password: hashedPassword,
            role: "student"
        };

        users.push(newUser);
        await writeData("users.json", users);

        return res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Something went wrong during registration."
        });
    }
});


// Login: students use roll number; admins use email
router.post("/login", async (req, res) => {
    try {
        const { identifier, email, rollNumber, password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Please enter your password."
            });
        }

        // Support the current email field and the new identifier field
        const loginIdentifier = String(
            identifier || rollNumber || email || ""
        ).trim();

        if (!loginIdentifier) {
            return res.status(400).json({
                message: "Please enter your college roll number or admin email."
            });
        }

        const users = await readData("users.json");

        // Admins log in with email; students log in with roll number
        const user = users.find(item => {
            if (item.role === "admin") {
                return item.email &&
                    item.email.toLowerCase() === loginIdentifier.toLowerCase();
            }

            return item.role === "student" &&
                item.rollNumber &&
                item.rollNumber.toUpperCase() === loginIdentifier.toUpperCase();
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid login credentials."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid login credentials."
            });
        }

        // Create session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            rollNumber: user.rollNumber || null,
            role: user.role
        };

        // Save session before sending the response
        req.session.save(error => {
            if (error) {
                console.error("Session save error:", error);

                return res.status(500).json({
                    message: "Unable to complete login. Please try again."
                });
            }

            return res.status(200).json({
                message: "Login successful!",
                user: req.session.user
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong during login."
        });
    }
});


// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                message: "Unable to logout."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logout successful!"
        });
    });
});

module.exports = router;
