const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
