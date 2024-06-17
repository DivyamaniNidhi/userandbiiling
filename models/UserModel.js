const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  designation: { type: String, required: true },
  personalEmail: { type: String, required: true, unique: true },
  companyEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//compare entered password with the hashed password stored in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// to convert email to lowercase
UserSchema.pre("validate", function (next) {
  if (this.personalEmail) {
    this.personalEmail = this.personalEmail.toLowerCase();
  }
  if (this.companyEmail) {
    this.companyEmail = this.companyEmail.toLowerCase();
  }
  next();
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  } //if current password is not modified, move on to the next

  //else generate a salt and before saving it encrypt it and then save to the DB.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
