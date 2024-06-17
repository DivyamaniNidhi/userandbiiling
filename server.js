const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const billingRoutes = require("./routes/billing");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/user", userRoutes);
app.use("/api", billingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
