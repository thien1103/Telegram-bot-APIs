const express = require("express");
const jwt = require("jsonwebtoken");
const url = require("url");
require("dotenv").config();

const app = express();

// Set up a view engine (e.g., EJS)
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/user", (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const token = parsedUrl.query.token;

  try {
    // Decode the JWT token
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    // Render the user data on a view engine page
    res.render("user", { userData });
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(400).send("Invalid token");
  }
});

const port = process.env.PORT || 9993;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
