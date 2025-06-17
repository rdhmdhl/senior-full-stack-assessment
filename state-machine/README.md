## Instructions

This exercise simulates a state machine.
You have these state control options: "Task", "Choice", "Parallel", and "Map".

The state machine is triggered with a POST request containing a JSON input of an array of vinyl records.
You can find an example input in the file named `state-machine-input.json`

Although the state machine should resolve in less than a minute, assume that the state machine could take an hour to finish processing.
Consider the implications of a long-running process in traditional server-client architecture.

Your goal:

- Finish the definition of `developer-defined-files/functions.ts`
- Finish the definition of `developer-defined-files/stateMachineDefinition.ts`
- Finish the definition of the function `handleRunStateMachine` in `index.ts`
- As much logic as possible should be in the state machine as opposed to functions
- Do not edit other files like `mockAPI.ts` or `stateMachineRunner.ts`
- The final result from a state machine run should look like below, with an item for every record defined in the input body:

```json
{
  "vinylRecords": [
    {
      "title": "Abbey Road",
      "artist": "The Beatles",
      "id": 1,
      "available": false,
      "availableFrom": null,
      "publishingId": 419,
      "metadataVersion": 10,
      "isAuthentic": true
    },
    {
      "title": "Dark Side of the Moon",
      "artist": "Pink Floyd",
      "id": 2,
      "available": true,
      "availableFrom": 2,
      "publishingId": 223,
      "metadataVersion": 10,
      "isAuthentic": false
    }
  ]
}
```

## Setup and Run with Docker

```bash
docker-compose build
docker-compose up
```

## Bonus - not required but a nice-to-have

We can simulate error-prone APIs by running the program like this:

`MOCK_API_FAILURE=true npm start`

Your goal: Develop a way to handle these random failures

Edit any files necessary, including but not limited to `Dockerfile`, `mockAPI.ts`, and `stateMachineRunner.ts`
