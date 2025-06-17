import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";
import redis from "./utils/redis";

const port = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/search", async (req, res) => {
  const runId = Math.random().toString(36).substring(2);
  await redis.set(runId, JSON.stringify({ status: "processing" }), {
    EX: 60 * 60,
  });
  res.status(202).json({ runId });

  try {
    const response = await fetch("http://state-machine:3005/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, runId }),
    });

    const result = await response.json();
    console.log("result: ", result);
    await redis.set(
      runId,
      JSON.stringify({ status: "complete", data: result }),
      { EX: 60 * 60 },
    );
  } catch (err) {
    await redis.set(
      runId,
      JSON.stringify({ status: "error", error: "failed to process" }),
      {
        EX: 60 * 60,
      },
    );
  }
});

app.get("/status/:runId", async (req, res) => {
  try {
    const result = await redis.get(req.params.runId);
    if (!result) {
      res.status(404).json({
        status: "error",
        error: `Run ID '${req.params.runId}' not found or expired.`,
      });
      return;
    }

    const parsed = JSON.parse(result);
    console.log("parsed from redis", parsed);
    if (parsed.error) {
      res.status(500).json({ status: "error", error: parsed.error });
      return;
    }
    if (parsed.status === "complete") {
      res.status(200).json({ data: parsed.data, status: parsed.status });
      return;
    }
    res.status(202).json({ status: "processing" });
  } catch (err) {
    console.error("error parsing redis result: ", err);
    res.status(500).json({ status: "error", error: "invalid cached data" });
    return;
  }
});

app.listen(port, () => {
  console.log("Backend running at http://localhost:", port);
});
