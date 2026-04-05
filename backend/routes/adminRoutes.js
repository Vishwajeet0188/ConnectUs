const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");

// MongoDB model
const User = require("../models/UserModel");


// 🔹 GET Dashboard
router.get("/dashboard", verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalParents = await User.countDocuments({ role: "parent" });
        const totalProfessionals = await User.countDocuments({ role: "professional" });

        res.json({
            totalUsers,
            totalAdmins,
            totalStudents,
            totalParents,
            totalProfessionals
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});


// 🔹 GET All Users
router.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // hide password
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});


// 🔹 ADD User (POST)
router.post("/users", verifyAdmin, async (req, res) => {
    try {
        const { fullName, email, role, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            fullName,
            email,
            role,
            password,
            status: "active",
        });

        await newUser.save();

        res.status(201).json({
            message: "User added successfully",
            user: newUser,
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to add user" });
    }
});


// 🔹 UPDATE User (PUT)
router.put("/users/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { fullName, email, role },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            user: updatedUser,
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to update user" });
    }
});


// 🔹 DELETE User
router.delete("/users/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: "Failed to delete user" });
    }
});


// 🔹 PATCH (Toggle Status)
router.patch("/users/:id/status", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User status updated",
            user: updatedUser,
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to update status" });
    }
});

module.exports = router;