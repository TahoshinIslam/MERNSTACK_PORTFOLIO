const app = require("./app");

if (process.env.NODE_ENV !== "production") {
  let PORT = process.env.PORT || 5005;
  app.listen(PORT, function () {
    console.log("App run port: ", PORT);
  });
}

module.exports = app; // ← This line is required
