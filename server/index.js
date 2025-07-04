const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");

// create express app and socket server
const { app, server } = require("./socket/socket.js");

// setup middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// setup static files
app.use("/uploads", express.static("uploads"));

// home route redirect to frontend homepage
app.get("/", (_, res) => {
  res.redirect(process.env.CLIENT_URL);
});

// middleware for role base authentication
const authenticateToken = (roles) => {
  return (req, res, next) => {
    const token = req.cookies?.access_token;
    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      if (!roles.includes(user.role))
        return res.status(403).json({ message: "Forbidden" });
      req.user = user;
      next();
    });
  };
};

// auth routes
app.use("/auth", require("./routes/auth"));

// common auth routes
app.use(
  "/common",
  authenticateToken(["CLIENT", "COACH", "ADMIN"]),
  require("./routes/common")
);

// client routes
app.use("/client", authenticateToken(["CLIENT"]), require("./routes/client"));

// coach routes
app.use("/coach", authenticateToken(["COACH"]), require("./routes/coach"));

// admin routes
app.use("/admin", authenticateToken(["ADMIN"]), require("./routes/admin"));

// public routes
app.use("/public", require("./routes/public"));

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum is 5 files." });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field." });
    }
  }
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

// server run on port 8000 or env port
const port = process.env.PORT || 8000;
// listen to port
server.listen(port, () => {
  console.log("Server is running on port 8000");
});
