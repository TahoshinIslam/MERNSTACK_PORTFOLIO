require("dotenv").config(); // ✅ Load env variables correctly

const app = require("../app"); // adjust if path differs

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
