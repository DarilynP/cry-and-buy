const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html by default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
