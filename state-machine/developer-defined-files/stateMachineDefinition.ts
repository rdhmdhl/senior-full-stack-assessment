import { StateMachineDefinition } from "../stateMachineRunner";
export const stateMachineDefinition: StateMachineDefinition = {
  StartAt: "MapOverVinyls",
  States: {
    MapOverVinyls: {
      Type: "Map",
      ItemsPath: "vinylRecords",
      Iterator: {
        StartAt: "QueryStore1",
        States: {
          QueryStore1: {
            Type: "Task",
            Function: "checkStore1",
            Next: "CheckStore1Result",
          },
          CheckStore1Result: {
            Type: "Choice",
            Choices: [
              {
                Condition: (input) => input.available === true,
                Next: "VerifyAuthenticity",
              },
            ],
            Default: "QueryStore2",
          },
          QueryStore2: {
            Type: "Task",
            Function: "checkStore2",
            Next: "CheckStore2Result",
          },
          CheckStore2Result: {
            Type: "Choice",
            Choices: [
              {
                Condition: (input) => input.available === true,
                Next: "VerifyAuthenticity",
              },
            ],
            Default: "QueryStore3",
          },
          QueryStore3: {
            Type: "Task",
            Function: "checkStore3",
            Next: "CheckStore3Result",
          },
          CheckStore3Result: {
            Type: "Choice",
            Choices: [
              {
                Condition: (input) => input.available === true,
                Next: "VerifyAuthenticity",
              },
            ],
            Default: "MarkAsUnavailable",
          },
          VerifyAuthenticity: {
            Type: "Task",
            Function: "verifyAuthenticity",
            End: true,
          },
          MarkAsUnavailable: {
            Type: "Task",
            Function: "markUnavailable",
            End: true,
          },
        },
      },
    },
  },
};
