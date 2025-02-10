import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import { addModelToVideo, removeModelFromVideo } from "../connector";

// add machine code
const dedupeMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QUgVwA5gHQCcwEMIBPAYgBEBRMgVQAUKBtABgF1FR0B7WASwBcenAHbsQAD0QBaAMwBWWVgCcTACyKAHJoBMi6erkB2ADQgiiLdJVYtWgIyyAbA-UadWlVoC+nkyggZsPEJSMgAlAHlaZjYkEC5eAWFRCQRJW3dFLANFd1lbJwcDPXUTMwR3ByxbD3t1JiYdaQcmA29fNEwsAGNOAFt0ABswPkgSCGFsHiEAN04Aa2w-AO6+weHIBCnZrvxEoWjo0Xj+QRFYlMkiq3UHaS1HOy0nFQdSxHl1LLrNAxV1e1kFjaICWnXQOE4XTgvCEUFwYF6nGmYAA+oiUAMxhMsFt5osOthwZDoVM4XhEci0ZwMZsZpDdqcDqwjtwTklzohbrYsI51B5FLI9Hl8m8EP9PgYbvVpNJ8i1ZOpgaDCRCobAYWSEUjUeiwJiwDgITgsINdgAzTg4XpYZUm1Uk2Hwik66l62nbBnCJkxDisvbJRAuT7ODx6RS2AxaFyyUWKKwGdJMWxNeS2AW3JUEu3E9WkrCECBUjFYoSTOkLG1ZolqjX5iCF3UDd30vbelkJU4B8oOKyAp62dQWWxMeQy0V6Aw85qylRqAySlqZ-xg+25x0Fot6kgGo0mgbmy3W23Vh1wjeN5s7VusQ6xY7+jkIZwKaQNAwFcNxpOiuyT9IOQUmCcSw7kUBwl2WE81zhZdUR3S0SFCCgAGFwgANQoUJb19Dt2VAC5AWkLAXn7FMXGkONRWHLQsCTdRJXnLQDAVXRFR8EEs1LMQ+AAAn4BESGwuI-U7R9JF0LBBw0G5NDjLQmBuUUpMkwUgyYcNZBaFQIM6LjeP43pBNsH1hNws58KkFR0iUOwHH7Rx7DuGNTEDHQVLDOoNK0nTFghdB0DzCA-J4xsSzLWYK1tILOH8wLgovXEr0ZG9mTvES8PEKRqiKJRZwcZRFE-JNpFFSMmGsFpLEqjJ5B8m0-ICx1ovQELXX1Q1LT3A8rUrWD6pixqYPitrL09fYUpM+9RIs1IIzsSSVElF5h00hUVFFfksFuSMXFuOyB209iooauKYp4+CcEQlD0MwoSpoyi5qhHLA7icTQWhcd8fzTWjbLjZobkse46uani9ME1KcLZczMtmoceQHDQNIMBTIyUtz1EFHIBwcHHZBB4LwYYYz22hrs0nqBQVE0+oGiacNB3RzJMYnFQ7lsaowO8dihFdeBYmVUmHxmtJMcqdwVCAtMgMcJgSpc1I6mseiBXuX4k00w72j6oJiCF6bYcuedrBsADfn0PJnLKWyqjl1GzbjCj8aOrMen6IYRggfWHqkc2XoTYcR3p8NjAVwdKn0VQ8nksCIzY7XINXDVvZhlIFSI3l+VU4VXgVydHjt2RJdkZQdFsOqoNrcltU3AYU67THMnyDnWN0Sx-lKnL-mHJ36k-cCXb6yu83PNr68fQpuXSV8BTAwpNHWhWhWV-KgKaD654rpPAoCFELvHmaUcqBp7CswqkzZ2wqPsJQhXfQG5FUuq9L4kZegPw3I1osrB2qACi+YhtBSXxnAaHkIKSM5dB7LGaoND+j1vjWFnFLZQAFpxUVlDyX8LR3zqUjF4aBnRYGnRao2eBWVcFIMlrjVBst5ZlF+JUBUhR3B6AUq+eOHE+rEKasFfeaUzLkwjMOHkGgigDiYnYao31Mgn1XvReQ85aqEN8mdPS5C4YiMlmBVQHNGK5wYVZYiMoXBRxbnkbmnggA */
    id: "dedupe",
    initial: "ready",
    states: {
      ready: {
        on: {
          DEDUPE: {
            target: "processing",
            actions: "assignTrackModelInfo",
          },

          DROP: {
            target: "dropping",
            actions: "assignTrackModelInfo",
          },
        },

        description: `Machine is idle and waiting for commands`,
      },

      completed: {
        invoke: {
          src: "castingCompleted",
          onDone: [
            {
              target: "ready",
            },
          ],
        },
      },

      processing: {
        initial: "remove_model",
        states: {
          remove_model: {
            invoke: {
              src: "removeModel",
              onDone: [
                {
                  target: "add_model",
                },
              ],
              onError: [
                {
                  target: "dupe_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          add_model: {
            invoke: {
              src: "applyModel",
              onDone: {
                target: "#dedupe.next item",
                actions: "incrementIndex",
              },
              onError: [
                {
                  target: "dupe_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          dupe_error: {
            on: {
              RECOVER: {
                target: "#dedupe.ready",
                actions: "clearProblems",
              },
            },
          },
        },
      },

      "next item": {
        always: [
          {
            target: "processing",
            cond: "more items",
            actions: "incrementItems",
          },
          {
            target: "completed",
            actions: assign({
              item_index: 0,
              items: [],
              progress: 0,
            }),
          },
        ],
      },

      dropping: {
        states: {
          "drop model": {
            invoke: {
              src: "removeModel",
              onDone: {
                target: "#dedupe.drop next",
                actions: "incrementIndex",
              },
              onError: {
                target: "drop error",
                actions: "assignProblem",
              },
            },
          },

          "drop error": {
            on: {
              RECOVER: "#dedupe.ready",
            },
          },
        },

        initial: "drop model",
      },

      "drop next": {
        always: [
          {
            target: "dropping",
            cond: "more items",
            actions: "incrementItems",
          },
          {
            target: "completed",
            actions: assign({
              item_index: 0,
              items: [],
              progress: 0,
            }),
          },
        ],
      },
    },
    context: { item_index: 0, items: [], progress: 0 },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      clearProblems: assign({
        errorMsg: null,
        stack: null,
      }),
      incrementIndex: assign((context) => {
        return {
          item_index: context.item_index + 1,
        };
      }),
      incrementItems: assign((context) => {
        return {
          trackFk: context.items[context.item_index].trackFk,
          modelFk: context.items[context.item_index].modelFk,
          progress: 100 * ((context.item_index + 1) / context.items.length),
        };
      }),
      assignProblem: assign((_, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
      assignTrackModelInfo: assign((_, event) => ({
        items: event.items,
        item_index: 0,
        trackFk: event.items[0].trackFk,
        modelFk: event.items[0].modelFk,
        progress: 0,
      })),
    },
    guards: {
      "more items": (context) => context.item_index < context.items.length,
    },
  }
);

export const useDedupe = (onComplete) => {
  const [state, send] = useMachine(dedupeMachine, {
    services: {
      removeModel: async (context) =>
        await removeModelFromVideo(context.trackFk, context.modelFk),
      applyModel: async (context) =>
        await addModelToVideo(context.trackFk, context.modelFk),
      castingCompleted: async () => onComplete && onComplete(),
    },
  });

  return {
    state,
    send,
    ...state.context,
  };
};
