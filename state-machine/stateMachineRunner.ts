export type Context = any;

export interface TaskState {
  Type: "Task";
  Function: string;
  Next?: string;
  End?: boolean;
}

export interface ChoiceRule {
  Condition: (input: Context) => boolean;
  Next: string;
}

export interface ChoiceState {
  Type: "Choice";
  Choices: ChoiceRule[];
  Default: string;
}

export interface ParallelBranch {
  StartAt: string;
  States: { [name: string]: State };
}

export interface ParallelState {
  Type: "Parallel";
  Branches: ParallelBranch[];
  Next?: string;
}

export interface MapIterator {
  StartAt: string;
  States: { [name: string]: State };
}

export interface MapState {
  Type: "Map";
  ItemsPath: string;
  Iterator: MapIterator;
  Next?: string;
}

export interface SucceedState {
  Type: "Succeed";
}

export type State =
  | TaskState
  | ChoiceState
  | ParallelState
  | MapState
  | SucceedState;

export interface StateMachineDefinition {
  StartAt: string;
  States: { [name: string]: State };
}

export class StateMachineRunner {
  constructor(
    private definition: StateMachineDefinition,
    private functions: Record<string, (input: Context) => Promise<Context>>,
  ) {}

  async run(input: Context): Promise<Context> {
    return this.executeState(this.definition.StartAt, input);
  }

  private async executeState(
    stateName: string,
    input: Context,
  ): Promise<Context> {
    const state = this.definition.States[stateName];

    switch (state.Type) {
      case "Task": {
        const fn = this.functions[state.Function];
        if (!fn) throw new Error(`Function '${state.Function}' not found`);

        const output = await fn(input);
        const merged = { ...input, ...output }; // merge context
        const isTerminal = state.End === true;
        return isTerminal
          ? merged
          : state.Next
            ? this.executeState(state.Next, merged)
            : merged;
      }

      case "Choice": {
        for (const choice of state.Choices) {
          if (choice.Condition(input)) {
            return this.executeState(choice.Next, input);
          }
        }
        return this.executeState(state.Default, input);
      }

      case "Parallel": {
        const results = await Promise.all(
          state.Branches.map((branch) => {
            const subDef: StateMachineDefinition = {
              StartAt: branch.StartAt,
              States: branch.States,
            };
            const runner = new StateMachineRunner(subDef, this.functions);
            return runner.run(input);
          }),
        );
        const merged = { ...input, parallelResults: results };
        const nextInput = state.Next
          ? await this.executeState(state.Next, merged)
          : merged;

        // Strip parallelResults
        const { parallelResults, ...cleaned } = nextInput;
        return cleaned;
      }

      case "Map": {
        const items: any[] = input[state.ItemsPath];
        if (!Array.isArray(items)) {
          throw new Error(`Map items at '${state.ItemsPath}' must be array`);
        }

        const results: any[] = [];
        // process each item one by one
        for (const item of items) {
          const subDef: StateMachineDefinition = {
            StartAt: state.Iterator.StartAt,
            States: state.Iterator.States,
          };
          const runner = new StateMachineRunner(subDef, this.functions);
          const res = await runner.run(item);
          results.push(res);
        }

        const newCtx = { ...input, [state.ItemsPath]: results };
        return state.Next ? this.executeState(state.Next, newCtx) : newCtx;
      }

      case "Succeed":
        return input;

      default:
        throw new Error(`Unsupported state type: ${(state as any).Type}`);
    }
  }
}
