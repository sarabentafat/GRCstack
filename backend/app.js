const dotenv = require("dotenv");
dotenv.config();
const connectToDb = require("./config/connectToDb");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

// Apply body-parser middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://brainy-testingmode.vercel.app",
];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Enable credentials
  })
);
const mongoose = require("mongoose");

//middlewares
app.use(express.json());
connectToDb();



//ROUTES


app.use("/api/projects", require("./routes/projectsRoute"));
app.use("/api/audits", require("./routes/auditsRoute"));
app.use("/api/frameworks", require("./routes/frameworksRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.get("/", (req, res) => {
  res.send("ITS WORKING YAY ");
});




const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(
    `Server is listening in ${process.env.NODE_ENV} mode on port ${port}`
  );
});
