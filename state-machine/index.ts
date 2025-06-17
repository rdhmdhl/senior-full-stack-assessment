import express, { Request, Response } from "express";
import { StateMachineRunner } from "./stateMachineRunner";
import { stateMachineDefinition } from "./developer-defined-files/stateMachineDefinition";
import { functions } from "./developer-defined-files/functions";

const handleRunStateMachine = async (req: Request, res: Response) => {
  const { runId, ...rest } = req.body;
  const input = { ...rest, runId };
  const runner = new StateMachineRunner(stateMachineDefinition, functions);
  try {
    const result = await runner.run(input);
    res.status(200).json(result);
  } catch (err) {
    console.error(`[${runId}] ERROR during execution:`, err);
    res.status(500).json({ error: "State machine execution failed" });
  }
};

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.post("/run", handleRunStateMachine);

app.listen(PORT, () => {
  console.log(`State machine container listening on port ${PORT}`);
});
