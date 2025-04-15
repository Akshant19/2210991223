const express = require("express");
const cors = require("cors");
const { setupRoutes } = require("./routes");
const { initializeAuth } = require("./services/auth.service");
const dataService = require("./services/data.service");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await initializeAuth();
    dataService.startPeriodicUpdate();
  } catch (error) {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  }
})();

setupRoutes(app);

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Microservice running on port ${PORT}`);
});
