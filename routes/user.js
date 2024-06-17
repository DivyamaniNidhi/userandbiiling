const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const validatedUserSchema = require("../validation/validateUserModel");
const router = express.Router();
const z = require("zod");

// REGISTER USER
router.post("/signup", async (req, res) => {
  try {
    const validatedData = validatedUserSchema.parse(req.body);
    const {
      name,
      companyName,
      phone,
      designation,
      personalEmail,
      companyEmail,
      password,
      rePassword,
    } = validatedData;

    if (
      !name ||
      !companyName ||
      !designation ||
      !personalEmail ||
      !companyEmail ||
      !password ||
      !rePassword
    ) {
      return res.status(400).send("Please enter all the required fields");
    }

    if (password !== rePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingPersonalEmail = await User.findOne({ personalEmail });
    const existingCompanyEmail = await User.findOne({ companyEmail });

    if (existingPersonalEmail || existingCompanyEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      companyName,
      phone,
      designation,
      personalEmail,
      companyEmail,
      password,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    if (user) {
      return res.status(201).json({
        _id: user.id,
        personalEmail: user.personalEmail,
        companyEmail: user.companyEmail,
        token,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(400).json({ message: "Failed to create the user" });
    }
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  const { personalEmail, password } = req.body;

  if (!personalEmail || !password) {
    return res.status(400).send("Enter all the required fields!");
  }

  try {
    const user = await User.findOne({ personalEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    if (user && isMatch) {
      return res.json({
        _id: user.id,
        name: user.name,
        personalEmail: user.personalEmail,
        companyName: user.companyName,
        companyEmail: user.companyEmail,
        token,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: "Failed to login" });
  }
});

module.exports = router;
