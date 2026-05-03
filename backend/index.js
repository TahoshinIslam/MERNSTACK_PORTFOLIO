const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // Load root .env

const app = require("../app");
const path = require("path");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
});
