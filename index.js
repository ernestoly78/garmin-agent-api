import express from "express";

const app = express();

app.get("/summary", async (req, res) => {
  res.json({
    steps: 8500,
    sleep: 7.1,
    stress: 42
  });
});

app.listen(3000, () => {
  console.log("API running");
});
