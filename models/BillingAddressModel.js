const mongoose = require("mongoose");

const billingAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, //reference to particular user(s)
    ref: "User", //refer to user model
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
    required: true,
  },
  cardNumber: {
    type: String,
    required: function () {
      return ["Credit Card", "Debit Card"].includes(this.paymentMethod);
    },
  },
  expirationMonth: {
    type: Number,
    required: function () {
      return ["Credit Card", "Debit Card"].includes(this.paymentMethod);
    },
    min: 1,
    max: 12,
  },
  expirationYear: {
    type: Number,
    required: function () {
      return ["Credit Card", "Debit Card"].includes(this.paymentMethod);
    },
  },
  netBankingDetails: {
    bankName: {
      type: String,
      required: function () {
        return this.paymentMethod === "Net Banking";
      },
    },
    accountNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === "Net Banking";
      },
    },
    ifscCode: {
      type: String,
      required: function () {
        return this.paymentMethod === "Net Banking";
      },
    },
  },
  upiDetails: {
    upiID: {
      type: String,
      required: function () {
        return this.paymentMethod === "UPI";
      },
    },
  },
});

const BillingAddress = mongoose.model("BillingAddress", billingAddressSchema);

module.exports = BillingAddress;
