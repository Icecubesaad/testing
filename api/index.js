const express = require("express");
const app = express();
const database = require("./DB/Database");
const path = require("path");

// Initialize database connection
database();

// Use express.json() directly
app.use(express.json({ limit: "500mb" }));

const port = process.env.PORT || 3000;
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
  
    // Set the response status to 500
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  // Rest of your code...
  
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
app.use("/api/blogs", require("./Router/Blogs"));
app.use("/api/auth", require("./Router/Auth"));

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
module.exports = app;
