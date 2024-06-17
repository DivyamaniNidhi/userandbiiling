const express = require("express");
const router = express.Router();
const BillingAddress = require("../models/BillingAddressModel");
const billingAddressSchema = require("../validation/validateBillingAddress");
const isAuthenticated = require("../middleware/auth");
const maskSensitiveData = require("../helpers/maskSensitiveData");
const z = require("zod");

// POST route for creating a billing address
router.post("/billingAddress", isAuthenticated, async (req, res) => {
  try {
    billingAddressSchema.parse(req.body);

    const newBillingAddress = new BillingAddress({
      ...req.body,
      userId: req.user._id,
    });

    const savedBillingAddress = await newBillingAddress.save();
    res.status(201).json(savedBillingAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).send(error.message);
  }
});

// GET route for fetching the billing address
router.get("/billingAddress", isAuthenticated, async (req, res) => {
  try {
    const billingAddress = await BillingAddress.findOne({
      userId: req.user._id,
    });

    if (!billingAddress) {
      return res.status(404).send("Billing address not found");
    }
    // Mask sensitive data before sending response
    const maskedBillingAddress = maskSensitiveData(billingAddress.toObject());
    res.json(maskedBillingAddress);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT route for updating the billing address
router.put("/billingAddress", isAuthenticated, async (req, res) => {
  try {
    billingAddressSchema.parse(req.body);

    const updatedBillingAddress = await BillingAddress.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBillingAddress) {
      return res.status(404).send("Billing address not found");
    }

    res.json(updatedBillingAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).send(error.message);
  }
});

module.exports = router;
