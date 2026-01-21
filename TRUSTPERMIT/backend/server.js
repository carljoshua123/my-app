const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const clearanceRoutes = require("./routes/clearanceRoutes");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔐 CREATE DEFAULT ADMIN */
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        email: "admin@trustpermit.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Default admin account created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
};

/* 🔐 CREATE DEFAULT STAFF */
const createStaff = async () => {
  try {
    const staffExists = await User.findOne({ role: "staff" });

    if (!staffExists) {
      const hashedPassword = await bcrypt.hash("staff123", 10);

      await User.create({
        email: "staff@cityhall.gov",
        password: hashedPassword,
        role: "staff",
      });

      console.log("✅ Default staff account created");
    } else {
      console.log("ℹ️ Staff already exists");
    }
  } catch (err) {
    console.error("❌ Error creating staff:", err);
  }
};

/* 🔗 CONNECT DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await createAdmin();  // keep admin
    await createStaff();  // add staff account
  })
  .catch((err) => console.error(err));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/clearance", clearanceRoutes);

app.get("/", (req, res) => {
  res.send("TrustPermit API running");
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
